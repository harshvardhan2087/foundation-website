"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"

export default function OurWork() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const programs = [
    {
      category: "Education & Skill Development",
      items: [
        "Training centers for poultry, fishery, and agro-industries",
        "Vocational skill development for youth employment",
        '"Backward Classes" training programs',
        "Research and technology transfer to farmers",
        "Semi-skilled job training and placement",
      ],
    },
    {
      category: "Environmental & Agricultural",
      items: [
        "Green revolution and agro-industry promotion",
        "Pollution control and environmental education",
        "Water, air, soil, and atmosphere protection programs",
        "Agricultural technology advancement",
        "Sustainable farming practices",
      ],
    },
    {
      category: "Social Welfare & Health",
      items: [
        "Support for SC/ST/OBC communities",
        "Women empowerment and protection initiatives",
        "Care for handicapped, blind, and deaf persons",
        "Health and sanitation awareness programs",
        "Eye and blood donation camps",
        "Medical advice and health education",
      ],
    },
    {
      category: "Community Development",
      items: [
        "Cottage industries establishment in rural areas",
        "Self-help groups for economic upliftment",
        "Animal and wildlife protection",
        "Community support for economic assistance",
        "Rural development initiatives",
      ],
    },
  ]

  const outcomes = [
    { metric: "100+", label: "Training Programs", detail: "Annually conducted" },
    { metric: "5000+", label: "Youth Trained", detail: "In various skills" },
    { metric: "50+", label: "Villages Reached", detail: "With initiatives" },
    { metric: "10000+", label: "People Benefited", detail: "Through programs" },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div
            className={`space-y-6 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold">Our Work & Programs</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Comprehensive initiatives across multiple sectors creating meaningful impact in communities.
            </p>
          </div>
        </section>

        {/* Work Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-16">
            {programs.map((program, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{program.category}</h2>
                  <div className="w-12 h-1 bg-foreground rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {program.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="p-6 border border-border rounded-lg hover:border-foreground hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Outcomes</h2>
              <p className="text-muted-foreground">Measurable results from our initiatives</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {outcomes.map((outcome, index) => (
                <div
                  key={index}
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
              <h2 className="text-3xl font-bold mb-4">Our Reach & Impact</h2>
              <p className="opacity-90 max-w-2xl">
                Working across multiple states to create sustainable change in education, health, environment, and
                livelihood sectors.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="animate-fade-in-up space-y-4">
                <h3 className="text-xl font-bold">Geographic Reach</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full"></span>
                    Uttar Pradesh (Primary focus)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full"></span>
                    Multiple rural and urban communities
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full"></span>
                    Expanding national presence
                  </li>
                </ul>
              </div>
              <div className="animate-fade-in-up space-y-4" style={{ animationDelay: "100ms" }}>
                <h3 className="text-xl font-bold">Sustainable Development Goals</h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full"></span>
                    Quality Education (SDG 4)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full"></span>
                    Good Health & Wellness (SDG 3)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-background rounded-full"></span>
                    Clean Energy & Environment (SDG 7, 13)
                  </li>
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
