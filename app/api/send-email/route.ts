import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, business_name } = await req.json();
    if (!name || !email || !business_name)
      throw new Error("Missing required fields");

    const emailResponse = await resend.emails.send({
      from: "Accountancy Portal <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Our Accountancy Services!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
          <h1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">Welcome Aboard! 🎉</h1>
          <p>Hello ${name},</p>
          <p>We're thrilled to welcome <strong>${business_name}</strong> to our accountancy services.</p>
          <p>We'll be in touch shortly to schedule your onboarding call.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data: emailResponse });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
