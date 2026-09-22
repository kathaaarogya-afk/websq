import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { transporter } from "@/mailer";

function welcomeEmailHtml(email: string) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#FFF9EE;padding:32px;">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;padding:32px;border:1px solid #fde68a;">
      <h1 style="margin:0 0 8px;font-size:24px;color:#111827;">You're subscribed! 🎉</h1>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">
        Thanks for joining the <strong>WebSQ</strong> newsletter. We'll send the best stories
        directly to your inbox every week.
      </p>
      <p style="color:#4b5563;font-size:15px;line-height:1.6;">
        You signed up with: <strong>${email}</strong>
      </p>
      <hr style="border:none;border-top:1px solid #fde68a;margin:24px 0;" />
      <p style="color:#9ca3af;font-size:12px;margin:0;">
        No spam, ever. You can unsubscribe anytime.
      </p>
      <p style="color:#9ca3af;font-size:12px;margin:8px 0 0;">
        WebSQ — Every Story Matters. Every Voice Belongs.
      </p>
    </div>
  </div>`;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email" },
        { status: 400 }
      );
    }

    await connectDB();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: "Email is not configured. Set EMAIL_USER and EMAIL_PASS in .env.local." },
        { status: 500 }
      );
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "You are already subscribed!" },
        { status: 200 }
      );
    }

    const subscriber = await Newsletter.create({ email });

    try {
      await transporter.sendMail({
        from: `"WebSQ" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to the WebSQ newsletter!",
        html: welcomeEmailHtml(email),
      });
    } catch (mailError: unknown) {
      await Newsletter.findByIdAndDelete(subscriber._id);
      const mailMessage =
        mailError instanceof Error ? mailError.message : "Failed to send email";
      return NextResponse.json(
        { error: `Confirmation email failed: ${mailMessage}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully subscribed! Check your inbox for a welcome email." },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
