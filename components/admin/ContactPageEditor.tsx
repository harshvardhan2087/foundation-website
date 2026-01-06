"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot,
  query,
  orderBy,
  deleteDoc
} from "firebase/firestore"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Users, 
  Send, 
  Globe, 
  Building2,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  EyeOff,
  MessageSquare,
  Calendar,
  User,
  Hash
} from "lucide-react"

interface ContactInfoItem {
  id: string
  icon: string
  title: string
  details: string[]
  order: number
  active: boolean
}

interface DonationInfo {
  upiId: string
  bankName: string
  paymentMethods: string
  qrCodeUrl?: string
}

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string
  location: string
  message: string
  status: "new" | "read" | "replied" | "archived"
  createdAt: string
  readAt?: string
  repliedAt?: string
}

interface ContactPageData {
  headerTitle: string
  headerDescription: string
  formTitle: string
  contactTitle: string
  whyContactTitle: string
  whyContactDescription: string
  whyContactItems: Array<{
    icon: string
    title: string
    description: string
  }>
  donationTitle: string
  contactInfo: ContactInfoItem[]
  donationInfo: DonationInfo
}

export default function ContactPageEditor() {
  const [contactData, setContactData] = useState<ContactPageData>({
    headerTitle: "Get In Touch",
    headerDescription: "Have questions or want to collaborate with us? Fill out the enquiry form below and we'll get back to you shortly. Your inquiry will be sent directly to our team.",
    formTitle: "Send us an Enquiry",
    contactTitle: "Contact Information",
    whyContactTitle: "Why Get In Touch?",
    whyContactDescription: "Multiple reasons to connect with Aapka Sahyog Foundation",
    whyContactItems: [
      {
        icon: "Users",
        title: "Join as Volunteer",
        description: "Contribute your time and skills to support our community initiatives and programs."
      },
      {
        icon: "Mail",
        title: "Partnership Inquiry",
        description: "Interested in collaborating with us? We welcome partnerships with organizations and businesses."
      },
      {
        icon: "Phone",
        title: "General Support",
        description: "Have questions about our programs or need assistance? Our team is here to help."
      }
    ],
    donationTitle: "Donation & Financial Support",
    contactInfo: [
      {
        id: "phone",
        icon: "Phone",
        title: "Phone",
        details: ["+91 99997 67640", "Mobile/WhatsApp Available"],
        order: 0,
        active: true
      },
      {
        id: "email",
        icon: "Mail",
        title: "Email",
        details: ["info@aapkasahyog.org", "For general inquiries"],
        order: 1,
        active: true
      },
      {
        id: "location",
        icon: "MapPin",
        title: "Location",
        details: ["Jewar, Uttar Pradesh", "India"],
        order: 2,
        active: true
      },
      {
        id: "helpdesk",
        icon: "Clock",
        title: "Helpdesk Hours",
        details: ["18001800", "18002021"],
        order: 3,
        active: true
      }
    ],
    donationInfo: {
      upiId: "9999767640m@pnb",
      bankName: "Punjab National Bank (PNB)",
      paymentMethods: "Online, UPI, Cheque, Draft, Mobile Wallets"
    }
  })

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"content" | "enquiries">("content")
  const [editingContactInfo, setEditingContactInfo] = useState<ContactInfoItem | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [newContactInfo, setNewContactInfo] = useState<ContactInfoItem>({
    id: "",
    icon: "Phone",
    title: "",
    details: [""],
    order: 0,
    active: true
  })

  // Load data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load contact page data
        const contactDoc = await getDoc(doc(db, "contactPage", "data"))
        if (contactDoc.exists()) {
          setContactData(contactDoc.data() as ContactPageData)
        }
      } catch (err: any) {
        console.error("Error loading contact data:", err)
        setError("Failed to load contact page data")
      }
    }

    loadData()
  }, [])

  // Real-time enquiries listener
  useEffect(() => {
    const q = query(collection(db, "contactEnquiries"), orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const enquiriesData: Enquiry[] = []
      snapshot.forEach((doc) => {
        enquiriesData.push({
          id: doc.id,
          ...doc.data()
        } as Enquiry)
      })
      setEnquiries(enquiriesData)
      setLoading(false)
    }, (error) => {
      console.error("Error loading enquiries:", error)
      setError("Failed to load enquiries")
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const saveContactData = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await setDoc(doc(db, "contactPage", "data"), contactData, { merge: true })
      setSuccess("Contact page data saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to save data: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const updateEnquiryStatus = async (enquiryId: string, status: Enquiry["status"]) => {
    try {
      const updateData: any = { status }
      
      if (status === "read" && !enquiries.find(e => e.id === enquiryId)?.readAt) {
        updateData.readAt = new Date().toISOString()
      }
      
      if (status === "replied") {
        updateData.repliedAt = new Date().toISOString()
      }

      await setDoc(doc(db, "contactEnquiries", enquiryId), updateData, { merge: true })
      setSuccess(`Enquiry marked as ${status}`)
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to update enquiry: ${err.message}`)
    }
  }

  const deleteEnquiry = async (enquiryId: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return

    try {
      await deleteDoc(doc(db, "contactEnquiries", enquiryId))
      setSuccess("Enquiry deleted successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to delete enquiry: ${err.message}`)
    }
  }

  const addContactInfo = async () => {
    if (!newContactInfo.title.trim() || newContactInfo.details.length === 0) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const newId = `custom_${Date.now()}`
      const newItem = {
        ...newContactInfo,
        id: newId,
        order: contactData.contactInfo.length
      }

      const updatedContactInfo = [...contactData.contactInfo, newItem]
      await setDoc(doc(db, "contactPage", "data"), {
        ...contactData,
        contactInfo: updatedContactInfo
      }, { merge: true })

      setContactData(prev => ({ ...prev, contactInfo: updatedContactInfo }))
      setShowContactForm(false)
      setNewContactInfo({
        id: "",
        icon: "Phone",
        title: "",
        details: [""],
        order: 0,
        active: true
      })
      setSuccess("Contact info added successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to add contact info: ${err.message}`)
    }
  }

  const updateContactInfo = async () => {
    if (!editingContactInfo) return

    try {
      const updatedContactInfo = contactData.contactInfo.map(item =>
        item.id === editingContactInfo.id ? editingContactInfo : item
      )

      await setDoc(doc(db, "contactPage", "data"), {
        ...contactData,
        contactInfo: updatedContactInfo
      }, { merge: true })

      setContactData(prev => ({ ...prev, contactInfo: updatedContactInfo }))
      setEditingContactInfo(null)
      setSuccess("Contact info updated successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to update contact info: ${err.message}`)
    }
  }

  const deleteContactInfo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact information?")) return

    try {
      const updatedContactInfo = contactData.contactInfo.filter(item => item.id !== id)
      
      await setDoc(doc(db, "contactPage", "data"), {
        ...contactData,
        contactInfo: updatedContactInfo
      }, { merge: true })

      setContactData(prev => ({ ...prev, contactInfo: updatedContactInfo }))
      setSuccess("Contact info deleted successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to delete contact info: ${err.message}`)
    }
  }

  const exportEnquiries = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Location", "Message", "Status", "Date"],
      ...enquiries.map(e => [
        e.name,
        e.email,
        e.phone,
        e.location,
        e.message.replace(/,/g, ";"),
        e.status,
        new Date(e.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: Enquiry["status"]) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800"
      case "read": return "bg-yellow-100 text-yellow-800"
      case "replied": return "bg-green-100 text-green-800"
      case "archived": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Phone": return Phone
      case "Mail": return Mail
      case "MapPin": return MapPin
      case "Clock": return Clock
      case "Users": return Users
      case "Globe": return Globe
      case "Building2": return Building2
      default: return Phone
    }
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("content")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "content"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Page Content
            </div>
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "enquiries"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Enquiries
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {enquiries.filter(e => e.status === "new").length}
              </span>
            </div>
          </button>
        </nav>
      </div>

      {/* CONTENT TAB */}
      {activeTab === "content" && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Header Section</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
                <input
                  type="text"
                  value={contactData.headerTitle}
                  onChange={(e) => setContactData({...contactData, headerTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Page title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={contactData.headerDescription}
                  onChange={(e) => setContactData({...contactData, headerDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  rows={3}
                  placeholder="Page description"
                />
              </div>
            </div>
          </div>

          {/* Form & Contact Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Form Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Form Title *</label>
                  <input
                    type="text"
                    value={contactData.formTitle}
                    onChange={(e) => setContactData({...contactData, formTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Form title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info Title *</label>
                  <input
                    type="text"
                    value={contactData.contactTitle}
                    onChange={(e) => setContactData({...contactData, contactTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Contact information title"
                  />
                </div>
              </div>
            </div>

            {/* Why Contact Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">"Why Contact" Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                  <input
                    type="text"
                    value={contactData.whyContactTitle}
                    onChange={(e) => setContactData({...contactData, whyContactTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Description *</label>
                  <input
                    type="text"
                    value={contactData.whyContactDescription}
                    onChange={(e) => setContactData({...contactData, whyContactDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
              <button
                onClick={() => setShowContactForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Users size={16} />
                Add New
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactData.contactInfo.map((info) => {
                const Icon = getIconComponent(info.icon)
                return (
                  <div key={info.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-gray-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{info.title}</h3>
                          <div className="space-y-1 mt-1">
                            {info.details.map((detail, idx) => (
                              <p key={idx} className="text-sm text-gray-600">{detail}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingContactInfo(info)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteContactInfo(info.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Donation Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  value={contactData.donationTitle}
                  onChange={(e) => setContactData({...contactData, donationTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID *</label>
                <input
                  type="text"
                  value={contactData.donationInfo.upiId}
                  onChange={(e) => setContactData({
                    ...contactData,
                    donationInfo: {...contactData.donationInfo, upiId: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
                <input
                  type="text"
                  value={contactData.donationInfo.bankName}
                  onChange={(e) => setContactData({
                    ...contactData,
                    donationInfo: {...contactData.donationInfo, bankName: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Methods *</label>
                <input
                  type="text"
                  value={contactData.donationInfo.paymentMethods}
                  onChange={(e) => setContactData({
                    ...contactData,
                    donationInfo: {...contactData.donationInfo, paymentMethods: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveContactData}
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
      )}

      {/* ENQUIRIES TAB */}
      {activeTab === "enquiries" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{enquiries.length}</p>
                  <p className="text-sm text-gray-600">Total Enquiries</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enquiries.filter(e => e.status === "replied").length}
                  </p>
                  <p className="text-sm text-gray-600">Replied</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <EyeOff className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enquiries.filter(e => e.status === "read").length}
                  </p>
                  <p className="text-sm text-gray-600">Read</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {enquiries.filter(e => e.status === "new").length}
                  </p>
                  <p className="text-sm text-gray-600">New</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiries Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Enquiries</h2>
              <button
                onClick={exportEnquiries}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading enquiries...</p>
              </div>
            ) : enquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="mx-auto mb-2 text-gray-400" size={32} />
                <p>No enquiries yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Location</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Message</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {enquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <span className="font-medium">{enquiry.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail size={12} />
                              {enquiry.email}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone size={12} />
                              {enquiry.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin size={12} />
                            {enquiry.location}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-600 line-clamp-2">{enquiry.message}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                            {enquiry.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                            <div className="text-xs text-gray-500">
                              {new Date(enquiry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {enquiry.status === "new" && (
                              <button
                                onClick={() => updateEnquiryStatus(enquiry.id, "read")}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg hover:bg-blue-200"
                              >
                                Mark Read
                              </button>
                            )}
                            {enquiry.status !== "replied" && (
                              <button
                                onClick={() => updateEnquiryStatus(enquiry.id, "replied")}
                                className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-lg hover:bg-green-200"
                              >
                                Mark Replied
                              </button>
                            )}
                            <button
                              onClick={() => updateEnquiryStatus(enquiry.id, "archived")}
                              className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-lg hover:bg-gray-200"
                            >
                              Archive
                            </button>
                            <button
                              onClick={() => deleteEnquiry(enquiry.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Contact Info Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add Contact Information</h2>
                <button onClick={() => setShowContactForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={newContactInfo.title}
                    onChange={(e) => setNewContactInfo({...newContactInfo, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Office Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={newContactInfo.icon}
                    onChange={(e) => setNewContactInfo({...newContactInfo, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="Phone">Phone</option>
                    <option value="Mail">Email</option>
                    <option value="MapPin">Location</option>
                    <option value="Clock">Clock</option>
                    <option value="Users">Users</option>
                    <option value="Globe">Globe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details *</label>
                  {newContactInfo.details.map((detail, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => {
                          const newDetails = [...newContactInfo.details]
                          newDetails[index] = e.target.value
                          setNewContactInfo({...newContactInfo, details: newDetails})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Detail line"
                      />
                      <button
                        onClick={() => {
                          const newDetails = newContactInfo.details.filter((_, i) => i !== index)
                          setNewContactInfo({...newContactInfo, details: newDetails})
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setNewContactInfo({
                      ...newContactInfo,
                      details: [...newContactInfo.details, ""]
                    })}
                    className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Add Detail Line
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowContactForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addContactInfo}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add Contact Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Info Modal */}
      {editingContactInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Contact Information</h2>
                <button onClick={() => setEditingContactInfo(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={editingContactInfo.title}
                    onChange={(e) => setEditingContactInfo({...editingContactInfo, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={editingContactInfo.icon}
                    onChange={(e) => setEditingContactInfo({...editingContactInfo, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="Phone">Phone</option>
                    <option value="Mail">Email</option>
                    <option value="MapPin">Location</option>
                    <option value="Clock">Clock</option>
                    <option value="Users">Users</option>
                    <option value="Globe">Globe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details *</label>
                  {editingContactInfo.details.map((detail, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={detail}
                        onChange={(e) => {
                          const newDetails = [...editingContactInfo.details]
                          newDetails[index] = e.target.value
                          setEditingContactInfo({...editingContactInfo, details: newDetails})
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      {editingContactInfo.details.length > 1 && (
                        <button
                          onClick={() => {
                            const newDetails = editingContactInfo.details.filter((_, i) => i !== index)
                            setEditingContactInfo({...editingContactInfo, details: newDetails})
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setEditingContactInfo({
                      ...editingContactInfo,
                      details: [...editingContactInfo.details, ""]
                    })}
                    className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Add Detail Line
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingContactInfo(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateContactInfo}
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