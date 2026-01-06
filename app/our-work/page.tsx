"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, orderBy, onSnapshot } from "firebase/firestore"

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
  items: string[]
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

export default function OurWork() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [workData, setWorkData] = useState<WorkPageData | null>(null)
  const [programItems, setProgramItems] = useState<ProgramItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load work page data
        const workDoc = await getDoc(doc(db, "workPage", "data"))
        if (workDoc.exists()) {
          setWorkData(workDoc.data() as WorkPageData)
        } else {
          // Fallback to default data
          setWorkData({
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
          setIsLoaded(true)
          setLoading(false)
        }, (error) => {
          console.error("Error loading program items:", error)
          setLoading(false)
        })
        
        return () => unsubscribe()
      } catch (error) {
        console.error("Error loading work data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Get items for a specific category
  const getCategoryItems = (categoryId: string) => {
    return programItems
      .filter(item => item.categoryId === categoryId && item.active)
      .sort((a, b) => a.order - b.order)
  }

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap": return ({ className }: { className: string }) => (
        <div className={`w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0 ${className}`}></div>
      )
      case "Leaf": return ({ className }: { className: string }) => (
        <div className={`w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0 ${className}`}></div>
      )
      case "Heart": return ({ className }: { className: string }) => (
        <div className={`w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0 ${className}`}></div>
      )
      case "Users": return ({ className }: { className: string }) => (
        <div className={`w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0 ${className}`}></div>
      )
      default: return ({ className }: { className: string }) => (
        <div className={`w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0 ${className}`}></div>
      )
    }
  }

  if (loading || !workData) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading work page...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div
            className={`space-y-6 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold">{workData.headerTitle}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {workData.headerDescription}
            </p>
          </div>
        </section>

        {/* Work Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-16">
            {workData.categories
              .filter(category => category.active)
              .sort((a, b) => a.order - b.order)
              .map((category, index) => {
                const categoryItems = getCategoryItems(category.id)
                if (categoryItems.length === 0) return null

                return (
                  <div key={category.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="mb-8">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">{category.title}</h2>
                      <div className="w-12 h-1 bg-foreground rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {categoryItems.map((item, itemIndex) => (
                        <div
                          key={item.id}
                          className="p-6 border border-border rounded-lg hover:border-foreground hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-muted-foreground">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        </section>

        {/* Outcomes Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{workData.outcomesTitle}</h2>
              <p className="text-muted-foreground">{workData.outcomesDescription}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workData.outcomes
                .filter(outcome => outcome.active)
                .sort((a, b) => a.order - b.order)
                .map((outcome, index) => (
                  <div
                    key={outcome.id}
                    className="animate-fade-in-up p-8 bg-secondary border border-border rounded-lg text-center"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-4xl font-bold mb-2">{outcome.metric}</div>
                    <p className="font-semibold mb-2">{outcome.label}</p>
                    <p className="text-sm text-muted-foreground">{outcome.detail}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-foreground text-background rounded-lg">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{workData.impactTitle}</h2>
              <p className="opacity-90 max-w-2xl">
                {workData.impactDescription}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="animate-fade-in-up space-y-4">
                <h3 className="text-xl font-bold">Geographic Reach</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  {workData.impact.geographicReach.map((reach, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-background rounded-full"></span>
                      {reach}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="animate-fade-in-up space-y-4" style={{ animationDelay: "100ms" }}>
                <h3 className="text-xl font-bold">Sustainable Development Goals</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  {workData.impact.sdgs.map((sdg, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-background rounded-full"></span>
                      {sdg}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}