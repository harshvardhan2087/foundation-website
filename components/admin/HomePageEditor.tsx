"use client"

import { useState, useEffect } from "react"
import { db, storage } from "@/lib/firebase"
import { 
  doc, 
  getDoc, 
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  addDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { 
  Users,
  Target,
  Heart,
  Leaf,
  BookOpen,
  Handshake,
  TrendingUp,
  Shield,
  Star,
  CheckCircle,
  MapPin,
  Zap,
  Eye,
  GraduationCap,
  Briefcase,
  Calendar,
  Phone,
  Mail,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Camera,
  Users as UsersIcon,
  School,
  Activity,
  TreePine,
  ShieldCheck,
  ExternalLink,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  AlertCircle,
  CheckCircle as CheckCircleIcon,
  ArrowUp,
  ArrowDown,
  Eye as EyeIcon,
  BarChart,
  Target as TargetIcon,
  MoveUp,
  MoveDown,
  Hash,
  Play,
  Award,
  Image as ImageIcon,
  Upload,
  Download,
  Globe,
  ThumbsUp,
  MessageSquare
} from "lucide-react"

interface Stat {
  id: string
  number: string
  label: string
  description: string
  order: number
  active: boolean
}

interface YoutubeVideo {
  id: string
  videoId: string
  description: string
  order: number
  active: boolean
}

interface Achievement {
  id: string
  year: string
  title: string
  description: string
  icon: string
  order: number
  active: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  text: string
  location: string
  image: string
  imagePath?: string
  order: number
  active: boolean
}

interface Partner {
  id: string
  name: string
  logo: string
  logoPath?: string
  order: number
  active: boolean
}

interface WorkGalleryItem {
  id: string
  image: string
  imagePath?: string
  description?: string
  order: number
  active: boolean
}

interface SocialMedia {
  youtube: string
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
}

interface CTASection {
  title: string
  description: string
  donationText: string
  volunteerText: string
  stats: Array<{
    value: string
    label: string
  }>
}

interface HomePageData {
  aboutTitle: string
  aboutDescription: string
  mission: string
  vision: string
  aboutImages: string[]
  workGalleryTitle: string
  workGalleryDescription: string
  featuredWorkTitle: string
  featuredWorkDescription: string
  videosTitle: string
  videosDescription: string
  milestonesTitle: string
  milestonesDescription: string
  testimonialsTitle: string
  testimonialsDescription: string
  partnersTitle: string
  partnersDescription: string
  ctaSection: CTASection
  socialMedia: SocialMedia
  stats: Stat[]
  youtubeVideos: YoutubeVideo[]
  achievements: Achievement[]
  testimonials: Testimonial[]
  partners: Partner[]
  workGallery: WorkGalleryItem[]
}

export default function HomePageEditor() {
  const [homeData, setHomeData] = useState<HomePageData>({
    aboutTitle: "Building a Better Tomorrow, Together",
    aboutDescription: "Established with a vision to create sustainable social impact, Aapka Sahyog Foundation works tirelessly to uplift marginalized communities through comprehensive development programs across Uttar Pradesh.",
    mission: "To empower communities through sustainable development initiatives",
    vision: "A society where every individual has access to opportunities and dignity",
    aboutImages: [
      "/images/team-activity-1.png",
      "/images/team-award.png",
      "/images/our-work-3.png",
      "/images/our-work-4.png"
    ],
    workGalleryTitle: "Impact in Action",
    workGalleryDescription: "Witness the transformative work we're doing across communities in Uttar Pradesh",
    featuredWorkTitle: "Community Development in Rural Uttar Pradesh",
    featuredWorkDescription: "Transforming lives through integrated development programs",
    videosTitle: "Watch Our Impact Stories",
    videosDescription: "Experience the transformative work through our video documentation",
    milestonesTitle: "Milestones of Impact",
    milestonesDescription: "",
    testimonialsTitle: "Stories of Transformation",
    testimonialsDescription: "",
    partnersTitle: "Trusted by Leading Organizations",
    partnersDescription: "",
    ctaSection: {
      title: "Together, We Can Make a Difference",
      description: "Your support enables us to continue our vital work in education, healthcare, environment, and community development.",
      donationText: "Make a Donation",
      volunteerText: "Become a Volunteer",
      stats: [
        { value: "100%", label: "Transparent" },
        { value: "45+", label: "Objectives" },
        { value: "24/7", label: "Support" }
      ]
    },
    socialMedia: {
      youtube: "https://youtube.com/@aapkasahyogfoundation",
      facebook: "https://www.facebook.com/share/1SpxhPXM8r/",
      instagram: "https://www.instagram.com/aapkasahyogfoundation",
      twitter: "",
      linkedin: ""
    },
    stats: [
      { id: "1", number: "50+", label: "Communities Served", description: "Across Uttar Pradesh", order: 0, active: true },
      { id: "2", number: "5000+", label: "Lives Impacted", description: "Through our programs", order: 1, active: true },
      { id: "3", number: "20+", label: "Active Programs", description: "In multiple sectors", order: 2, active: true },
      { id: "4", number: "45+", label: "Social Objectives", description: "For comprehensive development", order: 3, active: true }
    ],
    youtubeVideos: [
      { id: "1", videoId: "l7TkcC_o36k", description: "Our journey and impact story", order: 0, active: true },
      { id: "2", videoId: "szEHs0kxGX4", description: "Youth training in action", order: 1, active: true },
      { id: "3", videoId: "xUg5cXIv6UY", description: "Medical services in rural areas", order: 2, active: true },
      { id: "4", videoId: "6ivD8ryf4Bo", description: "Clean Green India Mission activities", order: 3, active: true }
    ],
    achievements: [
      { id: "1", year: "2023", title: "Foundation Registration", description: "Registered as Non-Profit Organization", icon: "Shield", order: 0, active: true },
      { id: "2", year: "2024", title: "Clean Green India", description: "Active participant in national mission", icon: "Leaf", order: 1, active: true },
      { id: "3", year: "2024", title: "50+ Communities", description: "Expanded operations across Uttar Pradesh", icon: "MapPin", order: 2, active: true },
      { id: "4", year: "2025", title: "Skill Centers", description: "Multiple vocational training centers launched", icon: "GraduationCap", order: 3, active: true }
    ],
    testimonials: [
      { id: "1", name: "Rajesh Kumar", role: "Skill Training Beneficiary", text: "The poultry farming training changed my life. I now run my own successful business.", location: "Aligarh, UP", image: "/images/sonu-giri.jpeg", order: 0, active: true },
      { id: "2", name: "Priya Sharma", role: "Women Empowerment Program", text: "The self-help group helped me start a small business and become financially independent.", location: "Jewar, UP", image: "/images/sonu-giri.jpeg", order: 1, active: true },
      { id: "3", name: "Dr. Amit Verma", role: "Medical Volunteer", text: "Proud to be part of health camps that reach underserved communities with essential care.", location: "Medical Advisor", image: "/images/sonu-giri.jpeg", order: 2, active: true }
    ],
    partners: [
      { id: "1", name: "Government of UP", logo: "/logos/gov-up.png", order: 0, active: true },
      { id: "2", name: "Clean Green India", logo: "/logos/cgi-logo.png", order: 1, active: true },
      { id: "3", name: "NGO Network", logo: "/logos/ngo-network.png", order: 2, active: true },
      { id: "4", name: "Corporate Partners", logo: "/logos/corporate.png", order: 3, active: true }
    ],
    workGallery: [
      { id: "1", image: "/images/team-activity-1.png", description: "", order: 0, active: true },
      { id: "2", image: "/images/our-work-2.png", description: "", order: 1, active: true },
      { id: "3", image: "/images/our-work-3.png", description: "", order: 2, active: true },
      { id: "4", image: "/images/our-work-4.png", description: "", order: 3, active: true },
      { id: "5", image: "/images/team-award.png", description: "", order: 4, active: true }
    ]
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"about" | "stats" | "gallery" | "videos" | "milestones" | "testimonials" | "partners" | "cta" | "social">("about")
  
  // Image upload states
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Form states
  const [editingStat, setEditingStat] = useState<Stat | null>(null)
  const [editingVideo, setEditingVideo] = useState<YoutubeVideo | null>(null)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [editingGalleryItem, setEditingGalleryItem] = useState<WorkGalleryItem | null>(null)

  // Load data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        const homeDoc = await getDoc(doc(db, "homePage", "data"))
        if (homeDoc.exists()) {
          setHomeData(homeDoc.data() as HomePageData)
        }
      } catch (err: any) {
        console.error("Error loading home page data:", err)
        setError("Failed to load home page data")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Upload image to Firebase Storage
  const uploadImageToFirebaseStorage = async (
    file: File, 
    existingImagePath?: string, 
    folder: "home-images" = "home-images"
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

  const saveHomeData = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await setDoc(doc(db, "homePage", "data"), homeData, { merge: true })
      setSuccess("Home page data saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to save data: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setImageFile(file)
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
  }

  const addGalleryItem = async () => {
    if (!imageFile) {
      setError("Please select an image")
      return
    }

    try {
      setUploading(true)
      const imageData = await uploadImageToFirebaseStorage(imageFile)

      const newItem: WorkGalleryItem = {
        id: `gallery_${Date.now()}`,
        image: imageData.url,
        imagePath: imageData.path,
        description: "",
        order: homeData.workGallery.length,
        active: true
      }

      const updatedGallery = [...homeData.workGallery, newItem]
      setHomeData({ ...homeData, workGallery: updatedGallery })

      setImageFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }

      setSuccess("Gallery item added successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to add gallery item: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const deleteGalleryItem = async (index: number) => {
    const item = homeData.workGallery[index]
    if (!confirm("Are you sure you want to delete this gallery item?")) return

    try {
      if (item.imagePath) {
        try {
          const imageRef = ref(storage, item.imagePath)
          await deleteObject(imageRef)
        } catch (err) {
          console.warn("Could not delete image from storage:", err)
        }
      }

      const updatedGallery = homeData.workGallery.filter((_, i) => i !== index)
      setHomeData({ ...homeData, workGallery: updatedGallery })

      setSuccess("Gallery item deleted successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to delete gallery item: ${err.message}`)
    }
  }

  const handleReorder = (array: any[], index: number, direction: "up" | "down", field: keyof HomePageData) => {
    const newArray = [...array]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newArray.length) return

    const tempOrder = newArray[index].order
    newArray[index].order = newArray[targetIndex].order
    newArray[targetIndex].order = tempOrder

    // Swap the items
    const tempItem = newArray[index]
    newArray[index] = newArray[targetIndex]
    newArray[targetIndex] = tempItem

    setHomeData({ ...homeData, [field]: newArray })
    setSuccess("Order updated successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const addStat = () => {
    const newStat: Stat = {
      id: `stat_${Date.now()}`,
      number: "",
      label: "",
      description: "",
      order: homeData.stats.length,
      active: true
    }
    setHomeData({ ...homeData, stats: [...homeData.stats, newStat] })
    setEditingStat(newStat)
  }

  const updateStat = () => {
    if (!editingStat) return

    const updatedStats = homeData.stats.map(stat => 
      stat.id === editingStat.id ? editingStat : stat
    )
    setHomeData({ ...homeData, stats: updatedStats })
    setEditingStat(null)
    setSuccess("Stat updated successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const deleteStat = (id: string) => {
    if (!confirm("Are you sure you want to delete this statistic?")) return

    const updatedStats = homeData.stats.filter(stat => stat.id !== id)
    setHomeData({ ...homeData, stats: updatedStats })
    setSuccess("Stat deleted successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const addVideo = () => {
    const newVideo: YoutubeVideo = {
      id: `video_${Date.now()}`,
      videoId: "",
      description: "",
      order: homeData.youtubeVideos.length,
      active: true
    }
    setHomeData({ ...homeData, youtubeVideos: [...homeData.youtubeVideos, newVideo] })
    setEditingVideo(newVideo)
  }

  const updateVideo = () => {
    if (!editingVideo) return

    const updatedVideos = homeData.youtubeVideos.map(video => 
      video.id === editingVideo.id ? editingVideo : video
    )
    setHomeData({ ...homeData, youtubeVideos: updatedVideos })
    setEditingVideo(null)
    setSuccess("Video updated successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const deleteVideo = (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    const updatedVideos = homeData.youtubeVideos.filter(video => video.id !== id)
    setHomeData({ ...homeData, youtubeVideos: updatedVideos })
    setSuccess("Video deleted successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: `achievement_${Date.now()}`,
      year: "",
      title: "",
      description: "",
      icon: "Shield",
      order: homeData.achievements.length,
      active: true
    }
    setHomeData({ ...homeData, achievements: [...homeData.achievements, newAchievement] })
    setEditingAchievement(newAchievement)
  }

  const updateAchievement = () => {
    if (!editingAchievement) return

    const updatedAchievements = homeData.achievements.map(achievement => 
      achievement.id === editingAchievement.id ? editingAchievement : achievement
    )
    setHomeData({ ...homeData, achievements: updatedAchievements })
    setEditingAchievement(null)
    setSuccess("Achievement updated successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const deleteAchievement = (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return

    const updatedAchievements = homeData.achievements.filter(achievement => achievement.id !== id)
    setHomeData({ ...homeData, achievements: updatedAchievements })
    setSuccess("Achievement deleted successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `testimonial_${Date.now()}`,
      name: "",
      role: "",
      text: "",
      location: "",
      image: "",
      order: homeData.testimonials.length,
      active: true
    }
    setHomeData({ ...homeData, testimonials: [...homeData.testimonials, newTestimonial] })
    setEditingTestimonial(newTestimonial)
  }

  const updateTestimonial = () => {
    if (!editingTestimonial) return

    const updatedTestimonials = homeData.testimonials.map(testimonial => 
      testimonial.id === editingTestimonial.id ? editingTestimonial : testimonial
    )
    setHomeData({ ...homeData, testimonials: updatedTestimonials })
    setEditingTestimonial(null)
    setSuccess("Testimonial updated successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const deleteTestimonial = (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    const updatedTestimonials = homeData.testimonials.filter(testimonial => testimonial.id !== id)
    setHomeData({ ...homeData, testimonials: updatedTestimonials })
    setSuccess("Testimonial deleted successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const addPartner = () => {
    const newPartner: Partner = {
      id: `partner_${Date.now()}`,
      name: "",
      logo: "",
      order: homeData.partners.length,
      active: true
    }
    setHomeData({ ...homeData, partners: [...homeData.partners, newPartner] })
    setEditingPartner(newPartner)
  }

  const updatePartner = () => {
    if (!editingPartner) return

    const updatedPartners = homeData.partners.map(partner => 
      partner.id === editingPartner.id ? editingPartner : partner
    )
    setHomeData({ ...homeData, partners: updatedPartners })
    setEditingPartner(null)
    setSuccess("Partner updated successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const deletePartner = (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return

    const updatedPartners = homeData.partners.filter(partner => partner.id !== id)
    setHomeData({ ...homeData, partners: updatedPartners })
    setSuccess("Partner deleted successfully!")
    setTimeout(() => setSuccess(null), 2000)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Shield": return Shield
      case "Leaf": return Leaf
      case "MapPin": return MapPin
      case "GraduationCap": return GraduationCap
      case "Users": return Users
      case "Target": return Target
      case "Heart": return Heart
      case "Eye": return Eye
      case "Activity": return Activity
      case "TreePine": return TreePine
      case "Award": return Award
      case "CheckCircle": return CheckCircle
      default: return Shield
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
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
          <CheckCircleIcon className="text-green-500 flex-shrink-0" size={20} />
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("about")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "about"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              About Section
            </div>
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "stats"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              Stats Section
            </div>
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "gallery"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Work Gallery
            </div>
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "videos"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Videos
            </div>
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "milestones"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Milestones
            </div>
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "testimonials"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Testimonials
            </div>
          </button>
          <button
            onClick={() => setActiveTab("partners")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "partners"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Handshake className="w-4 h-4" />
              Partners
            </div>
          </button>
          <button
            onClick={() => setActiveTab("cta")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "cta"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <TargetIcon className="w-4 h-4" />
              CTA Section
            </div>
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === "social"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Social Media
            </div>
          </button>
        </nav>
      </div>

      {/* ABOUT TAB */}
      {activeTab === "about" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">About Section</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={homeData.aboutTitle}
                  onChange={(e) => setHomeData({...homeData, aboutTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="About section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={homeData.aboutDescription}
                  onChange={(e) => setHomeData({...homeData, aboutDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={4}
                  placeholder="About section description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mission *</label>
                  <textarea
                    value={homeData.mission}
                    onChange={(e) => setHomeData({...homeData, mission: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                    placeholder="Our mission statement"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vision *</label>
                  <textarea
                    value={homeData.vision}
                    onChange={(e) => setHomeData({...homeData, vision: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                    placeholder="Our vision statement"
                  />
                </div>
              </div>

              {/* Work Gallery Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Gallery Title *</label>
                <input
                  type="text"
                  value={homeData.workGalleryTitle}
                  onChange={(e) => setHomeData({...homeData, workGalleryTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Work gallery title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Gallery Description *</label>
                <input
                  type="text"
                  value={homeData.workGalleryDescription}
                  onChange={(e) => setHomeData({...homeData, workGalleryDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Work gallery description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Work Title *</label>
                <input
                  type="text"
                  value={homeData.featuredWorkTitle}
                  onChange={(e) => setHomeData({...homeData, featuredWorkTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Featured work title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Featured Work Description *</label>
                <input
                  type="text"
                  value={homeData.featuredWorkDescription}
                  onChange={(e) => setHomeData({...homeData, featuredWorkDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Featured work description"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATS TAB */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Statistics Section</h2>
              <button
                onClick={addStat}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Statistic
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {homeData.stats
                .sort((a, b) => a.order - b.order)
                .map((stat, index) => (
                  <div key={stat.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{stat.label}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(homeData.stats, index, "up", "stats")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleReorder(homeData.stats, index, "down", "stats")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === homeData.stats.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <p className="text-sm text-gray-600 mb-4">{stat.description}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingStat(stat)}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStat(stat.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* GALLERY TAB */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Work Gallery</h2>
              <div className="flex items-center gap-4">
                {/* Add Image Form */}
                <div className="flex items-center gap-2">
                  <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}>
                    <Upload size={18} />
                    {uploading ? "Uploading..." : "Add Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
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
                      <button
                        onClick={addGalleryItem}
                        disabled={uploading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {homeData.workGallery
                .sort((a, b) => a.order - b.order)
                .map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative h-48">
                      <img
                        src={item.image}
                        alt="Gallery item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Order: {item.order + 1}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReorder(homeData.workGallery, index, "up", "workGallery")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleReorder(homeData.workGallery, index, "down", "workGallery")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === homeData.workGallery.length - 1}
                            title="Move down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => setEditingGalleryItem(item)}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deleteGalleryItem(index)}
                            className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIDEOS TAB */}
      {activeTab === "videos" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">YouTube Videos</h2>
                <p className="text-sm text-gray-600 mt-1">Videos that appear on the home page</p>
              </div>
              <button
                onClick={addVideo}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Video
              </button>
            </div>

            {/* Videos Section Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  value={homeData.videosTitle}
                  onChange={(e) => setHomeData({...homeData, videosTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description *</label>
                <input
                  type="text"
                  value={homeData.videosDescription}
                  onChange={(e) => setHomeData({...homeData, videosDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Videos List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {homeData.youtubeVideos
                .sort((a, b) => a.order - b.order)
                .map((video, index) => (
                  <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="relative">
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                        alt={video.description}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Video ID: {video.videoId}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleReorder(homeData.youtubeVideos, index, "up", "youtubeVideos")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => handleReorder(homeData.youtubeVideos, index, "down", "youtubeVideos")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === homeData.youtubeVideos.length - 1}
                            title="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            onClick={() => setEditingVideo(video)}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deleteVideo(video.id)}
                            className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MILESTONES TAB */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Milestones Timeline</h2>
                <p className="text-sm text-gray-600 mt-1">Achievements and milestones</p>
              </div>
              <button
                onClick={addAchievement}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Milestone
              </button>
            </div>

            {/* Milestones Section Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  value={homeData.milestonesTitle}
                  onChange={(e) => setHomeData({...homeData, milestonesTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <input
                  type="text"
                  value={homeData.milestonesDescription}
                  onChange={(e) => setHomeData({...homeData, milestonesDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Milestones List */}
            <div className="space-y-4">
              {homeData.achievements
                .sort((a, b) => a.order - b.order)
                .map((achievement, index) => {
                  const Icon = getIconComponent(achievement.icon)
                  return (
                    <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="text-yellow-600 w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <div className="text-xl font-bold text-gray-900">{achievement.year}</div>
                              <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
                            </div>
                            <p className="text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReorder(homeData.achievements, index, "up", "achievements")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleReorder(homeData.achievements, index, "down", "achievements")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === homeData.achievements.length - 1}
                            title="Move down"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            onClick={() => setEditingAchievement(achievement)}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => deleteAchievement(achievement.id)}
                            className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === "testimonials" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Testimonials</h2>
                <p className="text-sm text-gray-600 mt-1">What people say about our work</p>
              </div>
              <button
                onClick={addTestimonial}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Testimonial
              </button>
            </div>

            {/* Testimonials Section Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  value={homeData.testimonialsTitle}
                  onChange={(e) => setHomeData({...homeData, testimonialsTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <input
                  type="text"
                  value={homeData.testimonialsDescription}
                  onChange={(e) => setHomeData({...homeData, testimonialsDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Testimonials List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {homeData.testimonials
                .sort((a, b) => a.order - b.order)
                .map((testimonial, index) => (
                  <div key={testimonial.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="text-3xl text-yellow-500/30 mb-3">"</div>
                    <p className="text-gray-600 italic mb-4 line-clamp-4">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-yellow-600">{testimonial.role}</p>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                          <MapPin className="w-3 h-3" />
                          {testimonial.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReorder(homeData.testimonials, index, "up", "testimonials")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleReorder(homeData.testimonials, index, "down", "testimonials")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === homeData.testimonials.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          onClick={() => setEditingTestimonial(testimonial)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded"
                          title="Edit"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-200 rounded"
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* PARTNERS TAB */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Partners & Recognition</h2>
                <p className="text-sm text-gray-600 mt-1">Organizations that trust and support us</p>
              </div>
              <button
                onClick={addPartner}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Partner
              </button>
            </div>

            {/* Partners Section Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  value={homeData.partnersTitle}
                  onChange={(e) => setHomeData({...homeData, partnersTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description</label>
                <input
                  type="text"
                  value={homeData.partnersDescription}
                  onChange={(e) => setHomeData({...homeData, partnersDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Partners List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {homeData.partners
                .sort((a, b) => a.order - b.order)
                .map((partner, index) => (
                  <div key={partner.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(homeData.partners, index, "up", "partners")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleReorder(homeData.partners, index, "down", "partners")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === homeData.partners.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-500">{partner.name}</div>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => setEditingPartner(partner)}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePartner(partner.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA TAB */}
      {activeTab === "cta" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Call to Action Section</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={homeData.ctaSection.title}
                  onChange={(e) => setHomeData({
                    ...homeData,
                    ctaSection: { ...homeData.ctaSection, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={homeData.ctaSection.description}
                  onChange={(e) => setHomeData({
                    ...homeData,
                    ctaSection: { ...homeData.ctaSection, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Donation Button Text *</label>
                  <input
                    type="text"
                    value={homeData.ctaSection.donationText}
                    onChange={(e) => setHomeData({
                      ...homeData,
                      ctaSection: { ...homeData.ctaSection, donationText: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Volunteer Button Text *</label>
                  <input
                    type="text"
                    value={homeData.ctaSection.volunteerText}
                    onChange={(e) => setHomeData({
                      ...homeData,
                      ctaSection: { ...homeData.ctaSection, volunteerText: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* CTA Stats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {homeData.ctaSection.stats.map((stat, index) => (
                    <div key={index} className="space-y-2">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...homeData.ctaSection.stats]
                          newStats[index].value = e.target.value
                          setHomeData({
                            ...homeData,
                            ctaSection: { ...homeData.ctaSection, stats: newStats }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Value (e.g., 100%)"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...homeData.ctaSection.stats]
                          newStats[index].label = e.target.value
                          setHomeData({
                            ...homeData,
                            ctaSection: { ...homeData.ctaSection, stats: newStats }
                          })
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Label (e.g., Transparent)"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SOCIAL MEDIA TAB */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={homeData.socialMedia.youtube}
                  onChange={(e) => setHomeData({
                    ...homeData,
                    socialMedia: { ...homeData.socialMedia, youtube: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://youtube.com/@channel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={homeData.socialMedia.facebook}
                  onChange={(e) => setHomeData({
                    ...homeData,
                    socialMedia: { ...homeData.socialMedia, facebook: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://facebook.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={homeData.socialMedia.instagram}
                  onChange={(e) => setHomeData({
                    ...homeData,
                    socialMedia: { ...homeData.socialMedia, instagram: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://instagram.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                <input
                  type="text"
                  value={homeData.socialMedia.twitter}
                  onChange={(e) => setHomeData({
                    ...homeData,
                    socialMedia: { ...homeData.socialMedia, twitter: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  value={homeData.socialMedia.linkedin}
                  onChange={(e) => setHomeData({
                    ...homeData,
                    socialMedia: { ...homeData.socialMedia, linkedin: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="https://linkedin.com/company/username"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save All Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Save All Changes</h3>
            <p className="text-sm text-gray-600">Save all modifications to the home page</p>
          </div>
          <button
            onClick={saveHomeData}
            disabled={saving}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Edit Modals */}
      {/* Edit Stat Modal */}
      {editingStat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Statistic</h2>
                <button onClick={() => setEditingStat(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number *</label>
                  <input
                    type="text"
                    value={editingStat.number}
                    onChange={(e) => setEditingStat({...editingStat, number: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., 50+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                  <input
                    type="text"
                    value={editingStat.label}
                    onChange={(e) => setEditingStat({...editingStat, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Communities Served"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    value={editingStat.description}
                    onChange={(e) => setEditingStat({...editingStat, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Across Uttar Pradesh"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingStat(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateStat}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit YouTube Video</h2>
                <button onClick={() => setEditingVideo(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID *</label>
                  <input
                    type="text"
                    value={editingVideo.videoId}
                    onChange={(e) => setEditingVideo({...editingVideo, videoId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., l7TkcC_o36k"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The ID is the part after "v=" in the YouTube URL
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Our journey and impact story"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingVideo(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateVideo}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Achievement Modal */}
      {editingAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Milestone</h2>
                <button onClick={() => setEditingAchievement(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <input
                    type="text"
                    value={editingAchievement.year}
                    onChange={(e) => setEditingAchievement({...editingAchievement, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., 2023"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={editingAchievement.title}
                    onChange={(e) => setEditingAchievement({...editingAchievement, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Foundation Registration"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    value={editingAchievement.description}
                    onChange={(e) => setEditingAchievement({...editingAchievement, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Registered as Non-Profit Organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={editingAchievement.icon}
                    onChange={(e) => setEditingAchievement({...editingAchievement, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="Shield">Shield</option>
                    <option value="Leaf">Leaf</option>
                    <option value="MapPin">MapPin</option>
                    <option value="GraduationCap">GraduationCap</option>
                    <option value="Award">Award</option>
                    <option value="CheckCircle">Check Circle</option>
                    <option value="Users">Users</option>
                    <option value="Target">Target</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingAchievement(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateAchievement}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {editingTestimonial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Testimonial</h2>
                <button onClick={() => setEditingTestimonial(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingTestimonial.name}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <input
                    type="text"
                    value={editingTestimonial.role}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text *</label>
                  <textarea
                    value={editingTestimonial.text}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    value={editingTestimonial.location}
                    onChange={(e) => setEditingTestimonial({...editingTestimonial, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingTestimonial(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTestimonial}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Partner Modal */}
      {editingPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Partner</h2>
                <button onClick={() => setEditingPartner(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingPartner.name}
                    onChange={(e) => setEditingPartner({...editingPartner, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingPartner(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updatePartner}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}