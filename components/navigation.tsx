"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/our-work", label: "Our Work" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact Us" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Foundation Name */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center">
              <span className="text-background text-xs font-bold">ASF</span>
            </div>
            <span className="hidden sm:inline font-bold text-sm">Aapka Sahyog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Donate Button */}
          <div className="hidden lg:block">
            <Link
              href="/get-involved"
              className="px-6 py-2 bg-foreground text-background rounded-lg font-semibold hover:bg-muted-foreground transition-colors duration-200"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2 border-t border-border">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-involved"
              className="block mx-4 px-4 py-2 bg-foreground text-background rounded-lg font-semibold text-center hover:bg-muted-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Donate Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
