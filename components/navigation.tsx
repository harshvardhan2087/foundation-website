"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Facebook, Twitter, Instagram, Linkedin, Youtube, ChevronDown, ChevronRight } from "lucide-react"
import Image from "next/image"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface MenuItem {
  id: string
  title: string
  type: "main" | "submenu"
  parentId: string | null
  order: number
  level: number
  image?: string
  children?: MenuItem[] // For hierarchical structure
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [teamMenuOpen, setTeamMenuOpen] = useState(false)
  const [menuHierarchy, setMenuHierarchy] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadData = async () => {
      try {
        // Single query to get ALL menu items, ordered for consistency
        const menuQuery = query(collection(db, "menuItems"), orderBy("order"))
        const menuSnapshot = await getDocs(menuQuery)
        
        const allItems: MenuItem[] = []
        menuSnapshot.forEach((doc) => {
          const data = doc.data()
          allItems.push({
            id: doc.id,
            title: data.title || "",
            type: data.type || "main",
            parentId: data.parentId || null,
            order: data.order || 0,
            level: data.level || 0,
            image: data.image || "",
            children: [] // Initialize children array
          })
        })
        
        // Build the hierarchical tree from the flat list
        const hierarchy = buildMenuHierarchy(allItems)
        setMenuHierarchy(hierarchy)
        
      } catch (error) {
        console.error("Error loading navigation data:", error)
        // Check if it's the index error
        if ((error as Error).message.includes("index")) {
          console.error("⚠️ Firestore composite index required. Please create it in the Firebase Console.")
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /**
   * Builds a hierarchical tree from a flat list of menu items.
   */
  const buildMenuHierarchy = (items: MenuItem[]): MenuItem[] => {
    const itemMap: { [key: string]: MenuItem } = {}
    const tree: MenuItem[] = []
    
    // First, create a map of all items by their ID
    items.forEach(item => {
      itemMap[item.id] = { ...item, children: [] }
    })
    
    // Then, assign children to their parents
    items.forEach(item => {
      const currentItem = itemMap[item.id]
      if (item.parentId && itemMap[item.parentId]) {
        // This is a child item
        if (!itemMap[item.parentId].children) {
          itemMap[item.parentId].children = []
        }
        itemMap[item.parentId].children!.push(currentItem)
      } else if (item.type === "main") {
        // This is a main menu item (root of the tree)
        tree.push(currentItem)
      }
    })
    
    // Sort children by order at each level
    const sortChildren = (menuList: MenuItem[]) => {
      menuList.sort((a, b) => a.order - b.order)
      menuList.forEach(menu => {
        if (menu.children && menu.children.length > 0) {
          sortChildren(menu.children)
        }
      })
    }
    
    sortChildren(tree)
    return tree
  }

  // Toggle mobile menu expansion
  const toggleMobileMenu = (menuId: string) => {
    const newExpanded = new Set(expandedMobileMenus)
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId)
    } else {
      newExpanded.add(menuId)
    }
    setExpandedMobileMenus(newExpanded)
  }

  // Render desktop team menu recursively
  const renderDesktopTeamMenu = (menus: MenuItem[]) => {
    if (loading) {
      return <div className="px-4 py-3 text-sm text-gray-500">Loading team structure...</div>
    }
    if (menus.length === 0) {
      return <div className="px-4 py-3 text-sm text-gray-500">No team sections configured.</div>
    }

    return menus.map((menu) => (
      <div key={menu.id} className="mb-1 last:mb-0">
        <Link
          href={`/team/${menu.id}`}
          className="block px-4 py-2 font-semibold text-gray-900 hover:bg-gray-50 rounded hover:text-black"
          onClick={() => setTeamMenuOpen(false)}
        >
          {menu.title}
        </Link>
        
        {/* Render children if they exist */}
        {menu.children && menu.children.length > 0 && (
          <div className="ml-4 mt-1 border-l border-gray-200 pl-2 space-y-1">
            {renderDesktopTeamMenu(menu.children)}
          </div>
        )}
      </div>
    ))
  }

  // Recursive function to render mobile team menu
  const renderMobileTeamMenu = (menus: MenuItem[], level = 0): JSX.Element[] => {
    return menus.map((menu) => {
      const isExpanded = expandedMobileMenus.has(menu.id)
      const hasChildren = menu.children && menu.children.length > 0

      return (
        <div key={menu.id} className={level > 0 ? 'ml-4' : ''}>
          <div className="flex items-center justify-between py-2">
            <Link
              href={`/team/${menu.id}`}
              className={`flex-1 text-sm font-medium text-gray-700 hover:text-black ${level > 0 ? 'pl-2' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {'— '.repeat(level)}{menu.title}
            </Link>
            
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleMobileMenu(menu.id)
                }}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label={isExpanded ? `Collapse ${menu.title}` : `Expand ${menu.title}`}
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>
          
          {/* Render children if expanded */}
          {isExpanded && hasChildren && menu.children && (
            <div className="ml-4 border-l border-gray-200 pl-4">
              {renderMobileTeamMenu(menu.children, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/our-work", label: "Our Work" },
    { href: "/contact", label: "Contact Us" },
  ]

  const socialLinks = [
    { 
      href: "https://facebook.com", 
      label: "Facebook", 
      icon: <Facebook className="w-4 h-4" />,
      ariaLabel: "Visit our Facebook page"
    },
    { 
      href: "https://twitter.com", 
      label: "Twitter", 
      icon: <Twitter className="w-4 h-4" />,
      ariaLabel: "Visit our Twitter page"
    },
    { 
      href: "https://instagram.com", 
      label: "Instagram", 
      icon: <Instagram className="w-4 h-4" />,
      ariaLabel: "Visit our Instagram page"
    },
    { 
      href: "https://linkedin.com", 
      label: "LinkedIn", 
      icon: <Linkedin className="w-4 h-4" />,
      ariaLabel: "Visit our LinkedIn page"
    },
    { 
      href: "https://youtube.com", 
      label: "YouTube", 
      icon: <Youtube className="w-4 h-4" />,
      ariaLabel: "Visit our YouTube channel"
    },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <Image src="/images/asf-logo.png" alt="ASF Logo" height={50} width={50} />
            </div>
            <span className="hidden sm:inline text-gray-900">Aapka Sahyog Foundation</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8 items-center">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200">
                {link.label}
              </Link>
            ))}
            
            {/* Team Dropdown */}
            <div className="relative">
              <button
                onClick={() => setTeamMenuOpen(!teamMenuOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
                aria-expanded={teamMenuOpen}
              >
                Team
                <ChevronDown className={`w-4 h-4 transition-transform ${teamMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {teamMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-y-auto max-h-[80vh] z-50 p-3">
                  {renderDesktopTeamMenu(menuHierarchy)}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Social Media and Donate Button */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <Link
              href="/get-involved"
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-200">
            <div className="space-y-2 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Team Menu */}
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-900 mb-2">Team</div>
                <div className="space-y-1">
                  {loading ? (
                    <div className="px-2 py-2 text-sm text-gray-500">Loading...</div>
                  ) : menuHierarchy.length > 0 ? (
                    renderMobileTeamMenu(menuHierarchy)
                  ) : (
                    <div className="px-2 py-2 text-sm text-gray-500">No team sections found.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Social Media Links */}
            <div className="px-4 py-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-500 mb-3">Follow Us</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Donate Button */}
            <div className="px-4 pt-2">
              <Link
                href="/get-involved"
                className="block w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold text-center hover:bg-gray-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}