import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. Send an email to the user (Shivaprakash)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Message from ${name} - ${subject || 'No Subject'}`,
      html: `
        <h3>New message from your portfolio</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    // 2. Send an auto-reply to the person who submitted the form
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for reaching out!`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 20px; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); background-color: #7c3aed; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">Siva Prakash M</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Full Stack Developer</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1e293b; font-size: 22px; margin-top: 0;">Hello ${name},</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Thank you so much for reaching out to me! I'm thrilled to connect with you. 
                This is an automated confirmation that your message has landed safely in my inbox.
              </p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                I'll be reviewing your inquiry shortly and will get back to you as soon as possible.
              </p>
              
              <!-- Message Summary Card -->
              <div style="background-color: #f8fafc; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 0 8px 8px 0; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #334155; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Your Message Summary:</h4>
                <p style="margin: 0; color: #64748b; font-size: 15px; font-style: italic; white-space: pre-wrap; line-height: 1.5;">"${message}"</p>
              </div>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 0;">
                Looking forward to speaking with you!
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f1f5f9; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">
                Best regards,<br/>
                <strong style="color: #1e293b; font-size: 16px; display: inline-block; margin-top: 5px;">Siva Prakash M</strong>
              </p>
            </div>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
