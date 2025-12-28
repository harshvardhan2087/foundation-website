"use client"

import { useState, useEffect } from "react"
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  onSnapshot
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import {
  Edit,
  Save,
  Trash2,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  FileText,
  Globe,
  Users,
  Heart,
  TreePine,
  BriefcaseMedical,
  Download,
  AlertCircle,
  CheckCircle,
  MoveUp,
  MoveDown,
  Layers,
  Home,
  Shield,
  Calendar,
  Clock,
  BarChart,
  RefreshCw,
  File,
  Image
} from "lucide-react"

interface AboutSection {
  id: string
  title: string
  content: string
  icon?: string
  order: number
  type: "text" | "gallery" | "values" | "governance" | "mission"
}

interface GalleryImage {
  id: string
  src: string
  alt: string
  category: string
  order: number
  imagePath?: string
}

interface AboutPageData {
  id: string
  bannerImage: string
  bannerImagePath?: string
  title: string
  subtitle: string
  missionStatement: string
  missionDescription: string
  commitments: string[]
  pdfUrl: string
  pdfPath?: string
  registrationDetails: {
    number: string
    upi: string
    helpdesk: string
  }
  mission: string
  vision: string
  coreValues: string[]
  sections: AboutSection[]
  galleryImages: GalleryImage[]
  hindiSections: Array<{
    title: string
    points: string[]
    icon: string
  }>
  governance: Array<{
    title: string
    description: string
  }>
  lastUpdated?: string
  createdAt?: string
}

