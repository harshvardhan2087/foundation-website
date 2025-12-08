"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle, Download } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function About() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const values = [
    "Community Empowerment",
    "Environmental Sustainability",
    "Social Equality",
    "Transparent Operations",
    "Impact-Driven Approach",
    "Inclusive Development",
  ]

  const governance = [
    {
      title: "Leadership",
      description: "Experienced team dedicated to social impact and community welfare with diverse expertise",
    },
    {
      title: "Transparency",
      description:
        "All operations are conducted with full transparency, accountability, and adherence to regulatory standards",
    },
    {
      title: "Accountability",
      description: "Regular reporting and audits ensure proper utilization of resources and funds",
    },
    {
      title: "Partnerships",
      description: "Collaborations with government bodies, NGOs, and corporate sectors for greater impact",
    },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="w-full bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-fade-in rounded-lg overflow-hidden h-48 sm:h-64 md:h-80">
              <Image
                src="/images/banner.png"
                alt="Aapka Sahyog Foundation Banner"
                width={1200}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div
            className={`space-y-6 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold">About Aapka Sahyog Foundation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              We are a registered non-profit organization dedicated to creating sustainable social impact and community
              development across India.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="bg-secondary border border-border rounded-lg p-8 md:p-12 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">Foundation Documentation</h3>
                <p className="text-muted-foreground max-w-xl">
                  Download our detailed annual report, programs overview, and registration documents
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <a
                  href="/documents/laws.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-muted-foreground transition-colors duration-200"
                >
                  <Download size={18} />
                  Our ByLaws
                </a>
                {/* <a
                  href="/documents/ASF-Programs-Overview.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-foreground text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors duration-200"
                >
                  <Download size={18} />
                  Programs Overview
                </a> */}
              </div>
            </div>
          </div>
        </section>

        {/* Logo and Registration */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <img src="/images/asf-logo.png" alt="Aapka Sahyog Foundation Logo" className="w-full max-w-sm h-auto" />
            </div>
            <div className="animate-slide-in-right space-y-6">
              <h2 className="text-3xl font-bold">Our Foundation</h2>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Aapka Sahyog Foundation (ASF) is committed to bridging the gap between privileged and underprivileged
                  sections of society through targeted interventions in education, health, environment, and livelihood.
                </p>
                <div className="bg-secondary p-8 rounded-lg space-y-4 border border-border">
                  <div>
                    <p className="font-bold text-lg mb-2">Registration Details</p>
                    <p className="text-muted-foreground">Regd. No. 49/2025/Jewar</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Payment Methods</p>
                    <p className="text-muted-foreground">UPI: 9999767640m@pnb</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Helpdesk</p>
                    <p className="text-muted-foreground">18001800 / 18002021</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-fade-in-up p-8 border border-border rounded-lg hover:shadow-lg transition-all">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To create a sustainable, equitable society by empowering individuals and communities through education,
                skill development, environmental protection, and social welfare initiatives that promote dignity and
                self-reliance.
              </p>
            </div>
            <div
              className="animate-fade-in-up p-8 border border-border rounded-lg hover:shadow-lg transition-all"
              style={{ animationDelay: "100ms" }}
            >
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where every individual has access to quality education, healthcare, and livelihood
                opportunities, living in harmony with nature and contributing meaningfully to society regardless of
                their socio-economic background.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-muted-foreground">Guiding principles that shape our work and impact</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up flex items-center gap-3 p-6 border border-border rounded-lg hover:border-foreground transition-colors duration-300"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CheckCircle size={24} className="flex-shrink-0" />
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-secondary rounded-lg">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Governance & Structure</h2>
              <p className="text-muted-foreground">How we operate and maintain our commitment to communities</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {governance.map((item, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up p-8 bg-background border border-border rounded-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-foreground text-background rounded-lg p-12 md:p-16 space-y-6 animate-scale-in">
            <h2 className="text-3xl font-bold">Join Our Movement</h2>
            <p className="text-lg opacity-90 max-w-2xl">
              Be part of a dedicated team working towards social transformation and community empowerment across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-background text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors">
                Volunteer With Us
              </button>
              <button className="px-6 py-3 border border-background text-background rounded-lg font-semibold hover:bg-background/10 transition-colors">
                Partner With Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
