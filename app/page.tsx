"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Award,
  Users,
  Target,
  Heart,
  Leaf,
  BookOpen,
  Handshake,
  Lightbulb,
  Globe,
  Play,
  ChevronRight,
  TrendingUp,
  Shield,
  Star,
  Clock,
  CheckCircle,
  MapPin,
  BarChart3,
  FileText,
  Building2,
  Medal,
  Target as TargetIcon,
  Zap,
  Eye,
  Droplets,
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
  Droplet,
  ShieldCheck,
  Globe2,
  Clock4,
  ExternalLink,
} from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Banner Images
  const banners = [
    "/images/banner.png",
    "/images/hero-image.jpg", 
    "/images/foundation-banner.png",
  ]

  // YouTube Videos
  const youtubeVideos = [
    { id: "l7TkcC_o36k",  description: "Our journey and impact story" },
    { id: "szEHs0kxGX4", description: "Youth training in action" },
    { id: "xUg5cXIv6UY",  description: "Medical services in rural areas" },
    { id: "6ivD8ryf4Bo",description: "Clean Green India Mission activities" },
  ]

  const initiatives = [
    {
      title: "Education & Skill Development",
      description: "Vocational training centers for youth empowerment in poultry, fishery, and technical skills",
      icon: School,
      stats: "500+ Youth Trained",
      color: "bg-gray-900",
      image: "/images/team-activity-1.jpg"
    },
    {
      title: "Environmental Conservation",
      description: "Active participation in Clean Green India Mission with pollution control and tree plantation",
      icon: TreePine,
      stats: "1000+ Trees Planted",
      color: "bg-black",
      image: "/images/environment-banner.jpg"
    },
    {
      title: "Community Welfare",
      description: "Support for SC/ST/OBC communities, women empowerment, and handicapped assistance programs",
      icon: UsersIcon,
      stats: "50+ Communities",
      color: "bg-gray-900",
      image: "/images/community-banner.jpg"
    },
    {
      title: "Health Initiatives",
      description: "Health awareness programs, eye/blood donation camps, and sanitation drives",
      icon: Activity,
      stats: "10,000+ Served",
      color: "bg-black",
      image: "/images/health-banner.jpg"
    },
  ]

  const stats = [
    { number: "50+", label: "Communities Served", icon: MapPin, description: "Across Uttar Pradesh" },
    { number: "5000+", label: "Lives Impacted", icon: Users, description: "Through our programs" },
    { number: "20+", label: "Active Programs", icon: TargetIcon, description: "In multiple sectors" },
    { number: "45+", label: "Social Objectives", icon: Target, description: "For comprehensive development" },
  ]

  const values = [
    {
      icon: ShieldCheck,
      title: "Transparency",
      description: "Complete financial transparency and regular impact reports",
      color: "bg-gray-50"
    },
    {
      icon: Handshake,
      title: "Accountability",
      description: "Accountable to our donors, partners, and communities we serve",
      color: "bg-gray-100"
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Highest standards in program implementation and impact measurement",
      color: "bg-gray-50"
    },
    {
      icon: TrendingUp,
      title: "Sustainability",
      description: "Long-term solutions that create lasting environmental and social impact",
      color: "bg-gray-100"
    },
  ]

  const programs = [
    {
      title: "Skill Training Centers",
      description: "Poultry farming, fishery management, and vocational skill development for youth employment",
      image: "/images/team-activity-1.jpg",
      stats: ["500+ Trained", "80% Employment"],
      duration: "6-12 months"
    },
    {
      title: "Education Support",
      description: "Scholarships for backward classes, coaching centers, and educational guidance programs",
      image: "/images/education-support.jpg",
      stats: ["1000+ Students", "50 Schools"],
      duration: "Ongoing"
    },
    {
      title: "Women Empowerment",
      description: "Self-help groups, entrepreneurship training, and income generation programs for women",
      image: "/images/women-empowerment.jpg",
      stats: ["800+ Women", "200+ SHGs"],
      duration: "2-3 years"
    },
    {
      title: "Health Initiatives",
      description: "Eye camps, blood donation drives, health awareness, and sanitation programs",
      image: "/images/health-camp.jpg",
      stats: ["10,000+ Served", "50+ Camps"],
      duration: "Monthly"
    },
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

  // Animated Banner Slider
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white">
        {/* Hero Section with Animated Banner - OVERLAY REMOVED */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {banners.map((banner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: currentBanner === index ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
              >
                <Image
                  src={banner}
                  alt={`Foundation Banner ${index + 1}`}
                  fill
                  className="object-cover w-full h-full"
                  priority
                />
                {/* OVERLAY REMOVED - Previously: bg-gradient-to-r from-black/70 via-black/50 to-transparent */}
              </motion.div>
            ))}
          </div>
          
          {/* Banner Navigation */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-all ${currentBanner === index ? 'bg-yellow-500 w-8' : 'bg-white/50 hover:bg-white'}`}
              />
            ))}
          </div>
          
          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <ChevronRight className="text-white rotate-90" size={24} />
          </motion.div>
        </section>

        {/* Quick Stats */}
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-yellow-400 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                  <div className="text-lg font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm opacity-80">{stat.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Foundation */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-600 uppercase tracking-wider">
                    <span className="w-8 h-px bg-yellow-500"></span>
                    About Our Foundation
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Building a Better Tomorrow, <span className="text-yellow-600">Together</span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Established with a vision to create sustainable social impact, Aapka Sahyog Foundation 
                    works tirelessly to uplift marginalized communities through comprehensive development programs 
                    across Uttar Pradesh.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <Target className="text-yellow-600 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-gray-900">Our Mission</h4>
                      <p className="text-gray-600">To empower communities through sustainable development initiatives</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <Eye className="text-yellow-600 mt-1" size={24} />
                    <div>
                      <h4 className="font-bold text-gray-900">Our Vision</h4>
                      <p className="text-gray-600">A society where every individual has access to opportunities and dignity</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-all"
                  >
                    Read Our Story
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    <Phone size={16} />
                    Contact Us
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/images/team-activity-1.png"
                        alt="Community Meeting"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/images/team-award.png"
                        alt="Training Session"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="relative h-64 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/images/our-work-3.png"
                        alt="Health Camp"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/images/our-work-4.png"
                        alt="Tree Plantation"
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Work Gallery Banner */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-4">
                <span className="w-8 h-px bg-yellow-500"></span>
                Our Work Gallery
                <span className="w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Impact in <span className="text-yellow-600">Action</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Witness the transformative work we're doing across communities in Uttar Pradesh
              </p>
            </motion.div>
            
            {/* Featured Work Banner */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
              <Image
                src="/images/about-banner.jpg"
                alt="Featured Work - Community Development"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-semibold mb-4">
                    <Camera size={14} />
                    Featured Work
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Community Development in Rural Uttar Pradesh</h3>
                  <p className="text-white/90 max-w-2xl">Transforming lives through integrated development programs</p>
                </div>
              </div>
            </div>
            
            {/* Work Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="group relative overflow-hidden rounded-xl shadow-lg"
                >
                  <div className="relative h-64">
                    <Image
                      src={work.image}
                      alt="IMAGE NOT FOUND"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        {/* <div className="text-sm font-semibold text-yellow-400 mb-1">{work.category}</div>
                        <h4 className="text-xl font-bold">{work.title}</h4> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* <div className="text-center mt-12">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all"
              >
                <Camera size={18} />
                Explore Full Gallery
              </Link>
            </div> */}
          </div>
        </section>

        {/* YouTube Videos Section */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-4">
                <span className="w-8 h-px bg-yellow-500"></span>
                Video Stories
                <span className="w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Watch Our <span className="text-yellow-400">Impact</span> Stories
              </h2>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Experience the transformative work through our video documentation
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {youtubeVideos.slice(0, 2).map((video, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <div className="relative h-64 md:h-80">
                      <Image
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                        alt={video.description}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors"
                      >
                        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={32} className="text-black ml-1" />
                        </div>
                      </a>
                    </div>
                    <div className="p-6 bg-gray-900">
                      {/* <h3 className="text-xl font-bold mb-2">{video.title}</h3> */}
                      <p className="text-white/70">{video.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                      <div className="relative h-40">
                        <Image
                          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                          alt={video.description}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Play size={20} className="text-black ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-900">
                        {/* <h4 className="font-semibold text-sm line-clamp-2">{video.title}</h4> */}
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <a
                href="https://www.youtube.com/@aapkasahyogfoundation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:-translate-y-1"
              >
                <Youtube size={24} />
                <span>Subscribe to Our YouTube Channel</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-4">
                <span className="w-8 h-px bg-yellow-500"></span>
                Our Journey
                <span className="w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Milestones of <span className="text-yellow-600">Impact</span>
              </h2>
            </motion.div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-yellow-500/30 hidden md:block"></div>
              
              <div className="space-y-12">
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
                      <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} mb-6 md:mb-0`}>
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:border-yellow-500 transition-colors">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                              <Icon className="text-yellow-600" size={24} />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{achievement.year}</div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                          <p className="text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      
                      <div className="w-6 h-6 bg-yellow-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                      
                      <div className="w-full md:w-1/2"></div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-4">
                <span className="w-8 h-px bg-yellow-500"></span>
                Community Voices
                <span className="w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Stories of <span className="text-yellow-400">Transformation</span>
              </h2>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900 rounded-2xl overflow-hidden group"
                >
                  <div className="relative h-48">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold">{testimonial.name}</h3>
                      <p className="text-yellow-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl text-yellow-500/30 mb-4">"</div>
                    <p className="text-white/80 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <MapPin size={14} />
                      {testimonial.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners & Recognition */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-600 uppercase tracking-wider mb-4">
                <span className="w-8 h-px bg-yellow-500"></span>
                Our Partners
                <span className="w-8 h-px bg-yellow-500"></span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Trusted by Leading Organizations
              </h2>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-xl p-6 flex items-center justify-center h-32 hover:bg-gray-100 transition-colors"
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">{partner.name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full mb-8">
                  <Star size={16} className="text-black" />
                  <span className="text-black text-sm font-semibold">Join Our Mission Today</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                  Together, We Can Make a Difference
                </h2>
                
                <p className="text-black/80 text-xl mb-10 max-w-2xl mx-auto font-medium">
                  Your support enables us to continue our vital work in education, healthcare, environment, and community development.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                  <Link
                    href="/donate"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <Heart size={20} />
                    <span>Make a Donation</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/volunteer"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/20 text-black rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-black/10"
                  >
                    <Users size={20} />
                    <span>Become a Volunteer</span>
                  </Link>
                </div>
                
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">100%</div>
                    <div className="text-sm text-black/70">Transparent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">45+</div>
                    <div className="text-sm text-black/70">Objectives</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">24/7</div>
                    <div className="text-sm text-black/70">Support</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full -translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full translate-x-48 translate-y-48"></div>
            </motion.div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Follow Our Journey</h3>
                <p className="text-white/70">Stay updated with our latest work and impact stories</p>
              </div>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Youtube size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors">
                  <Linkedin size={20} />
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