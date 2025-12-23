"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { db, storage } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  getDocs,
  setDoc 
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { 
  Star, 
  MapPin, 
  Users, 
  LogOut, 
  ImageIcon, 
  Home, 
  FolderPlus, 
  FolderOpen, 
  Globe, 
  Building2, 
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Save,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  User,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Tag,
  Hash,
  Menu,
  FolderTree,
  Layers,
  MoveDown,
  MoveUp,
  Settings,
  LayoutDashboard,
  Network
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface TeamMember {
  id: string
  name: string
  designation: string
  location: string
  image: string
  menuId: string // Reference to menu item
  order: number
  createdAt?: string
  updatedAt?: string
  imagePath?: string
}

interface MenuItem {
  id: string
  title: string
  type: "main" | "submenu" // main = top-level (National), submenu = nested (State/District/etc)
  parentId: string | null // null for main menu items
  order: number
  level: number // 0 = main, 1 = submenu, 2 = sub-submenu, etc.
  teamMembers: string[] // Array of team member IDs
  createdAt?: string
  updatedAt?: string
}

interface Banner {
  id: string
  imageUrl: string
  title?: string
  description?: string
  order: number
  active: boolean
  imagePath?: string
}

export default function AdminDashboard() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [activeTab, setActiveTab] = useState<"team" | "banners">("team")
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  
  const [newMember, setNewMember] = useState({
    name: "",
    designation: "",
    location: "",
    image: "",
    menuId: "",
    order: 0,
  })
  
  const [newMenuItem, setNewMenuItem] = useState({
    title: "",
    type: "main" as "main" | "submenu",
    parentId: null as string | null,
    order: 0,
    level: 0
  })
  
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    order: 0,
    active: true
  })
  
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editingImageFile, setEditingImageFile] = useState<File | null>(null)
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [editingPreviewUrl, setEditingPreviewUrl] = useState<string | null>(null)
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const response = await fetch("/api/admin/check-auth")
      if (!response.ok) {
        router.push("/dashboard/login")
      }
    } catch (error) {
      router.push("/dashboard/login")
    } finally {
      setLoading(false)
    }
  }

  // Clear object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (editingPreviewUrl) URL.revokeObjectURL(editingPreviewUrl)
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl)
    }
  }, [previewUrl, editingPreviewUrl, bannerPreviewUrl])

  // Load data on mount
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        console.log("Loading team members from Firestore...")
        setError(null)

        const q = query(collection(db, "teamMembers"), orderBy("order"))
        const querySnapshot = await getDocs(q)

        const members: TeamMember[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          members.push({
            id: doc.id,
            name: data.name || "",
            designation: data.designation || "",
            location: data.location || "",
            image: data.image || "",
            menuId: data.menuId || "",
            order: data.order || 0,
            createdAt: data.createdAt || "",
            updatedAt: data.updatedAt || "",
            imagePath: data.imagePath || "",
          } as TeamMember)
        })

        members.sort((a, b) => (a.order || 0) - (b.order || 0))
        setTeamMembers(members)
        console.log(`✅ Loaded ${members.length} team members`)
      } catch (err: any) {
        console.error("Error loading team members:", err)
        setError(`Failed to load team members: ${err.message}`)
      }
    }

    const loadMenuItems = async () => {
      try {
        console.log("Loading menu items from Firestore...")
        const q = query(collection(db, "menuItems"), orderBy("order"))
        const querySnapshot = await getDocs(q)

        const items: MenuItem[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          items.push({
            id: doc.id,
            title: data.title || "",
            type: data.type || "main",
            parentId: data.parentId || null,
            order: data.order || 0,
            level: data.level || 0,
            teamMembers: data.teamMembers || [],
            createdAt: data.createdAt || "",
            updatedAt: data.updatedAt || "",
          } as MenuItem)
        })

        items.sort((a, b) => (a.order || 0) - (b.order || 0))
        setMenuItems(items)
        console.log(`✅ Loaded ${items.length} menu items`)
        
        // Select first main menu if available
        const firstMain = items.find(item => item.type === "main")
        if (firstMain) {
          setSelectedMenuId(firstMain.id)
          setExpandedMenus(new Set([firstMain.id]))
        }
      } catch (err: any) {
        console.error("Error loading menu items:", err)
        setError(`Failed to load menu items: ${err.message}`)
      }
    }

    const setupRealtimeListener = () => {
      try {
        console.log("🔄 Setting up Firestore real-time listener...")

        const q = query(collection(db, "teamMembers"), orderBy("order"))

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const members: TeamMember[] = []
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              members.push({
                id: doc.id,
                name: data.name || "",
                designation: data.designation || "",
                location: data.location || "",
                image: data.image || "",
                menuId: data.menuId || "",
                order: data.order || 0,
                createdAt: data.createdAt || "",
                updatedAt: data.updatedAt || "",
                imagePath: data.imagePath || "",
              } as TeamMember)
            })

            members.sort((a, b) => (a.order || 0) - (b.order || 0))
            setTeamMembers(members)
          },
          (error) => {
            console.error("Error in Firestore listener:", error)
            setError(`Real-time updates paused: ${error.message}`)
          },
        )

        return unsubscribe
      } catch (err: any) {
        console.error("❌ Setup error:", err)
        setError(`Setup error: ${err.message}`)
        return () => {}
      }
    }

    const setupMenuListener = () => {
      try {
        console.log("🔄 Setting up menu items real-time listener...")

        const q = query(collection(db, "menuItems"), orderBy("order"))

        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const items: MenuItem[] = []
            querySnapshot.forEach((doc) => {
              const data = doc.data()
              items.push({
                id: doc.id,
                title: data.title || "",
                type: data.type || "main",
                parentId: data.parentId || null,
                order: data.order || 0,
                level: data.level || 0,
                teamMembers: data.teamMembers || [],
                createdAt: data.createdAt || "",
                updatedAt: data.updatedAt || "",
              } as MenuItem)
            })

            items.sort((a, b) => (a.order || 0) - (b.order || 0))
            setMenuItems(items)
          },
          (error) => {
            console.error("Error in menu listener:", error)
          }
        )

        return unsubscribe
      } catch (err: any) {
        console.error("❌ Menu listener error:", err)
        return () => {}
      }
    }

    let unsubscribe: () => void = () => {}
    let unsubscribeMenu: () => void = () => {}

    const init = async () => {
      await loadTeamMembers()
      await loadMenuItems()
      unsubscribe = setupRealtimeListener()
      unsubscribeMenu = setupMenuListener()
    }

    init()

    return () => {
      console.log("🧹 Cleaning up Firestore listeners")
      unsubscribe()
      unsubscribeMenu()
    }
  }, [])

  // Load banners
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const q = query(collection(db, "homeBanners"), orderBy("order"))
        const querySnapshot = await getDocs(q)
        
        const bannersData: Banner[] = []
        querySnapshot.forEach((doc) => {
          bannersData.push({
            id: doc.id,
            ...doc.data()
          } as Banner)
        })
        
        setBanners(bannersData)
      } catch (err: any) {
        console.error("Error loading banners:", err)
      }
    }

    loadBanners()
  }, [])

  // Helper functions for menu hierarchy
  const getMainMenus = () => {
    return menuItems.filter(item => item.type === "main")
  }

  const getChildren = (parentId: string) => {
    return menuItems
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.order - b.order)
  }

  const getParentChain = (menuId: string): MenuItem[] => {
    const chain: MenuItem[] = []
    let currentId: string | null = menuId
    
    while (currentId) {
      const item = menuItems.find(m => m.id === currentId)
      if (!item) break
      chain.unshift(item)
      currentId = item.parentId
    }
    
    return chain
  }

  const toggleExpand = (menuId: string) => {
    const newExpanded = new Set(expandedMenus)
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId)
    } else {
      newExpanded.add(menuId)
    }
    setExpandedMenus(newExpanded)
  }

  const getFilteredMembers = () => {
    if (!selectedMenuId) return []
    return teamMembers.filter(member => member.menuId === selectedMenuId)
  }

  const filteredMembers = getFilteredMembers()

  // Upload image to Firebase Storage
  const uploadImageToFirebaseStorage = async (
    file: File, 
    existingImagePath?: string, 
    folder: "team-members" | "home-banners" = "team-members"
  ): Promise<{url: string, path: string}> => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      console.log("📤 Starting Firebase Storage upload...")

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file (JPEG, PNG, WebP, etc.)")
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB")
      }

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${timestamp}_${randomString}_${sanitizedName}`
      const storagePath = `${folder}/${fileName}`
      
      const storageRef = ref(storage, storagePath)
      const snapshot = await uploadBytes(storageRef, file)
      console.log("✅ File uploaded successfully:", snapshot)
      
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      console.log("✅ Firebase Storage upload complete - URL:", downloadURL, "Path:", storagePath)

      if (existingImagePath && existingImagePath !== storagePath) {
        try {
          const oldImageRef = ref(storage, existingImagePath)
          await deleteObject(oldImageRef)
          console.log("🗑️ Deleted old image from storage:", existingImagePath)
        } catch (deleteError) {
          console.warn("⚠️ Could not delete old image:", deleteError)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      return { url: downloadURL, path: storagePath }
    } catch (error: any) {
      console.error("❌ Error uploading image:", error)
      throw new Error(`Failed to upload image: ${error.message || "Unknown error"}`)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/dashboard/login")
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false, isBanner = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, WebP, etc.)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    const objectUrl = URL.createObjectURL(file)

    if (isBanner) {
      setBannerImageFile(file)
      setBannerPreviewUrl(objectUrl)
    } else if (isEditing) {
      setEditingImageFile(file)
      setEditingPreviewUrl(objectUrl)
    } else {
      setImageFile(file)
      setPreviewUrl(objectUrl)
      setNewMember((prev) => ({ ...prev, image: objectUrl }))
    }
  }

  // Handle adding new menu item
  const handleAddMenuItem = async () => {
    console.log("➕ Adding new menu item...")

    setError(null)
    setSuccess(null)

    if (!newMenuItem.title.trim()) {
      setError("Please enter menu item title")
      return
    }

    // Check for duplicate names under same parent
    const duplicate = menuItems.find(item => 
      item.title.toLowerCase() === newMenuItem.title.toLowerCase() && 
      item.parentId === newMenuItem.parentId
    )
    
    if (duplicate) {
      setError("A menu item with this name already exists at this level")
      return
    }

    try {
      setUploading(true)

      // Calculate order and level
      const siblings = menuItems.filter(item => item.parentId === newMenuItem.parentId)
      const highestOrder = siblings.length > 0 ? Math.max(...siblings.map(item => item.order || 0)) : 0
      
      let level = 0
      if (newMenuItem.parentId) {
        const parent = menuItems.find(item => item.id === newMenuItem.parentId)
        level = parent ? parent.level + 1 : 0
      }

      // Prepare menu item data
      const menuData: any = {
        title: newMenuItem.title.trim(),
        type: newMenuItem.type,
        parentId: newMenuItem.parentId,
        order: highestOrder + 1,
        level: level,
        teamMembers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log("📝 Saving menu item to Firestore:", menuData)

      const docRef = await addDoc(collection(db, "menuItems"), menuData)
      console.log("✅ Menu item added with ID:", docRef.id)

      // Reset form
      setNewMenuItem({ title: "", type: "main", parentId: null, order: 0, level: 0 })
      setShowMenuForm(false)

      setSuccess(`✅ ${newMenuItem.type === "main" ? "Main menu" : "Submenu"} added successfully!`)
      setTimeout(() => setSuccess(null), 5000)
    } catch (error: any) {
      console.error("❌ Error adding menu item:", error)
      setError(`Failed to add menu item: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle updating menu item
  const handleUpdateMenuItem = async () => {
    if (!editingMenuItem) return

    console.log("✏️ Updating menu item:", editingMenuItem.id)

    setError(null)
    setSuccess(null)
    setUploading(true)

    try {
      const menuData: any = {
        title: editingMenuItem.title.trim(),
        order: editingMenuItem.order || 0,
        updatedAt: new Date().toISOString(),
      }

      console.log("📝 Updating Firestore menu item:", editingMenuItem.id, menuData)

      const menuRef = doc(db, "menuItems", editingMenuItem.id)
      await updateDoc(menuRef, menuData)

      setEditingMenuItem(null)

      setSuccess("✅ Menu item updated successfully!")
      setTimeout(() => setSuccess(null), 5000)
    } catch (error: any) {
      console.error("❌ Error updating menu item:", error)
      setError(`Failed to update menu item: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle deleting menu item
  const handleDeleteMenuItem = async (id: string) => {
    const menuItem = menuItems.find(item => item.id === id)
    if (!menuItem) return

    // Get all descendants
    const getAllDescendants = (parentId: string): string[] => {
      const children = menuItems.filter(item => item.parentId === parentId)
      let descendants = children.map(child => child.id)
      children.forEach(child => {
        descendants = [...descendants, ...getAllDescendants(child.id)]
      })
      return descendants
    }

    const allItemsToDelete = [id, ...getAllDescendants(id)]
    
    if (!confirm(`Are you sure you want to delete "${menuItem.title}" and all its submenus? This will also delete all team members in these menus.`)) return

    try {
      console.log("🗑️ Deleting menu item and descendants:", allItemsToDelete)
      
      // Delete all team members in these menus
      const membersToDelete = teamMembers.filter(member => allItemsToDelete.includes(member.menuId))
      await Promise.all(
        membersToDelete.map(async (member) => {
          if (member.imagePath) {
            try {
              const imageRef = ref(storage, member.imagePath)
              await deleteObject(imageRef)
            } catch (storageError) {
              console.warn("⚠️ Could not delete image from storage:", storageError)
            }
          }
          
          await deleteDoc(doc(db, "teamMembers", member.id))
        })
      )
      
      // Delete all menu items
      await Promise.all(
        allItemsToDelete.map(async (itemId) => {
          await deleteDoc(doc(db, "menuItems", itemId))
        })
      )
      
      // Reset selection if needed
      if (selectedMenuId && allItemsToDelete.includes(selectedMenuId)) {
        const firstMain = getMainMenus()[0]
        setSelectedMenuId(firstMain?.id || null)
      }
      
      setSuccess("✅ Menu item and all associated submenus and team members deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error deleting menu item:", error)
      setError(`Failed to delete menu item: ${error.message}`)
    }
  }

  // Handle reordering menu items
  const handleMenuReorder = async (id: string, direction: "up" | "down") => {
    const item = menuItems.find(m => m.id === id)
    if (!item) return

    const siblings = menuItems
      .filter(m => m.parentId === item.parentId)
      .sort((a, b) => a.order - b.order)

    const currentIndex = siblings.findIndex(m => m.id === id)
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= siblings.length) return

    try {
      const tempOrder = item.order
      item.order = siblings[targetIndex].order
      siblings[targetIndex].order = tempOrder

      await Promise.all([
        updateDoc(doc(db, "menuItems", item.id), {
          order: item.order,
          updatedAt: new Date().toISOString(),
        }),
        updateDoc(doc(db, "menuItems", siblings[targetIndex].id), {
          order: siblings[targetIndex].order,
          updatedAt: new Date().toISOString(),
        }),
      ])

      console.log("🔄 Menu order updated successfully")
    } catch (error: any) {
      console.error("Error updating menu order:", error)
      setError("Failed to update order. Please refresh the page.")
    }
  }

  // Handle adding new member
  const handleAddMember = async () => {
    console.log("➕ Adding new team member...")

    setError(null)
    setSuccess(null)

    if (!newMember.name.trim()) {
      setError("Please enter team member name")
      return
    }

    if (!newMember.designation.trim()) {
      setError("Please enter designation")
      return
    }

    if (!newMember.location.trim()) {
      setError("Please enter location")
      return
    }

    if (!newMember.menuId) {
      setError("Please select a menu to add this member to")
      return
    }

    try {
      setUploading(true)

      let imageUrl = ""
      let imagePath = ""

      if (imageFile) {
        try {
          console.log("📤 Uploading image to Firebase Storage...")
          const firebaseResult = await uploadImageToFirebaseStorage(imageFile)
          imageUrl = firebaseResult.url
          imagePath = firebaseResult.path
          console.log("✅ Image uploaded to Firebase Storage:", imageUrl)
        } catch (uploadError: any) {
          console.error("❌ Image upload failed:", uploadError)
          setError(`Image upload failed: ${uploadError.message}`)
          setUploading(false)
          return
        }
      } else if (newMember.image && newMember.image.startsWith("blob:")) {
        setError("Please select an image file to upload")
        setUploading(false)
        return
      }

      // Calculate order
      const membersInMenu = teamMembers.filter(member => member.menuId === newMember.menuId)
      const highestOrder = membersInMenu.length > 0 ? Math.max(...membersInMenu.map((m) => m.order || 0)) : 0

      const memberData: any = {
        name: newMember.name.trim(),
        designation: newMember.designation.trim(),
        location: newMember.location.trim(),
        menuId: newMember.menuId,
        order: highestOrder + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (imageUrl) {
        memberData.image = imageUrl
        memberData.imagePath = imagePath
      }

      console.log("📝 Saving to Firestore:", memberData)

      if (!db) {
        throw new Error("Firebase is not initialized")
      }

      const docRef = await addDoc(collection(db, "teamMembers"), memberData)
      console.log("✅ Document written with ID:", docRef.id)

      // Update menu item with this member reference
      const menuRef = doc(db, "menuItems", newMember.menuId)
      const menuItem = menuItems.find(item => item.id === newMember.menuId)
      if (menuItem) {
        await updateDoc(menuRef, {
          teamMembers: [...(menuItem.teamMembers || []), docRef.id],
          updatedAt: new Date().toISOString(),
        })
      }

      clearForm()

      setSuccess("✅ Team member added successfully!")
      setTimeout(() => setSuccess(null), 5000)
    } catch (error: any) {
      console.error("❌ Error adding team member:", error)
      setError(`Failed to add team member: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle updating member
  const handleUpdateMember = async () => {
    if (!editingMember) return

    console.log("✏️ Updating team member:", editingMember.id)

    setError(null)
    setSuccess(null)
    setUploading(true)

    try {
      let imageUrl = editingMember.image || ""
      let imagePath = editingMember.imagePath || ""

      if (editingImageFile) {
        try {
          console.log("📤 Uploading new image to Firebase Storage...")
          const firebaseResult = await uploadImageToFirebaseStorage(editingImageFile, editingMember.imagePath)
          imageUrl = firebaseResult.url
          imagePath = firebaseResult.path
          console.log("✅ New image uploaded:", imageUrl)
        } catch (uploadError: any) {
          console.error("❌ Image upload failed:", uploadError)
          setError(`Image upload failed: ${uploadError.message}`)
          setUploading(false)
          return
        }
      }

      const memberData: any = {
        name: editingMember.name.trim(),
        designation: editingMember.designation.trim(),
        location: editingMember.location.trim(),
        menuId: editingMember.menuId,
        order: editingMember.order || 0,
        updatedAt: new Date().toISOString(),
      }

      if (imageUrl) {
        memberData.image = imageUrl
        memberData.imagePath = imagePath
      }

      console.log("📝 Updating Firestore document:", editingMember.id, memberData)

      const memberRef = doc(db, "teamMembers", editingMember.id)
      await updateDoc(memberRef, memberData)

      setEditingMember(null)
      setEditingImageFile(null)
      if (editingPreviewUrl) {
        URL.revokeObjectURL(editingPreviewUrl)
        setEditingPreviewUrl(null)
      }

      setSuccess("✅ Team member updated successfully!")
      setTimeout(() => setSuccess(null), 5000)
    } catch (error: any) {
      console.error("❌ Error updating team member:", error)
      setError(`Failed to update team member: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteMember = async (id: string, imagePath?: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    try {
      console.log("🗑️ Deleting team member:", id)
      
      if (imagePath) {
        try {
          console.log("🗑️ Deleting image from storage:", imagePath)
          const imageRef = ref(storage, imagePath)
          await deleteObject(imageRef)
          console.log("✅ Image deleted from storage")
        } catch (storageError) {
          console.warn("⚠️ Could not delete image from storage:", storageError)
        }
      }

      await deleteDoc(doc(db, "teamMembers", id))
      
      // Remove member reference from menu item
      const member = teamMembers.find(m => m.id === id)
      if (member && member.menuId) {
        const menuRef = doc(db, "menuItems", member.menuId)
        const menuItem = menuItems.find(item => item.id === member.menuId)
        if (menuItem) {
          await updateDoc(menuRef, {
            teamMembers: (menuItem.teamMembers || []).filter((mid: string) => mid !== id),
            updatedAt: new Date().toISOString(),
          })
        }
      }
      
      setSuccess("✅ Team member deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (error: any) {
      console.error("Error deleting team member:", error)
      setError(`Failed to delete team member: ${error.message}`)
    }
  }

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const members = [...filteredMembers]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= members.length) return

    try {
      const member1 = members[index]
      const member2 = members[targetIndex]

      const tempOrder = member1.order
      member1.order = member2.order
      member2.order = tempOrder

      await Promise.all([
        updateDoc(doc(db, "teamMembers", member1.id), {
          order: member1.order,
          updatedAt: new Date().toISOString(),
        }),
        updateDoc(doc(db, "teamMembers", member2.id), {
          order: member2.order,
          updatedAt: new Date().toISOString(),
        }),
      ])

      console.log("🔄 Order updated successfully")
    } catch (error: any) {
      console.error("Error updating order:", error)
      setError("Failed to update order. Please refresh the page.")
    }
  }

  // Banner Functions
  const handleAddBanner = async () => {
    if (!bannerImageFile) {
      setError("Please select an image for the banner")
      return
    }

    try {
      setUploading(true)
      setError(null)

      const imageData = await uploadImageToFirebaseStorage(bannerImageFile, undefined, "home-banners")

      const nextOrder = banners.length > 0 
        ? Math.max(...banners.map(b => b.order)) + 1 
        : 0

      const bannerData = {
        imageUrl: imageData.url,
        imagePath: imageData.path,
        title: newBanner.title.trim(),
        description: newBanner.description.trim(),
        order: nextOrder,
        active: newBanner.active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const docRef = doc(collection(db, "homeBanners"))
      await setDoc(docRef, bannerData)

      setNewBanner({ title: "", description: "", order: 0, active: true })
      setBannerImageFile(null)
      if (bannerPreviewUrl) {
        URL.revokeObjectURL(bannerPreviewUrl)
        setBannerPreviewUrl(null)
      }
      
      const q = query(collection(db, "homeBanners"), orderBy("order"))
      const querySnapshot = await getDocs(q)
      
      const bannersData: Banner[] = []
      querySnapshot.forEach((doc) => {
        bannersData.push({
          id: doc.id,
          ...doc.data()
        } as Banner)
      })
      
      setBanners(bannersData)
      
      setSuccess("✅ Banner added successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to add banner: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteBanner = async (banner: Banner) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      if (banner.imagePath) {
        try {
          const imageRef = ref(storage, banner.imagePath)
          await deleteObject(imageRef)
        } catch (err) {
          console.warn("Could not delete image from storage:", err)
        }
      }

      await deleteDoc(doc(db, "homeBanners", banner.id))

      setBanners(banners.filter(b => b.id !== banner.id))
      
      setSuccess("✅ Banner deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to delete banner: ${err.message}`)
    }
  }

  const handleBannerReorder = async (index: number, direction: "up" | "down") => {
    const newBanners = [...banners]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newBanners.length) return

    const tempOrder = newBanners[index].order
    newBanners[index].order = newBanners[targetIndex].order
    newBanners[targetIndex].order = tempOrder

    try {
      await Promise.all([
        setDoc(doc(db, "homeBanners", newBanners[index].id), {
          ...newBanners[index],
          updatedAt: new Date().toISOString()
        }),
        setDoc(doc(db, "homeBanners", newBanners[targetIndex].id), {
          ...newBanners[targetIndex],
          updatedAt: new Date().toISOString()
        })
      ])

      newBanners.sort((a, b) => a.order - b.order)
      setBanners(newBanners)
    } catch (err: any) {
      setError(`Failed to reorder: ${err.message}`)
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      const updatedBanner = {
        ...banner,
        active: !banner.active,
        updatedAt: new Date().toISOString()
      }

      await setDoc(doc(db, "homeBanners", banner.id), updatedBanner)
      
      setBanners(banners.map(b => 
        b.id === banner.id ? updatedBanner : b
      ))
      
      setSuccess(`✅ Banner ${updatedBanner.active ? 'activated' : 'deactivated'}!`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to update banner: ${err.message}`)
    }
  }

  const clearForm = () => {
    setNewMember({
      name: "",
      designation: "",
      location: "",
      image: "",
      menuId: "",
      order: 0,
    })
    setImageFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setError(null)
  }

  const clearEditingForm = () => {
    setEditingMember(null)
    setEditingImageFile(null)
    if (editingPreviewUrl) {
      URL.revokeObjectURL(editingPreviewUrl)
      setEditingPreviewUrl(null)
    }
  }

  const clearBannerForm = () => {
    setNewBanner({
      title: "",
      description: "",
      order: 0,
      active: true
    })
    setBannerImageFile(null)
    if (bannerPreviewUrl) {
      URL.revokeObjectURL(bannerPreviewUrl)
      setBannerPreviewUrl(null)
    }
  }

  const clearMenuForm = () => {
    setNewMenuItem({ title: "", type: "main", parentId: null, order: 0, level: 0 })
    setShowMenuForm(false)
    setError(null)
  }

  const clearEditingMenuForm = () => {
    setEditingMenuItem(null)
    setError(null)
  }

  // Recursive component to render menu tree
  const renderMenuTree = (parentId: string | null, level = 0) => {
    const items = menuItems
      .filter(item => item.parentId === parentId)
      .sort((a, b) => a.order - b.order)

    return items.map((item) => {
      const hasChildren = menuItems.some(child => child.parentId === item.id)
      const isExpanded = expandedMenus.has(item.id)
      const isSelected = selectedMenuId === item.id
      const memberCount = teamMembers.filter(m => m.menuId === item.id).length

      return (
        <div key={item.id} className="ml-4">
          <div
            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
              isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => toggleExpand(item.id)}
                className="p-1 hover:bg-gray-200 rounded"
                disabled={!hasChildren}
              >
                {hasChildren && (
                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                )}
                {!hasChildren && <div className="w-4 h-4" />}
              </button>
              
              <div className="flex items-center gap-2">
                {item.type === "main" ? (
                  <Globe className="w-4 h-4 text-blue-500" />
                ) : (
                  <Building2 className="w-4 h-4 text-green-500" />
                )}
                <button
                  onClick={() => setSelectedMenuId(item.id)}
                  className="text-left font-medium"
                >
                  {item.title}
                </button>
              </div>
              
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {memberCount} members
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleMenuReorder(item.id, "up")}
                className="p-1 hover:bg-gray-200 rounded"
                title="Move up"
              >
                <MoveUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleMenuReorder(item.id, "down")}
                className="p-1 hover:bg-gray-200 rounded"
                title="Move down"
              >
                <MoveDown className="w-3 h-3" />
              </button>
              <button
                onClick={() => setEditingMenuItem(item)}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded"
                title="Edit"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDeleteMenuItem(item.id)}
                className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-200 rounded"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {isExpanded && hasChildren && (
            <div className="mt-1">
              {renderMenuTree(item.id, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  if (loading && teamMembers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage team hierarchy and home page banners</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="self-start sm:self-center">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("team")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "team"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Management
                </div>
              </button>
              <button
                onClick={() => setActiveTab("banners")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "banners"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Banner Management
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="ml-2 p-1 text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
            <p className="text-green-700 flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-2 p-1 text-green-500 hover:text-green-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <ImageIcon size={16} />
                {uploadProgress < 100 ? "Uploading..." : "Processing..."}
              </span>
              <span className="text-sm font-bold text-blue-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* TEAM MANAGEMENT TAB */}
        {activeTab === "team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Menu Tree */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderTree className="text-blue-500" size={20} />
                      <h2 className="text-xl font-bold text-gray-900">Team Hierarchy</h2>
                    </div>
                    <button
                      onClick={() => setShowMenuForm(true)}
                      className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      title="Add New Menu"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Add New Menu Button */}
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setNewMenuItem({ title: "", type: "main", parentId: null, order: 0, level: 0 })
                        setShowMenuForm(true)
                      }}
                      className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      <span className="font-medium">Add Main Menu</span>
                    </button>
                  </div>
                  
                  {/* Menu Tree */}
                  <div className="space-y-1 max-h-[500px] overflow-y-auto">
                    {renderMenuTree(null)}
                  </div>
                  
                  {menuItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FolderTree className="mx-auto mb-2 text-gray-400" />
                      <p>No menu items yet. Add your first main menu above.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Add Member Form and Team Members */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add New Member Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Add Team Member</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter full name"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      value={newMember.designation}
                      onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter designation"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={newMember.location}
                      onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter location"
                      disabled={uploading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu *</label>
                    <select
                      value={newMember.menuId}
                      onChange={(e) => setNewMember({ ...newMember, menuId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      disabled={uploading || menuItems.length === 0}
                    >
                      <option value="">Select Menu</option>
                      {menuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {"—".repeat(item.level)} {item.title}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      First create a menu in the hierarchy on the left
                    </p>
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <label
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}
                        >
                          <Upload size={18} />
                          {uploading ? "Uploading..." : "Select Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, false)}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        {imageFile && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              Selected: {imageFile.name}
                            </span>
                            <button
                              onClick={() => {
                                setImageFile(null)
                                setNewMember({ ...newMember, image: "" })
                                if (previewUrl) {
                                  URL.revokeObjectURL(previewUrl)
                                  setPreviewUrl(null)
                                }
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                              disabled={uploading}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Image Preview */}
                      {(previewUrl || newMember.image) && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <div className="flex flex-wrap items-start gap-4">
                            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                              {previewUrl ? (
                                <img
                                  src={previewUrl || "/placeholder.svg"}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : newMember.image ? (
                                <img
                                  src={newMember.image || "/placeholder.svg"}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).style.display = "none"
                                    const parent = e.target.parentElement
                                    if (parent) {
                                      parent.innerHTML =
                                        '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Image</div>'
                                    }
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={handleAddMember}
                    disabled={uploading || !newMember.menuId}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      uploading || !newMember.menuId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Add Team Member
                      </>
                    )}
                  </button>
                  <button
                    onClick={clearForm}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Clear Form
                  </button>
                </div>
              </div>

              {/* Team Members Display */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-green-500" size={20} />
                      <h2 className="text-xl font-bold text-gray-900">Team Members</h2>
                    </div>
                    <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                      {selectedMenuId 
                        ? `${filteredMembers.length} members in ${menuItems.find(m => m.id === selectedMenuId)?.title || "selected menu"}`
                        : `${teamMembers.length} total members`
                      }
                    </span>
                  </div>
                  
                  {/* Selected Menu Path */}
                  {selectedMenuId && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Location:</span>
                        {getParentChain(selectedMenuId).map((item, index) => (
                          <div key={item.id} className="flex items-center gap-2">
                            {index > 0 && <ChevronRight className="w-3 h-3" />}
                            <span className="font-medium">{item.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {selectedMenuId ? (
                    filteredMembers.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="mx-auto mb-2 text-gray-400" />
                        <p>No team members in this menu yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Add team members using the form above.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredMembers.map((member, index) => (
                          <div
                            key={member.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {member.image ? (
                                    <img
                                      src={member.image}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        ;(e.target as HTMLImageElement).style.display = "none"
                                        const parent = e.target.parentElement
                                        if (parent) {
                                          parent.innerHTML =
                                            '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500"><User size={20} /></div>'
                                        }
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                      <User size={20} />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
                                  <p className="text-sm text-gray-600 truncate">{member.designation}</p>
                                  <p className="text-xs text-gray-500 truncate">{member.location}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => setEditingMember(member)}
                                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(member.id, member.imagePath)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <span>Order: {member.order}</span>
                                <MapPin size={12} />
                                <span>{member.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleReorder(index, "up")}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                  disabled={index === 0}
                                  title="Move up"
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button
                                  onClick={() => handleReorder(index, "down")}
                                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                                  disabled={index === filteredMembers.length - 1}
                                  title="Move down"
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="mx-auto mb-2 text-gray-400" />
                      <p>Select a menu from the hierarchy to view team members.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BANNER MANAGEMENT TAB - Same as before */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            {/* Add New Banner Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Banner</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={newBanner.title}
                    onChange={(e) => setNewBanner({...newBanner, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Banner title"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={newBanner.description}
                    onChange={(e) => setNewBanner({...newBanner, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Brief description"
                    disabled={uploading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image *
                  </label>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                      }`}>
                        <Upload size={18} />
                        {uploading ? "Uploading..." : "Select Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, false, true)}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      {bannerImageFile && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            Selected: {bannerImageFile.name}
                          </span>
                          <button
                            onClick={() => {
                              setBannerImageFile(null)
                              if (bannerPreviewUrl) {
                                URL.revokeObjectURL(bannerPreviewUrl)
                                setBannerPreviewUrl(null)
                              }
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                            disabled={uploading}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Banner Image Preview */}
                    {(bannerPreviewUrl) && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                        <div className="flex flex-col md:flex-row items-start gap-4">
                          <div className="relative w-full md:w-96 h-48 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={bannerPreviewUrl || "/placeholder.svg"}
                              alt="Banner Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={handleAddBanner}
                  disabled={uploading || !bannerImageFile}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                    uploading || !bannerImageFile 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Banner
                    </>
                  )}
                </button>
                <button
                  onClick={clearBannerForm}
                  disabled={uploading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Clear Form
                </button>
              </div>
            </div>

            {/* Existing Banners */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Existing Banners</h2>
                <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                  {banners.length} banners
                </span>
              </div>
              
              {banners.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Home className="mx-auto mb-2 text-gray-400" size={32} />
                  <p>No banners yet. Add your first banner above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((banner, index) => (
                    <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title || "Banner"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {banner.title || "Untitled Banner"}
                              </h4>
                              {banner.description && (
                                <p className="text-sm text-gray-600 mt-1">{banner.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleActive(banner)}
                                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                  banner.active 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {banner.active ? (
                                  <>
                                    <Eye size={12} />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <EyeOff size={12} />
                                    Inactive
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Order: {banner.order + 1}</p>
                            <p>Status: {banner.active ? "Visible on home page" : "Hidden"}</p>
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <button
                              onClick={() => handleBannerReorder(index, "up")}
                              disabled={index === 0}
                              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg disabled:opacity-30"
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              onClick={() => handleBannerReorder(index, "down")}
                              disabled={index === banners.length - 1}
                              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg disabled:opacity-30"
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg ml-auto"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Modal (Team Member) */}
        {editingMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Team Member</h2>
                  <button onClick={clearEditingForm} className="p-2 hover:bg-gray-100 rounded-lg" disabled={uploading}>
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                    <input
                      type="text"
                      value={editingMember.designation}
                      onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      value={editingMember.location}
                      onChange={(e) => setEditingMember({ ...editingMember, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      disabled={uploading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu *</label>
                    <select
                      value={editingMember.menuId}
                      onChange={(e) => setEditingMember({ ...editingMember, menuId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      disabled={uploading}
                    >
                      <option value="">Select Menu</option>
                      {menuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {"—".repeat(item.level)} {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <label
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}
                        >
                          <Upload size={18} />
                          {uploading ? "Uploading..." : "Upload New Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, true)}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        {editingImageFile && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              New: {editingImageFile.name}
                            </span>
                            <button
                              onClick={() => {
                                setEditingImageFile(null)
                                if (editingPreviewUrl) {
                                  URL.revokeObjectURL(editingPreviewUrl)
                                  setEditingPreviewUrl(null)
                                }
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                              disabled={uploading}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      {editingMember.image && !editingPreviewUrl && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                          <div className="flex flex-wrap items-start gap-4">
                            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={editingMember.image}
                                alt="Current"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).style.display = "none"
                                  const parent = e.target.parentElement
                                  if (parent) {
                                    parent.innerHTML =
                                      '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Image</div>'
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {editingPreviewUrl && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
                          <div className="flex flex-wrap items-start gap-4">
                            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={editingPreviewUrl || "/placeholder.svg"}
                                alt="New Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingMember.order || 0}
                      onChange={(e) =>
                        setEditingMember({ ...editingMember, order: Number.parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      min="0"
                      disabled={uploading}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={clearEditingForm}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateMember}
                    disabled={uploading || !editingMember.menuId}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      uploading || !editingMember.menuId
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Menu Modal */}
        {showMenuForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Add Menu Item</h2>
                  <button onClick={clearMenuForm} className="p-2 hover:bg-gray-100 rounded-lg" disabled={uploading}>
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Menu Title *
                    </label>
                    <input
                      type="text"
                      value={newMenuItem.title}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter menu title"
                      disabled={uploading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu Type</label>
                    <select
                      value={newMenuItem.type}
                      onChange={(e) => setNewMenuItem({ 
                        ...newMenuItem, 
                        type: e.target.value as "main" | "submenu",
                        parentId: e.target.value === "main" ? null : newMenuItem.parentId
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      disabled={uploading}
                    >
                      <option value="main">Main Menu (Top Level)</option>
                      <option value="submenu">Submenu</option>
                    </select>
                  </div>
                  
                  {newMenuItem.type === "submenu" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Parent Menu *</label>
                      <select
                        value={newMenuItem.parentId || ""}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, parentId: e.target.value || null })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        disabled={uploading}
                      >
                        <option value="">Select Parent Menu</option>
                        {menuItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {"—".repeat(item.level)} {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={clearMenuForm}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMenuItem}
                    disabled={uploading || !newMenuItem.title.trim() || (newMenuItem.type === "submenu" && !newMenuItem.parentId)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      uploading || !newMenuItem.title.trim() || (newMenuItem.type === "submenu" && !newMenuItem.parentId)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Add Menu
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Menu Modal */}
        {editingMenuItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Menu Item</h2>
                  <button onClick={clearEditingMenuForm} className="p-2 hover:bg-gray-100 rounded-lg" disabled={uploading}>
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Menu Title *
                    </label>
                    <input
                      type="text"
                      value={editingMenuItem.title}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Enter menu title"
                      disabled={uploading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingMenuItem.order || 0}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, order: Number.parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      min="0"
                      disabled={uploading}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={clearEditingMenuForm}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateMenuItem}
                    disabled={uploading || !editingMenuItem.title.trim()}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      uploading || !editingMenuItem.title.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}