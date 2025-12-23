import { collection, query, where, getDocs, getDoc, doc, orderBy } from "firebase/firestore"
import { db } from "./firebase"

export interface MenuItem {
  id: string
  title: string
  type: "main" | "submenu"
  parentId: string | null
  order: number
  level: number
  image?: string
  description?: string
  content?: string
}

export interface TeamMember {
  id: string
  name: string
  designation: string
  location: string
  image: string
  menuId: string
  order: number
  bio?: string
  email?: string
  phone?: string
  imagePath?: string
  position?: string // For backward compatibility
  createdAt?: string
  updatedAt?: string
}

// Helper function to safely get document data
const getDocData = (doc: any) => {
  const data = doc.data()
  return {
    id: doc.id,
    ...data
  }
}

export async function getMenuById(id: string): Promise<MenuItem | null> {
  try {
    if (!id) return null
    
    const menuRef = doc(db, "menuItems", id)
    const menuSnap = await getDoc(menuRef)
    
    if (menuSnap.exists()) {
      return getDocData(menuSnap) as MenuItem
    }
    return null
  } catch (error) {
    console.error("Error getting menu:", error)
    return null
  }
}

// Temporary workaround: Fetch all team members and filter/sort in memory
export async function getTeamMembersByMenuId(menuId: string): Promise<TeamMember[]> {
  try {
    if (!menuId) {
      console.log('No menuId provided for getTeamMembersByMenuId')
      return []
    }
    
    console.log('Fetching team members for menuId:', menuId)
    
    // TEMPORARY WORKAROUND: Get all team members and filter in memory
    // This avoids the composite index requirement
    const teamQuery = query(collection(db, "teamMembers"))
    const teamSnapshot = await getDocs(teamQuery)
    
    const members: TeamMember[] = []
    teamSnapshot.forEach((doc) => {
      const data = doc.data()
      
      // Only add members that belong to the requested menuId
      if (data.menuId === menuId) {
        members.push({
          id: doc.id,
          name: data.name || "",
          designation: data.designation || "",
          position: data.designation || data.position || "",
          location: data.location || "",
          image: data.image || "",
          menuId: data.menuId || "",
          order: data.order || 0,
          bio: data.bio || "",
          email: data.email || "",
          phone: data.phone || "",
          imagePath: data.imagePath || "",
          createdAt: data.createdAt || "",
          updatedAt: data.updatedAt || "",
        } as TeamMember)
      }
    })
    
    // Sort by order in memory
    members.sort((a, b) => (a.order || 0) - (b.order || 0))
    
    console.log(`Found ${members.length} team members for menu ${menuId}`)
    
    // Debug: Log image URLs for first 2 members
    if (members.length > 0) {
      console.log('First member image URL:', members[0].image ? 'Present' : 'Missing')
      if (members[0].image) console.log('URL:', members[0].image)
    }
    
    return members
  } catch (error: any) {
    console.error("Error getting team members:", error)
    
    // If it's an index error, provide helpful message
    if (error.code === 'failed-precondition') {
      console.error("⚠️ Firestore composite index required!")
      console.error("Please create an index for teamMembers collection with fields: menuId (Ascending), order (Ascending)")
      console.error("Go to Firebase Console → Firestore → Indexes → Create Index")
    }
    
    return []
  }
}

// Use this version AFTER index is created (more efficient)
export async function getTeamMembersByMenuIdWithIndex(menuId: string): Promise<TeamMember[]> {
  try {
    if (!menuId) return []
    
    // This is the efficient version that uses the index
    const teamQuery = query(
      collection(db, "teamMembers"),
      where("menuId", "==", menuId),
      orderBy("order")
    )
    
    const teamSnapshot = await getDocs(teamQuery)
    
    const members: TeamMember[] = []
    teamSnapshot.forEach((doc) => {
      const data = doc.data()
      members.push({
        id: doc.id,
        name: data.name || "",
        designation: data.designation || "",
        position: data.designation || data.position || "",
        location: data.location || "",
        image: data.image || "",
        menuId: data.menuId || "",
        order: data.order || 0,
        bio: data.bio || "",
        email: data.email || "",
        phone: data.phone || "",
        imagePath: data.imagePath || "",
      } as TeamMember)
    })
    
    return members
  } catch (error: any) {
    console.error("Error getting team members with index:", error)
    return []
  }
}

export async function getChildMenus(parentId: string): Promise<MenuItem[]> {
  try {
    if (!parentId) return []
    
    // TEMPORARY WORKAROUND: Get all menus and filter in memory
    const menuQuery = query(collection(db, "menuItems"))
    const menuSnapshot = await getDocs(menuQuery)
    
    const items: MenuItem[] = []
    menuSnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.parentId === parentId) {
        items.push({
          id: doc.id,
          title: data.title || "",
          type: data.type || "submenu",
          parentId: data.parentId || null,
          order: data.order || 0,
          level: data.level || 0,
          image: data.image || "",
          description: data.description || "",
          content: data.content || "",
        } as MenuItem)
      }
    })
    
    // Sort by order
    items.sort((a, b) => a.order - b.order)
    
    return items
  } catch (error) {
    console.error("Error getting child menus:", error)
    return []
  }
}

export async function getAllMainMenus(): Promise<MenuItem[]> {
  try {
    // TEMPORARY WORKAROUND: Get all menus and filter in memory
    const menuQuery = query(collection(db, "menuItems"))
    const menuSnapshot = await getDocs(menuQuery)
    
    const items: MenuItem[] = []
    menuSnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.type === "main") {
        items.push({
          id: doc.id,
          title: data.title || "",
          type: data.type || "main",
          parentId: data.parentId || null,
          order: data.order || 0,
          level: data.level || 0,
          image: data.image || "",
          description: data.description || "",
          content: data.content || "",
        } as MenuItem)
      }
    })
    
    // Sort by order
    items.sort((a, b) => a.order - b.order)
    
    return items
  } catch (error) {
    console.error("Error getting main menus:", error)
    return []
  }
}

// Helper function to get all team members (for debugging)
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const teamQuery = query(collection(db, "teamMembers"))
    const teamSnapshot = await getDocs(teamQuery)
    
    const members: TeamMember[] = []
    teamSnapshot.forEach((doc) => {
      const data = doc.data()
      members.push({
        id: doc.id,
        name: data.name || "",
        designation: data.designation || "",
        position: data.designation || data.position || "",
        location: data.location || "",
        image: data.image || "",
        menuId: data.menuId || "",
        order: data.order || 0,
        bio: data.bio || "",
        email: data.email || "",
        phone: data.phone || "",
        imagePath: data.imagePath || "",
      } as TeamMember)
    })
    
    return members
  } catch (error) {
    console.error("Error getting all team members:", error)
    return []
  }
}