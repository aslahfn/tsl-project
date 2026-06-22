import nodemailer from 'nodemailer';

export async function sendLoginNotification(userEmail: string, userName: string) {
  const adminEmail = 'aslahfarhanma@gmail.com';
  
  // If SMTP is not configured, just log to the console
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email Simulation] Login Notification: ${userName} (${userEmail}) just logged in. (Configure SMTP to send actual emails)`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"TSL App" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: '🚨 New User Login - TSL App',
    text: `A user has just logged in to the TSL App:\n\nName: ${userName}\nEmail: ${userEmail}\nTime: ${new Date().toLocaleString()}`,
    html: `
      <h3>New Login Detected</h3>
      <p>A user has successfully logged in to the TSL platform:</p>
      <ul>
        <li><strong>Name:</strong> ${userName}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p><em>Thozhupadam Super League System</em></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Login notification sent to ${adminEmail}`);
  } catch (error) {
    console.error('Failed to send login notification email:', error);
  }
}
