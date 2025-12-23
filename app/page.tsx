"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Users,
  Target,
  Heart,
  Leaf,
  BookOpen,
  Handshake,
  Play,
  ChevronRight,
  TrendingUp,
  Shield,
  Star,
  CheckCircle,
  MapPin,
  Target as TargetIcon,
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
} from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

interface Banner {
  id: string
  imageUrl: string
  title?: string
  description?: string
  order: number
  active: boolean
}

interface Stat {
  id: string
  number: string
  label: string
  description: string
  order: number
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentBanner, setCurrentBanner] = useState(0)
  
  // State for dynamic content
  const [banners, setBanners] = useState<Banner[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [bannerError, setBannerError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoaded(true)
    
    // Load all dynamic content
    fetchHomePageData()
    
    // Banner rotation interval
    const interval = setInterval(() => {
      if (banners.length > 0) {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }
    }, 5000)
    
    return () => clearInterval(interval)
  }, [banners.length])

  // Fetch all home page data from Firestore
  const fetchHomePageData = async () => {
    try {
      setLoading(true)
      setBannerError(null)
      
      // Fetch banners - get all and filter locally to avoid index requirement
      console.log("Fetching banners from Firestore...")
      const bannersQuery = query(
        collection(db, "homeBanners"), 
        orderBy("order") // Only order by, no where clause to avoid index requirement
      )
      const bannersSnapshot = await getDocs(bannersQuery)
      console.log(`Found ${bannersSnapshot.size} banners`)
      
      let bannersData: Banner[] = []
      bannersSnapshot.forEach((doc) => {
        const data = doc.data()
        console.log(`Banner ${doc.id}:`, data)
        bannersData.push({
          id: doc.id,
          imageUrl: data.imageUrl || "",
          title: data.title || "",
          description: data.description || "",
          order: data.order || 0,
          active: data.active === undefined ? true : data.active
        } as Banner)
      })
      
      // Filter active banners locally
      bannersData = bannersData.filter(banner => banner.active === true)
      
      // Sort by order
      bannersData.sort((a, b) => a.order - b.order)
      setBanners(bannersData)
      console.log(`✅ ${bannersData.length} active banners loaded successfully`)

      // If no banners are active, show a fallback banner
      if (bannersData.length === 0) {
        console.log("No active banners found, using fallback")
        setBanners([
          { 
            id: 'fallback', 
            imageUrl: '/images/banner.png', 
            title: 'Aapka Sahyog Foundation',
            description: 'Building a better tomorrow together',
            order: 0, 
            active: true 
          }
        ])
      }

      // Fetch stats - only orderBy, no where clause to avoid index requirement
      try {
        const statsQuery = query(collection(db, "homeStats"), orderBy("order"))
        const statsSnapshot = await getDocs(statsQuery)
        const statsData: Stat[] = []
        statsSnapshot.forEach((doc) => {
          const data = doc.data()
          statsData.push({
            id: doc.id,
            number: data.number || "",
            label: data.label || "",
            description: data.description || "",
            order: data.order || 0
          } as Stat)
        })
        
        // Sort by order
        statsData.sort((a, b) => a.order - b.order)
        
        // If no stats in Firestore, use fallback stats
        if (statsData.length === 0) {
          setStats([
            { id: '1', number: "50+", label: "Communities Served", description: "Across Uttar Pradesh", order: 0 },
            { id: '2', number: "5000+", label: "Lives Impacted", description: "Through our programs", order: 1 },
            { id: '3', number: "20+", label: "Active Programs", description: "In multiple sectors", order: 2 },
            { id: '4', number: "45+", label: "Social Objectives", description: "For comprehensive development", order: 3 },
          ])
        } else {
          setStats(statsData)
        }
      } catch (statsError) {
        console.error("Error loading stats:", statsError)
        // Use fallback stats
        setStats([
          { id: '1', number: "50+", label: "Communities Served", description: "Across Uttar Pradesh", order: 0 },
          { id: '2', number: "5000+", label: "Lives Impacted", description: "Through our programs", order: 1 },
          { id: '3', number: "20+", label: "Active Programs", description: "In multiple sectors", order: 2 },
          { id: '4', number: "45+", label: "Social Objectives", description: "For comprehensive development", order: 3 },
        ])
      }

    } catch (error: any) {
      console.error("❌ Error fetching home page data:", error)
      setBannerError(`Failed to load banners: ${error.message}`)
      
      // Use fallback banner if Firestore fails
      setBanners([
        { 
          id: 'fallback', 
          imageUrl: '/images/banner.png', 
          title: 'Aapka Sahyog Foundation',
          description: 'Building a better tomorrow together',
          order: 0, 
          active: true 
        }
      ])
      
      setStats([
        { id: '1', number: "50+", label: "Communities Served", description: "Across Uttar Pradesh", order: 0 },
        { id: '2', number: "5000+", label: "Lives Impacted", description: "Through our programs", order: 1 },
        { id: '3', number: "20+", label: "Active Programs", description: "In multiple sectors", order: 2 },
        { id: '4', number: "45+", label: "Social Objectives", description: "For comprehensive development", order: 3 },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, bannerIndex: number) => {
    console.error(`Failed to load banner image: ${banners[bannerIndex]?.imageUrl}`)
    const img = e.target as HTMLImageElement
    
    // Try to use the fallback image
    img.src = '/images/banner.png'
    img.onerror = null // Prevent infinite loop
    
    // Update the banner with fallback image
    const updatedBanners = [...banners]
    updatedBanners[bannerIndex] = {
      ...updatedBanners[bannerIndex],
      imageUrl: '/images/banner.png'
    }
    setBanners(updatedBanners)
  }

  // YouTube Videos
  const youtubeVideos = [
    { id: "l7TkcC_o36k",  description: "Our journey and impact story" },
    { id: "szEHs0kxGX4", description: "Youth training in action" },
    { id: "xUg5cXIv6UY",  description: "Medical services in rural areas" },
    { id: "6ivD8ryf4Bo",description: "Clean Green India Mission activities" },
  ]

  const achievements = [
    { year: "2023", title: "Foundation Registration", description: "Registered as Non-Profit Organization", icon: Shield },
    { year: "2024", title: "Clean Green India", description: "Active participant in national mission", icon: Leaf },
    { year: "2024", title: "50+ Communities", description: "Expanded operations across Uttar Pradesh", icon: MapPin },
    { year: "2025", title: "Skill Centers", description: "Multiple vocational training centers launched", icon: GraduationCap },
  ]

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Skill Training Beneficiary",
      text: "The poultry farming training changed my life. I now run my own successful business.",
      location: "Aligarh, UP",
      image: "/images/sonu-giri.jpeg"
    },
    {
      name: "Priya Sharma",
      role: "Women Empowerment Program",
      text: "The self-help group helped me start a small business and become financially independent.",
      location: "Jewar, UP",
      image: "/images/sonu-giri.jpeg"
    },
    {
      name: "Dr. Amit Verma",
      role: "Medical Volunteer",
      text: "Proud to be part of health camps that reach underserved communities with essential care.",
      location: "Medical Advisor",
      image: "/images/sonu-giri.jpeg"
    },
  ]

  const partners = [
    { name: "Government of UP", logo: "/logos/gov-up.png" },
    { name: "Clean Green India", logo: "/logos/cgi-logo.png" },
    { name: "NGO Network", logo: "/logos/ngo-network.png" },
    { name: "Corporate Partners", logo: "/logos/corporate.png" },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading website content...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero Section - Fully Responsive */}
        <section className="relative h-[45vh] sm:h-[60vh] md:h-screen flex items-center justify-center overflow-hidden w-full">
          {/* Background Banners */}
          <div className="absolute inset-0 z-0">
            {banners.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentBanner === index ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                {/* Use regular img tag for Firebase Storage URLs for better error handling */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title || `Foundation Banner ${index + 1}`}
                  onError={(e) => handleImageError(e, index)}
                  className="w-full h-full object-cover bg-black"
                  style={{ 
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Banner Content Overlay */}
          <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {banners[currentBanner]?.title || 'Aapka Sahyog Foundation'}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-6 text-white/90">
                  {banners[currentBanner]?.description || 'Building a better tomorrow together'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                  >
                    Get Involved
                    <Users className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Banner Navigation */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    currentBanner === index
                      ? 'bg-yellow-500 w-6 sm:w-8'
                      : 'bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <ChevronRight className="text-white rotate-90 w-5 h-5 sm:w-6 sm:h-6" />
          </motion.div>

          {/* Error Message (hidden by default) */}
          {bannerError && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <span className="block sm:inline">{bannerError}</span>
            </div>
          )}
        </section>

        {/* Quick Stats - Responsive */}
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-8 sm:py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group px-2"
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 text-yellow-400 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base font-semibold mb-1">{stat.label}</div>
                  <div className="text-xs sm:text-sm opacity-80 leading-tight">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Foundation - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-4 sm:space-y-6"
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                    <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
                    About Our Foundation
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    Building a Better Tomorrow, <span className="text-yellow-600">Together</span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Established with a vision to create sustainable social impact, Aapka Sahyog Foundation 
                    works tirelessly to uplift marginalized communities through comprehensive development programs 
                    across Uttar Pradesh.
                  </p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                    <Target className="text-yellow-600 mt-1 w-5 h-5 sm:w-6 sm:h-6" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">Our Mission</h4>
                      <p className="text-gray-600 text-sm">To empower communities through sustainable development initiatives</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                    <Eye className="text-yellow-600 mt-1 w-5 h-5 sm:w-6 sm:h-6" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">Our Vision</h4>
                      <p className="text-gray-600 text-sm">A society where every individual has access to opportunities and dignity</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm sm:text-base"
                  >
                    <Phone className="w-4 h-4" />
                    Contact Us
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative mt-8 sm:mt-0"
              >
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative h-32 sm:h-36 md:h-48 rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
                      <Image
                        src="/images/team-activity-1.png"
                        alt="Community Meeting"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="relative h-40 sm:h-48 md:h-64 rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
                      <Image
                        src="/images/team-award.png"
                        alt="Training Session"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                    <div className="relative h-40 sm:h-48 md:h-64 rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
                      <Image
                        src="/images/our-work-3.png"
                        alt="Health Camp"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="relative h-32 sm:h-36 md:h-48 rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg">
                      <Image
                        src="/images/our-work-4.png"
                        alt="Tree Plantation"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Work Gallery Banner - Responsive */}
        <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
                Our Work Gallery
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Impact in <span className="text-yellow-600">Action</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
                Witness the transformative work we're doing across communities in Uttar Pradesh
              </p>
            </motion.div>
            
            {/* Featured Work Banner */}
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-2xl mb-8 sm:mb-10 md:mb-12">
              <Image
                src="/images/about-banner.jpg"
                alt="Featured Work - Community Development"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                  <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-yellow-500 text-black rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3 md:mb-4">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    Featured Work
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Community Development in Rural Uttar Pradesh</h3>
                  <p className="text-white/90 text-xs sm:text-sm md:text-base max-w-2xl">Transforming lives through integrated development programs</p>
                </div>
              </div>
            </div>
            
            {/* Work Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { image: "/images/team-activity-1.png" },
                { image: "/images/our-work-2.png"},
                { image: "/images/our-work-3.png"},
                { image: "/images/our-work-4.png"},
                { image: "/images/team-award.png"},
              ].map((work, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-lg sm:rounded-xl shadow-md sm:shadow-lg"
                >
                  <div className="relative h-48 sm:h-56 md:h-64">
                    <Image
                      src={work.image}
                      alt="Work Gallery"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                        {/* Optional content can be added here */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* YouTube Videos Section - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
                Video Stories
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Watch Our <span className="text-yellow-400">Impact</span> Stories
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto px-4">
                Experience the transformative work through our video documentation
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {youtubeVideos.map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative rounded-lg overflow-hidden">
                      <div className="relative h-32 sm:h-36 md:h-40">
                        <Image
                          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                          alt={video.description}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-black ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 bg-gray-900">
                        {/* Optional: Add video title here */}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-8 sm:mt-10 md:mt-12">
              <a
                href="https://www.youtube.com/@aapkasahyogfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:-translate-y-0.5 sm:hover:-translate-y-1 text-sm sm:text-base"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                <span>Subscribe to Our YouTube Channel</span>
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Milestones Timeline - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12 md:mb-16"
            >
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
                Our Journey
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Milestones of <span className="text-yellow-600">Impact</span>
              </h2>
            </motion.div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-yellow-500/30 hidden md:block"></div>
              
              <div className="space-y-8 sm:space-y-10 md:space-y-12">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-6 lg:pr-12' : 'md:pl-6 lg:pl-12'} mb-4 md:mb-0`}>
                        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md sm:shadow-lg border border-gray-200 hover:border-yellow-500 transition-colors">
                          <div className="flex items-center gap-3 mb-3 sm:mb-4">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                              <Icon className="text-yellow-600 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{achievement.year}</div>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{achievement.title}</h3>
                          <p className="text-gray-600 text-sm sm:text-base">{achievement.description}</p>
                        </div>
                      </div>
                      
                      <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellow-500 rounded-full border-2 sm:border-3 md:border-4 border-white shadow-lg z-10 my-2 md:my-0"></div>
                      
                      <div className="w-full md:w-1/2"></div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-12 md:mb-16"
            >
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
                Community Voices
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Stories of <span className="text-yellow-400">Transformation</span>
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden group p-4 sm:p-6 md:p-8"
                >
                  <div className="text-3xl sm:text-4xl text-yellow-500/30 mb-4 sm:mb-6 leading-none">"</div>
                  <p className="text-white/80 italic mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base md:text-lg">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="pt-4 sm:pt-6 border-t border-white/10">
                    <div className="flex flex-col">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{testimonial.name}</h3>
                      <div className="flex items-center justify-between mt-1 sm:mt-2">
                        <div>
                          <p className="text-yellow-400 text-xs sm:text-sm">{testimonial.role}</p>
                          <div className="flex items-center gap-1 text-white/60 text-xs sm:text-sm mt-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Recognition - Responsive */}
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-8 sm:mb-10 md:mb-12"
            >
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-3 sm:mb-4">
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
                Our Partners
                <span className="w-6 sm:w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Trusted by Leading Organizations
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24 md:h-28 lg:h-32 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-700">
                      {partner.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Responsive */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 text-center overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-black/20 rounded-full mb-4 sm:mb-6 md:mb-8">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                  <span className="text-black text-xs sm:text-sm font-semibold">Join Our Mission Today</span>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
                  Together, We Can Make a Difference
                </h2>
                
                <p className="text-black/80 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto font-medium">
                  Your support enables us to continue our vital work in education, healthcare, environment, and community development.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-10 md:mb-12">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-black text-white rounded-lg sm:rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 hover:shadow-lg sm:hover:shadow-2xl text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Make a Donation</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-4 bg-white/20 text-black rounded-lg sm:rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-black/10 text-sm sm:text-base w-full sm:w-auto"
                  >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Become a Volunteer</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black">100%</div>
                    <div className="text-xs sm:text-sm text-black/70">Transparent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black">45+</div>
                    <div className="text-xs sm:text-sm text-black/70">Objectives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black">24/7</div>
                    <div className="text-xs sm:text-sm text-black/70">Support</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-yellow-400/10 rounded-full -translate-x-16 sm:-translate-x-24 md:-translate-x-32 -translate-y-16 sm:-translate-y-24 md:-translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-yellow-400/10 rounded-full translate-x-24 sm:translate-x-32 md:translate-x-48 translate-y-24 sm:translate-y-32 md:translate-y-48"></div>
            </motion.div>
          </div>
        </section>

        {/* Social Media Section - Responsive */}
        <section className="py-8 sm:py-10 md:py-12 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">Follow Our Journey</h3>
                <p className="text-white/70 text-sm sm:text-base">Stay updated with our latest work and impact stories</p>
              </div>
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors" aria-label="Facebook">
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors" aria-label="Instagram">
                  <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
                <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}