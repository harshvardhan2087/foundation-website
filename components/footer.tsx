import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Aapka Sahyog Foundation</h3>
            <p className="text-sm opacity-80">
              Dedicated to creating positive social impact through education, environmental protection, and community
              development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:opacity-70 transition-opacity">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/our-work" className="hover:opacity-70 transition-opacity">
                  Our Work
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:opacity-70 transition-opacity">
                  Team
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="hover:opacity-70 transition-opacity">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-70 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 99997 67640</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@aapkasahyog.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Jewar, Uttar Pradesh</span>
              </div>
            </div>
          </div>

          {/* Registration */}
          <div>
            <h4 className="font-semibold mb-4">Registration</h4>
            <p className="text-sm">Regd. No. 49/2025/Jewar</p>
            <p className="text-sm mt-4">UPI ID: 9999767640m@pnb</p>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-70">
          <p>&copy; 2025 Aapka Sahyog Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
