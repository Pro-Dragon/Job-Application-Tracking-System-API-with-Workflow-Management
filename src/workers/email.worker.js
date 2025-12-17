import "dotenv/config";

console.log("📩 Email worker started and waiting for jobs...");

import { Worker } from "bullmq";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

new Worker(
  "emailQueue",
  async (job) => {
    console.log("⚙️ Processing job:", job.id);

    try {
      const { to, subject, text } = job.data;

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });

      console.log("✅ Email sent successfully");
      console.log("📬 Message ID:", info.messageId);
      console.log("📨 Response:", info.response);
    } catch (error) {
      console.error("❌ Email sending failed");
      console.error(error.message);
    }
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6380,
      maxRetriesPerRequest: null,
    },
  }
);
