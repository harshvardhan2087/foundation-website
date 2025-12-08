import { type NextRequest, NextResponse } from "next/server"

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FOUNDATION_EMAIL = process.env.FOUNDATION_EMAIL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, location, message } = body

    // Validate required fields
    if (!name || !email || !phone || !location || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    // Send email to foundation
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Aapka Sahyog Foundation <onboarding@resend.dev>",
        to: FOUNDATION_EMAIL,
        subject: `New Enquiry from ${name}`,
        html: `
          <h2>New Enquiry Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Location:</strong> ${location}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr>
          <p><small>This is an automated message from Aapka Sahyog Foundation website</small></p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      console.error("[v0] Email send failed:", errorData)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    // Also send confirmation email to user
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Aapka Sahyog Foundation <onboarding@resend.dev>",
        to: email,
        subject: "We received your enquiry - Aapka Sahyog Foundation",
        html: `
          <h2>Thank You for Your Enquiry</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and appreciate your interest in Aapka Sahyog Foundation.</p>
          <p>Our team will review your enquiry and get back to you shortly.</p>
          <p><strong>Your Message Details:</strong></p>
          <p>${message}</p>
          <hr>
          <p>For urgent matters, please contact us at:</p>
          <p>Phone: +91 99997 67640</p>
          <p>Email: info@aapkasahyog.org</p>
          <p><small>Aapka Sahyog Foundation - Reg. No. 49/2025/Jewar</small></p>
        `,
      }),
    })

    return NextResponse.json(
      {
        message: "Enquiry sent successfully",
        data: body,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error processing enquiry:", error)
    return NextResponse.json({ error: "Failed to process enquiry" }, { status: 500 })
  }
}
