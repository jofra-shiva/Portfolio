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
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #7c3aed;">Hello ${name},</h2>
          <p>Thank you for reaching out through my portfolio website!</p>
          <p>This is an automated reply to confirm that I have received your message. I will review it and get back to you as soon as possible.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <h4>Your message:</h4>
          <p style="white-space: pre-wrap; font-style: italic;">${message}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p>Best regards,</p>
          <p><strong>Shiva Prakash</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
