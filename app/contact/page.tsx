"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock, Users, Send } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setFormData({ name: "", email: "", phone: "", location: "", message: "" })
        setTimeout(() => setSubmitStatus(null), 5000)
      } else {
        setSubmitStatus("error")
        setTimeout(() => setSubmitStatus(null), 5000)
      }
    } catch (error) {
      console.error(" Error submitting form:", error)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 99997 67640", "Mobile/WhatsApp Available"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@aapkasahyog.org", "For general inquiries"],
    },
    {
      icon: MapPin,
      title: "Location",
      details: ["Jewar, Uttar Pradesh", "India"],
    },
    {
      icon: Clock,
      title: "Helpdesk Hours",
      details: ["18001800", "18002021"],
    },
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold">Get In Touch</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Have questions or want to collaborate with us? Fill out the enquiry form below and we'll get back to you
              shortly. Your inquiry will be sent directly to our team.
            </p>
          </div>
        </section>

        {/* Enquiry Form */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="animate-fade-in-up">
              <div className="bg-secondary p-8 md:p-10 rounded-lg border border-border">
                <h2 className="text-2xl font-bold mb-6">Send us an Enquiry</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground transition-all bg-background"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground transition-all bg-background"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground transition-all bg-background"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground transition-all bg-background"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground transition-all resize-none bg-background"
                      placeholder="Tell us your inquiry or how we can help..."
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-100 text-green-800 rounded-lg text-sm">
                      Thank you! Your enquiry has been sent successfully. We will reach out soon.
                    </div>
                  )}
                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-100 text-red-800 rounded-lg text-sm">
                      Error sending enquiry. Please try again or contact us directly at +91 99997 67640.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    {isSubmitting ? "Sending..." : "Send Enquiry"}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 gap-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div
                        key={index}
                        className="animate-fade-in-up p-6 border border-border rounded-lg hover:border-foreground hover:shadow-lg transition-all"
                        style={{ animationDelay: `${(index + 1) * 100}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          <Icon size={24} className="flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                            <div className="space-y-1">
                              {info.details.map((detail, idx) => (
                                <p key={idx} className="text-muted-foreground text-sm">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-secondary rounded-lg">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Get In Touch?</h2>
              <p className="text-muted-foreground">Multiple reasons to connect with Aapka Sahyog Foundation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="animate-fade-in-up p-8 bg-background border border-border rounded-lg">
                <Users size={32} className="mb-4" />
                <h3 className="font-bold text-lg mb-3">Join as Volunteer</h3>
                <p className="text-muted-foreground text-sm">
                  Contribute your time and skills to support our community initiatives and programs.
                </p>
              </div>
              <div
                className="animate-fade-in-up p-8 bg-background border border-border rounded-lg"
                style={{ animationDelay: "100ms" }}
              >
                <Mail size={32} className="mb-4" />
                <h3 className="font-bold text-lg mb-3">Partnership Inquiry</h3>
                <p className="text-muted-foreground text-sm">
                  Interested in collaborating with us? We welcome partnerships with organizations and businesses.
                </p>
              </div>
              <div
                className="animate-fade-in-up p-8 bg-background border border-border rounded-lg"
                style={{ animationDelay: "200ms" }}
              >
                <Phone size={32} className="mb-4" />
                <h3 className="font-bold text-lg mb-3">General Support</h3>
                <p className="text-muted-foreground text-sm">
                  Have questions about our programs or need assistance? Our team is here to help.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment and Donations */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-slide-in-left space-y-6">
              <h2 className="text-3xl font-bold">Donation & Financial Support</h2>
              <div className="space-y-4">
                <div className="p-6 border border-border rounded-lg">
                  <p className="font-semibold mb-2">UPI Payment</p>
                  <p className="text-muted-foreground font-mono">9999767640m@pnb</p>
                </div>
                <div className="p-6 border border-border rounded-lg">
                  <p className="font-semibold mb-2">Bank Name</p>
                  <p className="text-muted-foreground">Punjab National Bank (PNB)</p>
                </div>
                <div className="p-6 border border-border rounded-lg">
                  <p className="font-semibold mb-2">Payment Methods</p>
                  <p className="text-muted-foreground">Online, UPI, Cheque, Draft, Mobile Wallets</p>
                </div>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <img
                src="/images/payment-qr.png"
                alt="Payment QR Code"
                className="w-full rounded-lg border border-border"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
