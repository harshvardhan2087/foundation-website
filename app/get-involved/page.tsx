"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Heart, Users, BookOpen, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function GetInvolved() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const ways = [
    {
      icon: Heart,
      title: "Make a Donation",
      description:
        "Your financial contribution directly supports our programs and helps us reach more communities in need.",
      details: "UPI: 9999767640m@pnb",
    },
    {
      icon: Users,
      title: "Volunteer with Us",
      description:
        "Join our team as a volunteer and contribute your skills, time, and passion to create meaningful change.",
      details: "Contact us to discuss opportunities",
    },
    {
      icon: BookOpen,
      title: "Sponsor a Program",
      description:
        "Support specific initiatives like training centers, education programs, or health awareness campaigns.",
      details: "Multiple sponsorship options available",
    },
    {
      icon: Zap,
      title: "Partner with Us",
      description:
        "Collaborate with our foundation through corporate partnerships and social responsibility initiatives.",
      details: "Let's work together for social impact",
    },
  ]

  const donationImpact = [
    { amount: "₹500", impact: "Support education for one student for a month" },
    { amount: "₹2,000", impact: "Fund a vocational training program for one person" },
    { amount: "₹5,000", impact: "Organize a health awareness camp for 50 people" },
    { amount: "₹10,000", impact: "Sponsor monthly stipend for a scholarship holder" },
    { amount: "₹25,000", impact: "Setup materials for a training center" },
    { amount: "₹1,00,000+", impact: "Sponsor an entire program or initiative" },
  ]

  const partnershipBenefits = [
    "CSR compliance fulfillment",
    "Brand visibility across platforms",
    "Impact reporting and transparency",
    "Tax benefits (80G exemption)",
    "Community engagement programs",
    "Strategic collaboration opportunities",
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
            <h1 className="text-4xl md:text-5xl font-bold">Get Involved</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              There are multiple ways you can contribute to our mission and help us create lasting social impact.
            </p>
          </div>
        </section>

        {/* Ways to Contribute */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ways.map((way, index) => {
              const Icon = way.icon
              return (
                <div
                  key={index}
                  className="animate-fade-in-up p-8 border border-border rounded-lg hover:border-foreground hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon size={32} className="mb-4" />
                  <h3 className="text-xl font-bold mb-2">{way.title}</h3>
                  <p className="text-muted-foreground mb-4">{way.description}</p>
                  <p className="text-sm font-semibold bg-secondary px-3 py-1 rounded-full inline-block">
                    {way.details}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Donation Impact Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Donation Impact</h2>
              <p className="text-muted-foreground">See how your contribution directly helps communities</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donationImpact.map((item, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up p-6 bg-secondary border border-border rounded-lg"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="text-2xl font-bold mb-2 text-foreground">{item.amount}</div>
                  <p className="text-muted-foreground text-sm">{item.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Donation & Payment Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-foreground text-background rounded-lg p-12 md:p-16 space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Make Your Donation</h2>
              <p className="opacity-90 max-w-2xl">
                Every donation, no matter the amount, makes a real difference in our communities. Your contribution is
                secure and transparent.
              </p>
            </div>

            <div className="bg-background text-foreground p-8 rounded-lg">
              <h3 className="font-bold text-lg mb-6">Scan & Pay - UPI Payment</h3>
              <img
                src="/images/payment-qr.png"
                alt="Payment QR Code and Methods"
                className="w-full max-w-md mx-auto rounded-lg"
              />
            </div>

            <div className="bg-background text-foreground p-8 rounded-lg space-y-4">
              <h3 className="font-bold text-lg">Payment Methods Available</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-foreground rounded-full"></span>
                  UPI Payment
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-foreground rounded-full"></span>
                  Bank Transfer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-foreground rounded-full"></span>
                  Cheque/DD
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-foreground rounded-full"></span>
                  Online Payment
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-foreground rounded-full"></span>
                  Mobile Wallets
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-foreground rounded-full"></span>
                  Corporate Giving
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-secondary rounded-lg">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Corporate Partnerships</h2>
              <p className="text-muted-foreground">
                Collaborate with us to fulfill CSR objectives while creating social impact
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partnershipBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="animate-fade-in-up p-6 bg-background border border-border rounded-lg"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <p className="font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-foreground rounded-full"></span>
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact for More Info */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Have Questions?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get in touch with our team for more information about how you can support our mission.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 border border-border rounded-lg">
                <p className="font-semibold mb-2">Phone</p>
                <p className="text-muted-foreground">+91 99997 67640</p>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <p className="font-semibold mb-2">Helpdesk</p>
                <p className="text-muted-foreground">18001800 / 18002021</p>
              </div>
              <div className="p-6 border border-border rounded-lg">
                <p className="font-semibold mb-2">UPI ID</p>
                <p className="text-muted-foreground">9999767640m@pnb</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