export default function AboutPageEditor() {
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<"banner" | "content" | "gallery" | "mission" | "pdf" | "details">("banner")
  
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null)
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null)
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null)
  const [galleryPreviewUrl, setGalleryPreviewUrl] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  
  const [newGalleryImage, setNewGalleryImage] = useState({
    alt: "",
    category: ""
  })
  
  const [newHindiSection, setNewHindiSection] = useState({
    title: "",
    points: [""],
    icon: "Shield"
  })
  
  const [newCoreValue, setNewCoreValue] = useState("")
  const [newCommitment, setNewCommitment] = useState("")
  const [newGovernance, setNewGovernance] = useState({
    title: "",
    description: ""
  })

  // Load about page data
  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const docRef = doc(db, "aboutPage", "main")
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setAboutData(docSnap.data() as AboutPageData)
        } else {
          // Initialize with default data
          const defaultData: AboutPageData = {
            id: "main",
            bannerImage: "/images/banner.png",
            title: "आपका सहयोग फाउंडेशन",
            subtitle: "एक सामाजिक सेवा संगठन जो समाज में सकारात्मक परिवर्तन लाने के उद्देश्य से लगातार धरातल पर कार्य कर रहा है।",
            missionStatement: "समाज के हर व्यक्ति को सहायता, सुरक्षा और सम्मान उपलब्ध कराना।",
            missionDescription: "आपका सहयोग फाउंडेशन एक ऐसी पहल है, जो समाज के कमजोर वर्गों के लिए मजबूत सहारा बनने का कार्य कर रही है।",
            commitments: ["पारदर्शिता", "जिम्मेदारी", "मानवीय संवेदना", "त्वरित सहायता"],
            pdfUrl: "/documents/laws.pdf",
            registrationDetails: {
              number: "Regd. No. 49/2025/Jewar",
              upi: "UPI: 9999767640m@pnb",
              helpdesk: "18001800 / 18002021"
            },
            mission: "To create a sustainable, equitable society by empowering individuals and communities through education, skill development, environmental protection, and social welfare initiatives that promote dignity and self-reliance.",
            vision: "A world where every individual has access to quality education, healthcare, and livelihood opportunities, living in harmony with nature and contributing meaningfully to society regardless of their socio-economic background.",
            coreValues: ["Community Empowerment", "Environmental Sustainability", "Social Equality", "Transparent Operations", "Impact-Driven Approach", "Inclusive Development"],
            sections: [],
            galleryImages: [],
            hindiSections: [
              {
                title: "महिलाओं, बच्चों और बुजुर्गों की सुरक्षा",
                points: [
                  "घरेलू हिंसा, अत्याचार या किसी भी प्रकार की प्रताड़ना की स्थिति में तुरंत सहायता प्रदान करना",
                  "कानूनी परामर्श, मनोवैज्ञानिक सहयोग और पुनर्वास में मदद",
                  "महिलाओं के अधिकारों और सुरक्षा के लिए जागरूकता अभियान"
                ],
                icon: "Shield"
              },
              {
                title: "कॉलोनी एवं समाज की समस्याओं का समाधान",
                points: [
                  "सफाई व्यवस्था में सुधार के लिए स्थानीय प्रशासन के साथ समन्वय",
                  "जल, पर्यावरण और सार्वजनिक सुविधाओं से जुड़ी शिकायतों का समाधान",
                  "स्वस्थ और स्वच्छ समाज बनाने के लिए जन-जागरूकता अभियान"
                ],
                icon: "Users"
              }
            ],
            governance: [
              {
                title: "Leadership",
                description: "Experienced team dedicated to social impact and community welfare with diverse expertise"
              },
              {
                title: "Transparency",
                description: "All operations are conducted with full transparency, accountability, and adherence to regulatory standards"
              }
            ],
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }
          
          await setDoc(docRef, defaultData)
          setAboutData(defaultData)
        }
      } catch (err: any) {
        console.error("Error loading about page data:", err)
        setError(`Failed to load about page data: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    const setupRealtimeListener = () => {
      try {
        const docRef = doc(db, "aboutPage", "main")
        
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setAboutData(docSnap.data() as AboutPageData)
          }
        }, (error) => {
          console.error("Error in about page listener:", error)
        })

        return unsubscribe
      } catch (err: any) {
        console.error("Error setting up about page listener:", err)
        return () => {}
      }
    }

    loadAboutData()
    const unsubscribe = setupRealtimeListener()

    return () => {
      unsubscribe()
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl)
      if (galleryPreviewUrl) URL.revokeObjectURL(galleryPreviewUrl)
    }
  }, [])

  // Upload image to Firebase Storage
  const uploadImageToFirebaseStorage = async (
    file: File, 
    existingImagePath?: string, 
    folder: string = "about-page"
  ): Promise<{url: string, path: string}> => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
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
      
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (existingImagePath && existingImagePath !== storagePath) {
        try {
          const oldImageRef = ref(storage, existingImagePath)
          await deleteObject(oldImageRef)
        } catch (deleteError) {
          console.warn("Could not delete old image:", deleteError)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      return { url: downloadURL, path: storagePath }
    } catch (error: any) {
      console.error("Error uploading image:", error)
      throw new Error(`Failed to upload image: ${error.message || "Unknown error"}`)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Upload PDF to Firebase Storage
  const uploadPdfToFirebaseStorage = async (
    file: File, 
    existingPdfPath?: string
  ): Promise<{url: string, path: string}> => {
    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      if (file.type !== "application/pdf") {
        throw new Error("Please select a PDF file")
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("PDF size should be less than 10MB")
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
      const storagePath = `documents/${fileName}`
      
      const storageRef = ref(storage, storagePath)
      const snapshot = await uploadBytes(storageRef, file)
      
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (existingPdfPath && existingPdfPath !== storagePath) {
        try {
          const oldPdfRef = ref(storage, existingPdfPath)
          await deleteObject(oldPdfRef)
        } catch (deleteError) {
          console.warn("Could not delete old PDF:", deleteError)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      return { url: downloadURL, path: storagePath }
    } catch (error: any) {
      console.error("Error uploading PDF:", error)
      throw new Error(`Failed to upload PDF: ${error.message || "Unknown error"}`)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Update about page data
  const updateAboutData = async (updates: Partial<AboutPageData>) => {
    if (!aboutData) return

    try {
      setSaving(true)
      setError(null)

      const docRef = doc(db, "aboutPage", "main")
      const updatedData = {
        ...aboutData,
        ...updates,
        lastUpdated: new Date().toISOString()
      }

      await setDoc(docRef, updatedData)
      setAboutData(updatedData)

      setSuccess("✅ Changes saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      console.error("Error updating about page:", err)
      setError(`Failed to save changes: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  // Handle banner image upload
  const handleBannerImageUpload = async () => {
    if (!bannerImageFile || !aboutData) return

    try {
      setUploading(true)
      setError(null)

      const imageData = await uploadImageToFirebaseStorage(bannerImageFile, aboutData.bannerImagePath, "about-page/banner")

      await updateAboutData({
        bannerImage: imageData.url,
        bannerImagePath: imageData.path
      })

      setBannerImageFile(null)
      if (bannerPreviewUrl) {
        URL.revokeObjectURL(bannerPreviewUrl)
        setBannerPreviewUrl(null)
      }

      setSuccess("✅ Banner image updated successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to upload banner image: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle PDF upload
  const handlePdfUpload = async () => {
    if (!pdfFile || !aboutData) return

    try {
      setUploading(true)
      setError(null)

      const pdfData = await uploadPdfToFirebaseStorage(pdfFile, aboutData.pdfPath)

      await updateAboutData({
        pdfUrl: pdfData.url,
        pdfPath: pdfData.path
      })

      setPdfFile(null)

      setSuccess("✅ PDF document updated successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to upload PDF: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle gallery image addition
  const handleAddGalleryImage = async () => {
    if (!galleryImageFile || !aboutData || !newGalleryImage.alt.trim()) return

    try {
      setUploading(true)
      setError(null)

      const imageData = await uploadImageToFirebaseStorage(galleryImageFile, undefined, "about-page/gallery")

      const newImage: GalleryImage = {
        id: Date.now().toString(),
        src: imageData.url,
        alt: newGalleryImage.alt.trim(),
        category: newGalleryImage.category.trim() || "General",
        order: aboutData.galleryImages.length,
        imagePath: imageData.path
      }

      const updatedGallery = [...aboutData.galleryImages, newImage]

      await updateAboutData({
        galleryImages: updatedGallery
      })

      setGalleryImageFile(null)
      setNewGalleryImage({ alt: "", category: "" })
      if (galleryPreviewUrl) {
        URL.revokeObjectURL(galleryPreviewUrl)
        setGalleryPreviewUrl(null)
      }

      setSuccess("✅ Gallery image added successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to add gallery image: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle gallery image deletion
  const handleDeleteGalleryImage = async (image: GalleryImage) => {
    if (!aboutData) return

    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      if (image.imagePath) {
        try {
          const imageRef = ref(storage, image.imagePath)
          await deleteObject(imageRef)
        } catch (err) {
          console.warn("Could not delete image from storage:", err)
        }
      }

      const updatedGallery = aboutData.galleryImages.filter(img => img.id !== image.id)
      
      await updateAboutData({
        galleryImages: updatedGallery
      })

      setSuccess("✅ Gallery image deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to delete gallery image: ${err.message}`)
    }
  }

  // Handle gallery reorder
  const handleGalleryReorder = async (index: number, direction: "up" | "down") => {
    if (!aboutData) return

    const newGallery = [...aboutData.galleryImages]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newGallery.length) return

    const tempOrder = newGallery[index].order
    newGallery[index].order = newGallery[targetIndex].order
    newGallery[targetIndex].order = tempOrder

    const tempImage = newGallery[index]
    newGallery[index] = newGallery[targetIndex]
    newGallery[targetIndex] = tempImage

    newGallery.sort((a, b) => a.order - b.order)

    try {
      await updateAboutData({
        galleryImages: newGallery
      })
    } catch (err: any) {
      setError(`Failed to reorder: ${err.message}`)
    }
  }

  // Add Hindi section
  const handleAddHindiSection = async () => {
    if (!aboutData || !newHindiSection.title.trim()) return

    try {
      const updatedHindiSections = [
        ...aboutData.hindiSections,
        {
          title: newHindiSection.title.trim(),
          points: newHindiSection.points.filter(p => p.trim()),
          icon: newHindiSection.icon
        }
      ]

      await updateAboutData({
        hindiSections: updatedHindiSections
      })

      setNewHindiSection({
        title: "",
        points: [""],
        icon: "Shield"
      })

      setSuccess("✅ Hindi section added successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to add section: ${err.message}`)
    }
  }

  // Delete Hindi section
  const handleDeleteHindiSection = async (index: number) => {
    if (!aboutData) return

    if (!confirm("Are you sure you want to delete this section?")) return

    try {
      const updatedHindiSections = aboutData.hindiSections.filter((_, i) => i !== index)

      await updateAboutData({
        hindiSections: updatedHindiSections
      })

      setSuccess("✅ Section deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to delete section: ${err.message}`)
    }
  }

  // Add core value
  const handleAddCoreValue = async () => {
    if (!aboutData || !newCoreValue.trim()) return

    try {
      const updatedCoreValues = [...aboutData.coreValues, newCoreValue.trim()]

      await updateAboutData({
        coreValues: updatedCoreValues
      })

      setNewCoreValue("")

      setSuccess("✅ Core value added successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to add core value: ${err.message}`)
    }
  }

  // Delete core value
  const handleDeleteCoreValue = async (index: number) => {
    if (!aboutData) return

    if (!confirm("Are you sure you want to delete this core value?")) return

    try {
      const updatedCoreValues = aboutData.coreValues.filter((_, i) => i !== index)

      await updateAboutData({
        coreValues: updatedCoreValues
      })

      setSuccess("✅ Core value deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to delete core value: ${err.message}`)
    }
  }

  // Add commitment
  const handleAddCommitment = async () => {
    if (!aboutData || !newCommitment.trim()) return

    try {
      const updatedCommitments = [...aboutData.commitments, newCommitment.trim()]

      await updateAboutData({
        commitments: updatedCommitments
      })

      setNewCommitment("")

      setSuccess("✅ Commitment added successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to add commitment: ${err.message}`)
    }
  }

  // Delete commitment
  const handleDeleteCommitment = async (index: number) => {
    if (!aboutData) return

    if (!confirm("Are you sure you want to delete this commitment?")) return

    try {
      const updatedCommitments = aboutData.commitments.filter((_, i) => i !== index)

      await updateAboutData({
        commitments: updatedCommitments
      })

      setSuccess("✅ Commitment deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to delete commitment: ${err.message}`)
    }
  }

  // Add governance item
  const handleAddGovernance = async () => {
    if (!aboutData || !newGovernance.title.trim() || !newGovernance.description.trim()) return

    try {
      const updatedGovernance = [
        ...aboutData.governance,
        {
          title: newGovernance.title.trim(),
          description: newGovernance.description.trim()
        }
      ]

      await updateAboutData({
        governance: updatedGovernance
      })

      setNewGovernance({ title: "", description: "" })

      setSuccess("✅ Governance item added successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to add governance item: ${err.message}`)
    }
  }

  // Delete governance item
  const handleDeleteGovernance = async (index: number) => {
    if (!aboutData) return

    if (!confirm("Are you sure you want to delete this governance item?")) return

    try {
      const updatedGovernance = aboutData.governance.filter((_, i) => i !== index)

      await updateAboutData({
        governance: updatedGovernance
      })

      setSuccess("✅ Governance item deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to delete governance item: ${err.message}`)
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "gallery" | "pdf") => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    if (type === "pdf") {
      if (file.type !== "application/pdf") {
        setError("Please select a PDF file")
        return
      }
      setPdfFile(file)
    } else {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file")
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      const objectUrl = URL.createObjectURL(file)
      
      if (type === "banner") {
        setBannerImageFile(file)
        setBannerPreviewUrl(objectUrl)
      } else if (type === "gallery") {
        setGalleryImageFile(file)
        setGalleryPreviewUrl(objectUrl)
      }
    }
  }

  // Icon options for Hindi sections
  const iconOptions = [
    { value: "Shield", label: "Shield (Protection)" },
    { value: "Users", label: "Users (Community)" },
    { value: "Heart", label: "Heart (Support)" },
    { value: "TreePine", label: "Tree (Environment)" },
    { value: "BriefcaseMedical", label: "Medical (Health)" },
    { value: "Home", label: "Home (Housing)" },
    { value: "FileText", label: "Document (Legal)" }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  if (!aboutData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load about page data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <p className="text-red-700 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="ml-2 p-1 text-red-500 hover:text-red-700">
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
          <p className="text-green-700 flex-1">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-2 p-1 text-green-500 hover:text-green-700">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "banner", label: "Banner", icon: Image },
            { id: "content", label: "Content", icon: FileText },
            { id: "gallery", label: "Gallery", icon: Layers },
            { id: "mission", label: "Mission & Values", icon: Globe },
            { id: "pdf", label: "PDF Document", icon: File },
            { id: "details", label: "Registration Details", icon: Users }
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <section.icon size={16} />
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-sm text-gray-500">
        Last updated: {aboutData.lastUpdated ? new Date(aboutData.lastUpdated).toLocaleString() : "Never"}
      </div>

      {/* BANNER SECTION */}
      {activeSection === "banner" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Banner Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Banner Preview */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Current Banner</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={aboutData.bannerImage || "/placeholder.svg"}
                    alt="Current Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Upload New Banner */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Upload New Banner</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                    }`}>
                      <Upload size={18} />
                      {uploading ? "Uploading..." : "Select Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "banner")}
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
                </div>

                {bannerPreviewUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="relative h-32 w-full">
                        <img
                          src={bannerPreviewUrl}
                          alt="New Banner Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBannerImageUpload}
                  disabled={uploading || !bannerImageFile}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                    uploading || !bannerImageFile
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {uploading ? "Uploading..." : "Update Banner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT SECTION */}
      {activeSection === "content" && (
        <div className="space-y-6">
          {/* Hindi Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hindi Content</h2>
            
            <div className="space-y-6">
              {/* Main Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Title (Hindi)
                </label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => updateAboutData({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter main title in Hindi"
                  disabled={saving}
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle (Hindi)
                </label>
                <textarea
                  value={aboutData.subtitle}
                  onChange={(e) => updateAboutData({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="Enter subtitle in Hindi"
                  disabled={saving}
                />
              </div>

              {/* Mission Statement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Statement (Hindi)
                </label>
                <textarea
                  value={aboutData.missionStatement}
                  onChange={(e) => updateAboutData({ missionStatement: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={2}
                  placeholder="Enter mission statement in Hindi"
                  disabled={saving}
                />
              </div>

              {/* Mission Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Description (Hindi)
                </label>
                <textarea
                  value={aboutData.missionDescription}
                  onChange={(e) => updateAboutData({ missionDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="Enter mission description in Hindi"
                  disabled={saving}
                />
              </div>

              {/* Hindi Sections */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Hindi Work Sections</h3>
                  <button
                    onClick={() => document.getElementById('addHindiSection')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Add New Section
                  </button>
                </div>

                <div className="space-y-4">
                  {aboutData.hindiSections.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{iconOptions.find(ico => ico.value === section.icon)?.label}</span>
                          <h4 className="font-semibold">{section.title}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteHindiSection(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {section.points.map((point, pointIndex) => (
                          <div key={pointIndex} className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span className="text-sm text-gray-600 flex-1">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Hindi Section Form */}
                <div id="addHindiSection" className="mt-8 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-4">Add New Hindi Section</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={newHindiSection.title}
                        onChange={(e) => setNewHindiSection({ ...newHindiSection, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter section title in Hindi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <select
                        value={newHindiSection.icon}
                        onChange={(e) => setNewHindiSection({ ...newHindiSection, icon: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      >
                        {iconOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points (One per line)
                      </label>
                      <textarea
                        value={newHindiSection.points.join('\n')}
                        onChange={(e) => setNewHindiSection({ 
                          ...newHindiSection, 
                          points: e.target.value.split('\n').filter(p => p.trim()) 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        rows={4}
                        placeholder="Enter each point on a new line"
                      />
                    </div>

                    <button
                      onClick={handleAddHindiSection}
                      disabled={!newHindiSection.title.trim()}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                        !newHindiSection.title.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      Add Section
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* English Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">English Content</h2>
            
            <div className="space-y-6">
              {/* Mission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission (English)
                </label>
                <textarea
                  value={aboutData.mission}
                  onChange={(e) => updateAboutData({ mission: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={4}
                  placeholder="Enter mission in English"
                  disabled={saving}
                />
              </div>

              {/* Vision */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision (English)
                </label>
                <textarea
                  value={aboutData.vision}
                  onChange={(e) => updateAboutData({ vision: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={4}
                  placeholder="Enter vision in English"
                  disabled={saving}
                />
              </div>

              {/* Governance */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">Governance & Structure</h3>
                  <button
                    onClick={() => document.getElementById('addGovernance')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Add New Item
                  </button>
                </div>

                <div className="space-y-4">
                  {aboutData.governance.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{item.title}</h4>
                        <button
                          onClick={() => handleDeleteGovernance(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>

                {/* Add Governance Form */}
                <div id="addGovernance" className="mt-8 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-4">Add Governance Item</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newGovernance.title}
                        onChange={(e) => setNewGovernance({ ...newGovernance, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newGovernance.description}
                        onChange={(e) => setNewGovernance({ ...newGovernance, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        rows={3}
                        placeholder="Enter description"
                      />
                    </div>

                    <button
                      onClick={handleAddGovernance}
                      disabled={!newGovernance.title.trim() || !newGovernance.description.trim()}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                        !newGovernance.title.trim() || !newGovernance.description.trim()
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-black text-white hover:bg-gray-800"
                      }`}
                    >
                      Add Governance Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY SECTION */}
      {activeSection === "gallery" && (
        <div className="space-y-6">
          {/* Add New Gallery Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Gallery Image</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                    }`}>
                      <Upload size={18} />
                      {uploading ? "Uploading..." : "Select Image"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "gallery")}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {galleryImageFile && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Selected: {galleryImageFile.name}
                        </span>
                        <button
                          onClick={() => {
                            setGalleryImageFile(null)
                            if (galleryPreviewUrl) {
                              URL.revokeObjectURL(galleryPreviewUrl)
                              setGalleryPreviewUrl(null)
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text *
                  </label>
                  <input
                    type="text"
                    value={newGalleryImage.alt}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, alt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter descriptive text for image"
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newGalleryImage.category}
                    onChange={(e) => setNewGalleryImage({ ...newGalleryImage, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Donation, Community, Medical"
                    disabled={uploading}
                  />
                </div>

                <button
                  onClick={handleAddGalleryImage}
                  disabled={uploading || !galleryImageFile || !newGalleryImage.alt.trim()}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                    uploading || !galleryImageFile || !newGalleryImage.alt.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {uploading ? "Uploading..." : "Add to Gallery"}
                </button>
              </div>

              {/* Preview */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Preview</h3>
                {galleryPreviewUrl ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative h-48 w-full">
                      <img
                        src={galleryPreviewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-medium">{newGalleryImage.alt || "No alt text"}</p>
                      <p className="text-sm text-gray-600">Category: {newGalleryImage.category || "General"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-gray-500">Image preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery Images List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Gallery Images</h2>
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                {aboutData.galleryImages.length} images
              </span>
            </div>
            
            {aboutData.galleryImages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="mx-auto mb-2 text-gray-400" size={32} />
                <p>No gallery images yet. Add your first image above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aboutData.galleryImages.map((image, index) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative h-40 w-full bg-gray-100">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{image.alt}</p>
                          <p className="text-xs text-gray-600">Category: {image.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleGalleryReorder(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30"
                            title="Move up"
                          >
                            <MoveUp size={14} />
                          </button>
                          <button
                            onClick={() => handleGalleryReorder(index, "down")}
                            disabled={index === aboutData.galleryImages.length - 1}
                            className="p-1 text-gray-600 hover:text-black hover:bg-gray-100 rounded disabled:opacity-30"
                            title="Move down"
                          >
                            <MoveDown size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryImage(image)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Order: {image.order + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MISSION & VALUES SECTION */}
      {activeSection === "mission" && (
        <div className="space-y-6">
          {/* Commitments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Commitments (Hindi)</h2>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {aboutData.commitments.map((commitment, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
                    <span className="text-sm font-medium">{commitment}</span>
                    <button
                      onClick={() => handleDeleteCommitment(index)}
                      className="p-1 text-red-500 hover:text-red-700 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCommitment}
                  onChange={(e) => setNewCommitment(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Add new commitment"
                />
                <button
                  onClick={handleAddCommitment}
                  disabled={!newCommitment.trim()}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Core Values (English)</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                {aboutData.coreValues.map((value, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="font-medium">{value}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCoreValue(index)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCoreValue}
                  onChange={(e) => setNewCoreValue(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Add new core value"
                />
                <button
                  onClick={handleAddCoreValue}
                  disabled={!newCoreValue.trim()}
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF DOCUMENT SECTION */}
      {activeSection === "pdf" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">PDF Document</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current PDF */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Current PDF</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <File className="text-red-500" size={24} />
                  <div>
                    <p className="font-medium">Foundation ByLaws</p>
                    <p className="text-sm text-gray-600">
                      {aboutData.pdfUrl ? "PDF is uploaded" : "No PDF uploaded"}
                    </p>
                  </div>
                </div>
                {aboutData.pdfUrl && (
                  <a
                    href={aboutData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-blue-600 hover:text-blue-800"
                  >
                    <Download size={16} />
                    View/Download PDF
                  </a>
                )}
              </div>
            </div>

            {/* Upload New PDF */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Upload New PDF</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF File *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"
                    }`}>
                      <Upload size={18} />
                      {uploading ? "Uploading..." : "Select PDF"}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, "pdf")}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    {pdfFile && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Selected: {pdfFile.name}
                        </span>
                        <button
                          onClick={() => setPdfFile(null)}
                          className="p-1 text-red-500 hover:text-red-700"
                          disabled={uploading}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
                </div>

                <button
                  onClick={handlePdfUpload}
                  disabled={uploading || !pdfFile}
                  className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                    uploading || !pdfFile
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION DETAILS SECTION */}
      {activeSection === "details" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Registration Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={aboutData.registrationDetails.number}
                onChange={(e) => updateAboutData({
                  registrationDetails: {
                    ...aboutData.registrationDetails,
                    number: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter registration number"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI Payment Address
              </label>
              <input
                type="text"
                value={aboutData.registrationDetails.upi}
                onChange={(e) => updateAboutData({
                  registrationDetails: {
                    ...aboutData.registrationDetails,
                    upi: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter UPI payment address"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Helpdesk Number
              </label>
              <input
                type="text"
                value={aboutData.registrationDetails.helpdesk}
                onChange={(e) => updateAboutData({
                  registrationDetails: {
                    ...aboutData.registrationDetails,
                    helpdesk: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter helpdesk number"
                disabled={saving}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => updateAboutData({})} // Trigger save
                disabled={saving}
                className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}