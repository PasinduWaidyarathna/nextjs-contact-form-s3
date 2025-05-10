import { NextResponse } from "next/server"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

// Initialize SES client
const ses = new SESClient({ region: "eu-north-1" })

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { email, name, message } = body

    // Validate input
    if (!email || !name || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailBody = `Hello,\n\nYou have received a new message via the 
      contact form on your website. Below are the details of the message:
      \n\n**Sender Information:**\n- Name: ${name}\n- Email: ${email}\n\n
      **Message:**\n${message}\n\nPlease respond to this message at your 
      earliest convenience.`

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: ["kvpasindumalinda@gmail.com"],
      },
      Message: {
        Body: {
          Text: { Data: emailBody },
        },
        Subject: { Data: "New Message from Contact Form" },
      },
      Source: "kvpasindumalinda@gmail.com", // Your verified SES email
    })

    // Send email
    await ses.send(command)

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
