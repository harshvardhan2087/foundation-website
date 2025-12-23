// components/admin/BannerManagement.tsx
"use client"

import { useState, useEffect } from "react"
import { db, storage } from "@/lib/firebase"
import { collection, doc, setDoc, deleteDoc, getDocs, query, orderBy } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { Upload, X, Plus, Save, Trash2, AlertCircle, CheckCircle } from "lucide-react"

interface Banner {
  id: string
  imageUrl: string
  title?: string
  description?: string
  order: number
  active: boolean
  imagePath?: string
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    order: 0,
    active: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadBanners()
  }, [])

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
      setError(`Failed to load banners: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setImageFile(file)
  }

  const uploadImage = async (file: File): Promise<{url: string, path: string}> => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${randomString}_${sanitizedName}`
    const storagePath = `home-banners/${fileName}`
    
    const storageRef = ref(storage, storagePath)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return { url: downloadURL, path: storagePath }
  }

  const handleAddBanner = async () => {
    if (!imageFile) {
      setError("Please select an image for the banner")
      return
    }

    try {
      setUploading(true)
      setError(null)

      // Upload image
      const imageData = await uploadImage(imageFile)

      // Get next order number
      const nextOrder = banners.length > 0 
        ? Math.max(...banners.map(b => b.order)) + 1 
        : 0

      // Create banner document
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

      // Reset form
      setNewBanner({ title: "", description: "", order: 0, active: true })
      setImageFile(null)
      
      // Reload banners
      await loadBanners()
      
      setSuccess("Banner added successfully!")
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
      // Delete image from storage
      if (banner.imagePath) {
        try {
          const imageRef = ref(storage, banner.imagePath)
          await deleteObject(imageRef)
        } catch (err) {
          console.warn("Could not delete image from storage:", err)
        }
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, "homeBanners", banner.id))

      // Update local state
      setBanners(banners.filter(b => b.id !== banner.id))
      
      setSuccess("Banner deleted successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to delete banner: ${err.message}`)
    }
  }

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const newBanners = [...banners]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newBanners.length) return

    // Swap orders
    const tempOrder = newBanners[index].order
    newBanners[index].order = newBanners[targetIndex].order
    newBanners[targetIndex].order = tempOrder

    // Update in Firestore
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

      // Sort and update state
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
    } catch (err: any) {
      setError(`Failed to update banner: ${err.message}`)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading banners...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Home Page Banners</h2>
        <p className="text-gray-600">Manage the banner images displayed on the home page</p>
      </div>

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

      {/* Add New Banner Form */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Banner</h3>
        
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
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    onClick={() => setImageFile(null)}
                    className="p-1 text-red-500 hover:text-red-700"
                    disabled={uploading}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Recommended: High-quality image, 1920x1080px, max 5MB
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleAddBanner}
            disabled={uploading || !imageFile}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              uploading || !imageFile 
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
        </div>
      </div>

      {/* Existing Banners */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Banners ({banners.length})</h3>
        
        {banners.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No banners yet. Add your first banner above.
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div key={banner.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Banner Image */}
                  <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || "Banner"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Banner Details */}
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
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            banner.active 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {banner.active ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Order: {banner.order + 1}</p>
                      <p>Status: {banner.active ? "Visible on home page" : "Hidden"}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() => handleReorder(index, "up")}
                        disabled={index === 0}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg disabled:opacity-30"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => handleReorder(index, "down")}
                        disabled={index === banners.length - 1}
                        className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg disabled:opacity-30"
                        title="Move down"
                      >
                        ↓
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
  )
}