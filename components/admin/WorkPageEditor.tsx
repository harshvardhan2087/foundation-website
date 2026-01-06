"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
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
import { 
  BookOpen,
  Users,
  TrendingUp,
  MapPin,
  Target,
  Globe,
  Leaf,
  Heart,
  Building2,
  GraduationCap,
  TreePine,
  Activity,
  Edit,
  Trash2,
  Save,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  BarChart,
  TargetIcon,
  MoveUp,
  MoveDown,
  Hash
} from "lucide-react"

interface ProgramItem {
  id: string
  text: string
  order: number
  active: boolean
  categoryId: string
}

interface ProgramCategory {
  id: string
  title: string
  description?: string
  icon: string
  order: number
  active: boolean
  items: string[] // Array of item IDs
}

interface Outcome {
  id: string
  metric: string
  label: string
  detail: string
  order: number
  active: boolean
}

interface ImpactSection {
  geographicReach: string[]
  sdgs: string[]
  description: string
}

interface WorkPageData {
  headerTitle: string
  headerDescription: string
  outcomesTitle: string
  outcomesDescription: string
  impactTitle: string
  impactDescription: string
  categories: ProgramCategory[]
  outcomes: Outcome[]
  impact: ImpactSection
}

export default function WorkPageEditor() {
  const [workData, setWorkData] = useState<WorkPageData>({
    headerTitle: "Our Work & Programs",
    headerDescription: "Comprehensive initiatives across multiple sectors creating meaningful impact in communities.",
    outcomesTitle: "Program Outcomes",
    outcomesDescription: "Measurable results from our initiatives",
    impactTitle: "Our Reach & Impact",
    impactDescription: "Working across multiple states to create sustainable change in education, health, environment, and livelihood sectors.",
    categories: [
      {
        id: "education",
        title: "Education & Skill Development",
        icon: "GraduationCap",
        order: 0,
        active: true,
        items: []
      },
      {
        id: "environment",
        title: "Environmental & Agricultural",
        icon: "Leaf",
        order: 1,
        active: true,
        items: []
      },
      {
        id: "social",
        title: "Social Welfare & Health",
        icon: "Heart",
        order: 2,
        active: true,
        items: []
      },
      {
        id: "community",
        title: "Community Development",
        icon: "Users",
        order: 3,
        active: true,
        items: []
      }
    ],
    outcomes: [
      {
        id: "programs",
        metric: "100+",
        label: "Training Programs",
        detail: "Annually conducted",
        order: 0,
        active: true
      },
      {
        id: "youth",
        metric: "5000+",
        label: "Youth Trained",
        detail: "In various skills",
        order: 1,
        active: true
      },
      {
        id: "villages",
        metric: "50+",
        label: "Villages Reached",
        detail: "With initiatives",
        order: 2,
        active: true
      },
      {
        id: "people",
        metric: "10000+",
        label: "People Benefited",
        detail: "Through programs",
        order: 3,
        active: true
      }
    ],
    impact: {
      description: "Working across multiple states to create sustainable change in education, health, environment, and livelihood sectors.",
      geographicReach: [
        "Uttar Pradesh (Primary focus)",
        "Multiple rural and urban communities",
        "Expanding national presence"
      ],
      sdgs: [
        "Quality Education (SDG 4)",
        "Good Health & Wellness (SDG 3)",
        "Clean Energy & Environment (SDG 7, 13)"
      ]
    }
  })

  const [programItems, setProgramItems] = useState<ProgramItem[]>([])
  const [editingCategory, setEditingCategory] = useState<ProgramCategory | null>(null)
  const [editingOutcome, setEditingOutcome] = useState<Outcome | null>(null)
  const [editingItem, setEditingItem] = useState<ProgramItem | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [showItemForm, setShowItemForm] = useState(false)
  const [showOutcomeForm, setShowOutcomeForm] = useState(false)
  const [newCategory, setNewCategory] = useState<ProgramCategory>({
    id: "",
    title: "",
    icon: "GraduationCap",
    order: 0,
    active: true,
    items: []
  })
  const [newItem, setNewItem] = useState<ProgramItem>({
    id: "",
    text: "",
    order: 0,
    active: true,
    categoryId: ""
  })
  const [newOutcome, setNewOutcome] = useState<Outcome>({
    id: "",
    metric: "",
    label: "",
    detail: "",
    order: 0,
    active: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"categories" | "items" | "outcomes" | "impact">("categories")

  // Load data from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load work page data
        const workDoc = await getDoc(doc(db, "workPage", "data"))
        if (workDoc.exists()) {
          setWorkData(workDoc.data() as WorkPageData)
        }
        
        // Load program items
        const itemsQuery = query(collection(db, "programItems"), orderBy("order"))
        const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
          const itemsData: ProgramItem[] = []
          snapshot.forEach((doc) => {
            itemsData.push({
              id: doc.id,
              ...doc.data()
            } as ProgramItem)
          })
          setProgramItems(itemsData)
          setLoading(false)
        }, (error) => {
          console.error("Error loading program items:", error)
          setLoading(false)
        })
        
        return () => unsubscribe()
      } catch (err: any) {
        console.error("Error loading work data:", err)
        setError("Failed to load work page data")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const saveWorkData = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await setDoc(doc(db, "workPage", "data"), workData, { merge: true })
      setSuccess("Work page data saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to save data: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const saveImpactData = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await setDoc(doc(db, "workPage", "data"), {
        ...workData,
        impact: workData.impact
      }, { merge: true })
      setSuccess("Impact data saved successfully!")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(`Failed to save impact data: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const addCategory = async () => {
    if (!newCategory.title.trim()) {
      setError("Please enter category title")
      return
    }

    try {
      const newId = `category_${Date.now()}`
      const category = {
        ...newCategory,
        id: newId,
        order: workData.categories.length
      }

      const updatedCategories = [...workData.categories, category]
      await setDoc(doc(db, "workPage", "data"), {
        ...workData,
        categories: updatedCategories
      }, { merge: true })

      setWorkData(prev => ({ ...prev, categories: updatedCategories }))
      setShowCategoryForm(false)
      setNewCategory({
        id: "",
        title: "",
        icon: "GraduationCap",
        order: 0,
        active: true,
        items: []
      })
      setSuccess("Category added successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to add category: ${err.message}`)
    }
  }

  const updateCategory = async () => {
    if (!editingCategory) return

    try {
      const updatedCategories = workData.categories.map(cat =>
        cat.id === editingCategory.id ? editingCategory : cat
      )

      await setDoc(doc(db, "workPage", "data"), {
        ...workData,
        categories: updatedCategories
      }, { merge: true })

      setWorkData(prev => ({ ...prev, categories: updatedCategories }))
      setEditingCategory(null)
      setSuccess("Category updated successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to update category: ${err.message}`)
    }
  }

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All items in this category will also be deleted.")) return

    try {
      // Delete all items in this category
      const itemsToDelete = programItems.filter(item => item.categoryId === id)
      await Promise.all(
        itemsToDelete.map(item => deleteDoc(doc(db, "programItems", item.id)))
      )

      const updatedCategories = workData.categories.filter(cat => cat.id !== id)
      await setDoc(doc(db, "workPage", "data"), {
        ...workData,
        categories: updatedCategories
      }, { merge: true })

      setWorkData(prev => ({ ...prev, categories: updatedCategories }))
      setSuccess("Category deleted successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to delete category: ${err.message}`)
    }
  }

  const addItem = async () => {
    if (!newItem.text.trim() || !newItem.categoryId) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const itemData = {
        text: newItem.text.trim(),
        order: programItems.filter(item => item.categoryId === newItem.categoryId).length,
        active: true,
        categoryId: newItem.categoryId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(collection(db, "programItems"), itemData)
      
      // Update category with this item reference
      const category = workData.categories.find(cat => cat.id === newItem.categoryId)
      if (category) {
        const updatedCategories = workData.categories.map(cat =>
          cat.id === category.id
            ? { ...cat, items: [...cat.items, docRef.id] }
            : cat
        )
        
        await setDoc(doc(db, "workPage", "data"), {
          ...workData,
          categories: updatedCategories
        }, { merge: true })
        
        setWorkData(prev => ({ ...prev, categories: updatedCategories }))
      }

      setShowItemForm(false)
      setNewItem({
        id: "",
        text: "",
        order: 0,
        active: true,
        categoryId: ""
      })
      setSuccess("Program item added successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to add item: ${err.message}`)
    }
  }

  const updateItem = async () => {
    if (!editingItem) return

    try {
      await updateDoc(doc(db, "programItems", editingItem.id), {
        text: editingItem.text.trim(),
        active: editingItem.active,
        updatedAt: serverTimestamp()
      })

      setEditingItem(null)
      setSuccess("Program item updated successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to update item: ${err.message}`)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      // Remove item reference from category
      const item = programItems.find(item => item.id === id)
      if (item) {
        const category = workData.categories.find(cat => cat.id === item.categoryId)
        if (category) {
          const updatedCategories = workData.categories.map(cat =>
            cat.id === category.id
              ? { ...cat, items: cat.items.filter(itemId => itemId !== id) }
              : cat
          )
          
          await setDoc(doc(db, "workPage", "data"), {
            ...workData,
            categories: updatedCategories
          }, { merge: true })
          
          setWorkData(prev => ({ ...prev, categories: updatedCategories }))
        }
      }

      await deleteDoc(doc(db, "programItems", id))
      setSuccess("Program item deleted successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to delete item: ${err.message}`)
    }
  }

  const addOutcome = async () => {
    if (!newOutcome.metric.trim() || !newOutcome.label.trim()) {
      setError("Please fill in all required fields")
      return
    }

    try {
      const newId = `outcome_${Date.now()}`
      const outcome = {
        ...newOutcome,
        id: newId,
        order: workData.outcomes.length
      }

      const updatedOutcomes = [...workData.outcomes, outcome]
      await setDoc(doc(db, "workPage", "data"), {
        ...workData,
        outcomes: updatedOutcomes
      }, { merge: true })

      setWorkData(prev => ({ ...prev, outcomes: updatedOutcomes }))
      setShowOutcomeForm(false)
      setNewOutcome({
        id: "",
        metric: "",
        label: "",
        detail: "",
        order: 0,
        active: true
      })
      setSuccess("Outcome added successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to add outcome: ${err.message}`)
    }
  }

  const updateOutcome = async () => {
    if (!editingOutcome) return

    try {
      const updatedOutcomes = workData.outcomes.map(outcome =>
        outcome.id === editingOutcome.id ? editingOutcome : outcome
      )

      await setDoc(doc(db, "workPage", "data"), {
        ...workData,
        outcomes: updatedOutcomes
      }, { merge: true })

      setWorkData(prev => ({ ...prev, outcomes: updatedOutcomes }))
      setEditingOutcome(null)
      setSuccess("Outcome updated successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to update outcome: ${err.message}`)
    }
  }

  const deleteOutcome = async (id: string) => {
    if (!confirm("Are you sure you want to delete this outcome?")) return

    try {
      const updatedOutcomes = workData.outcomes.filter(outcome => outcome.id !== id)
      await setDoc(doc(db, "workPage", "data"), {
        ...workData,
        outcomes: updatedOutcomes
      }, { merge: true })

      setWorkData(prev => ({ ...prev, outcomes: updatedOutcomes }))
      setSuccess("Outcome deleted successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to delete outcome: ${err.message}`)
    }
  }

  const handleReorder = async (array: any[], index: number, direction: "up" | "down", type: "categories" | "outcomes" | "items") => {
    const newArray = [...array]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newArray.length) return

    const tempOrder = newArray[index].order
    newArray[index].order = newArray[targetIndex].order
    newArray[targetIndex].order = tempOrder

    try {
      if (type === "categories") {
        await setDoc(doc(db, "workPage", "data"), {
          ...workData,
          categories: newArray
        }, { merge: true })
        setWorkData(prev => ({ ...prev, categories: newArray }))
      } else if (type === "outcomes") {
        await setDoc(doc(db, "workPage", "data"), {
          ...workData,
          outcomes: newArray
        }, { merge: true })
        setWorkData(prev => ({ ...prev, outcomes: newArray }))
      }
      setSuccess("Order updated successfully!")
      setTimeout(() => setSuccess(null), 2000)
    } catch (err: any) {
      setError(`Failed to update order: ${err.message}`)
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap": return GraduationCap
      case "Leaf": return Leaf
      case "Heart": return Heart
      case "Users": return Users
      case "BookOpen": return BookOpen
      case "TreePine": return TreePine
      case "Activity": return Activity
      case "Globe": return Globe
      case "TargetIcon": return TargetIcon
      case "BarChart": return BarChart
      default: return GraduationCap
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
          <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
          <p className="text-green-700 flex-1">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-2 p-1 text-green-500 hover:text-green-700">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Page Header</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title *</label>
            <input
              type="text"
              value={workData.headerTitle}
              onChange={(e) => setWorkData({...workData, headerTitle: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Page title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={workData.headerDescription}
              onChange={(e) => setWorkData({...workData, headerDescription: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              rows={3}
              placeholder="Page description"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("categories")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "categories"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Program Categories
            </div>
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "items"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Program Items
              <span className="bg-gray-100 text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {programItems.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("outcomes")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "outcomes"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Outcomes
            </div>
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "impact"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Impact Section
            </div>
          </button>
        </nav>
      </div>

      {/* CATEGORIES TAB */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Program Categories</h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Category
              </button>
            </div>

            <div className="space-y-4">
              {workData.categories
                .sort((a, b) => a.order - b.order)
                .map((category, index) => {
                  const Icon = getIconComponent(category.icon)
                  const itemCount = programItems.filter(item => item.categoryId === category.id).length
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Icon size={24} className="text-gray-600 mt-1" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{category.title}</h3>
                            {category.description && (
                              <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {itemCount} items
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${category.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {category.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReorder(workData.categories, index, "up", "categories")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === 0}
                            title="Move up"
                          >
                            <MoveUp size={16} />
                          </button>
                          <button
                            onClick={() => handleReorder(workData.categories, index, "down", "categories")}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === workData.categories.length - 1}
                            title="Move down"
                          >
                            <MoveDown size={16} />
                          </button>
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
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
        </div>
      )}

      {/* ITEMS TAB */}
      {activeTab === "items" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Program Items</h2>
              <button
                onClick={() => setShowItemForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>

            {/* Filter by category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("items")}
                  className="px-3 py-1 bg-black text-white rounded-lg text-sm"
                >
                  All Items ({programItems.length})
                </button>
                {workData.categories.map(category => {
                  const count = programItems.filter(item => item.categoryId === category.id).length
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab("items")}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      {category.title} ({count})
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              {workData.categories.map(category => {
                const categoryItems = programItems
                  .filter(item => item.categoryId === category.id)
                  .sort((a, b) => a.order - b.order)
                
                if (categoryItems.length === 0) return null

                return (
                  <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                      <h3 className="font-semibold text-gray-900">{category.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {categoryItems.length} items
                      </span>
                    </div>
                    
                    <div className="space-y-3 ml-4">
                      {categoryItems.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <p className="text-gray-700">{item.text}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {programItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="mx-auto mb-2 text-gray-400" size={32} />
                  <p>No program items yet. Add your first item above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OUTCOMES TAB */}
      {activeTab === "outcomes" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Outcomes Section</h2>
                <p className="text-sm text-gray-600 mt-1">Statistics that appear on the page</p>
              </div>
              <button
                onClick={() => setShowOutcomeForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Outcome
              </button>
            </div>

            {/* Outcomes Section Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                <input
                  type="text"
                  value={workData.outcomesTitle}
                  onChange={(e) => setWorkData({...workData, outcomesTitle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Description *</label>
                <input
                  type="text"
                  value={workData.outcomesDescription}
                  onChange={(e) => setWorkData({...workData, outcomesDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Outcomes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {workData.outcomes
                .sort((a, b) => a.order - b.order)
                .map((outcome, index) => (
                  <div key={outcome.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{outcome.label}</h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(workData.outcomes, index, "up", "outcomes")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === 0}
                          title="Move up"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleReorder(workData.outcomes, index, "down", "outcomes")}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                          disabled={index === workData.outcomes.length - 1}
                          title="Move down"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{outcome.metric}</div>
                    <p className="text-sm text-gray-600 mb-4">{outcome.detail}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingOutcome(outcome)}
                        className="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOutcome(outcome.id)}
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

      {/* IMPACT TAB */}
      {activeTab === "impact" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Impact Section</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Section Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title *</label>
                  <input
                    type="text"
                    value={workData.impactTitle}
                    onChange={(e) => setWorkData({...workData, impactTitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Description *</label>
                  <textarea
                    value={workData.impactDescription}
                    onChange={(e) => setWorkData({...workData, impactDescription: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              {/* Geographic Reach */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Geographic Reach</label>
                <div className="space-y-2">
                  {workData.impact.geographicReach.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newReach = [...workData.impact.geographicReach]
                          newReach[index] = e.target.value
                          setWorkData({
                            ...workData,
                            impact: { ...workData.impact, geographicReach: newReach }
                          })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const newReach = workData.impact.geographicReach.filter((_, i) => i !== index)
                          setWorkData({
                            ...workData,
                            impact: { ...workData.impact, geographicReach: newReach }
                          })
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setWorkData({
                        ...workData,
                        impact: {
                          ...workData.impact,
                          geographicReach: [...workData.impact.geographicReach, ""]
                        }
                      })
                    }}
                    className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Add Geographic Item
                  </button>
                </div>
              </div>

              {/* SDGs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sustainable Development Goals</label>
                <div className="space-y-2">
                  {workData.impact.sdgs.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black rounded-full flex-shrink-0"></div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newSdgs = [...workData.impact.sdgs]
                          newSdgs[index] = e.target.value
                          setWorkData({
                            ...workData,
                            impact: { ...workData.impact, sdgs: newSdgs }
                          })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                      <button
                        onClick={() => {
                          const newSdgs = workData.impact.sdgs.filter((_, i) => i !== index)
                          setWorkData({
                            ...workData,
                            impact: { ...workData.impact, sdgs: newSdgs }
                          })
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setWorkData({
                        ...workData,
                        impact: {
                          ...workData.impact,
                          sdgs: [...workData.impact.sdgs, ""]
                        }
                      })
                    }}
                    className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Add SDG Item
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveImpactData}
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
                      Save Impact Section
                    </>
                  )}
                </button>
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
            <p className="text-sm text-gray-600">Save all modifications to the work page</p>
          </div>
          <button
            onClick={saveWorkData}
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

      {/* Add Category Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add Category</h2>
                <button onClick={() => setShowCategoryForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
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
                    value={newCategory.title}
                    onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Category title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newCategory.description || ""}
                    onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={2}
                    placeholder="Optional description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="GraduationCap">Education</option>
                    <option value="Leaf">Environment</option>
                    <option value="Heart">Health</option>
                    <option value="Users">Community</option>
                    <option value="BookOpen">General</option>
                    <option value="TreePine">Agriculture</option>
                    <option value="Activity">Activity</option>
                    <option value="Globe">Global</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addCategory}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
                <button onClick={() => setEditingCategory(null)} className="p-2 hover:bg-gray-100 rounded-lg">
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
                    value={editingCategory.title}
                    onChange={(e) => setEditingCategory({...editingCategory, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingCategory.description || ""}
                    onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="GraduationCap">Education</option>
                    <option value="Leaf">Environment</option>
                    <option value="Heart">Health</option>
                    <option value="Users">Community</option>
                    <option value="BookOpen">General</option>
                    <option value="TreePine">Agriculture</option>
                    <option value="Activity">Activity</option>
                    <option value="Globe">Global</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="categoryActive"
                    checked={editingCategory.active}
                    onChange={(e) => setEditingCategory({...editingCategory, active: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="categoryActive" className="text-sm text-gray-700">
                    Active (visible on page)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateCategory}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showItemForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add Program Item</h2>
                <button onClick={() => setShowItemForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({...newItem, categoryId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {workData.categories.map(category => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Text *</label>
                  <textarea
                    value={newItem.text}
                    onChange={(e) => setNewItem({...newItem, text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                    placeholder="Enter program item description"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowItemForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addItem}
                  disabled={!newItem.text.trim() || !newItem.categoryId}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    !newItem.text.trim() || !newItem.categoryId
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Program Item</h2>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editingItem.categoryId}
                    onChange={(e) => setEditingItem({...editingItem, categoryId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    disabled
                  >
                    {workData.categories.map(category => (
                      <option key={category.id} value={category.id}>{category.title}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Category cannot be changed after creation</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Item Text *</label>
                  <textarea
                    value={editingItem.text}
                    onChange={(e) => setEditingItem({...editingItem, text: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="itemActive"
                    checked={editingItem.active}
                    onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="itemActive" className="text-sm text-gray-700">
                    Active (visible on page)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateItem}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Outcome Modal */}
      {showOutcomeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add Outcome</h2>
                <button onClick={() => setShowOutcomeForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metric Value *</label>
                  <input
                    type="text"
                    value={newOutcome.metric}
                    onChange={(e) => setNewOutcome({...newOutcome, metric: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., 100+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                  <input
                    type="text"
                    value={newOutcome.label}
                    onChange={(e) => setNewOutcome({...newOutcome, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Training Programs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detail</label>
                  <input
                    type="text"
                    value={newOutcome.detail}
                    onChange={(e) => setNewOutcome({...newOutcome, detail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="e.g., Annually conducted"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowOutcomeForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addOutcome}
                  disabled={!newOutcome.metric.trim() || !newOutcome.label.trim()}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    !newOutcome.metric.trim() || !newOutcome.label.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  Add Outcome
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Outcome Modal */}
      {editingOutcome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Outcome</h2>
                <button onClick={() => setEditingOutcome(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metric Value *</label>
                  <input
                    type="text"
                    value={editingOutcome.metric}
                    onChange={(e) => setEditingOutcome({...editingOutcome, metric: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                  <input
                    type="text"
                    value={editingOutcome.label}
                    onChange={(e) => setEditingOutcome({...editingOutcome, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detail</label>
                  <input
                    type="text"
                    value={editingOutcome.detail}
                    onChange={(e) => setEditingOutcome({...editingOutcome, detail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="outcomeActive"
                    checked={editingOutcome.active}
                    onChange={(e) => setEditingOutcome({...editingOutcome, active: e.target.checked})}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="outcomeActive" className="text-sm text-gray-700">
                    Active (visible on page)
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setEditingOutcome(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateOutcome}
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