import { emailQueue } from "../queues/email.queue.js";

export async function sendEmailAsync({ to, subject, text }) {
  console.log("📨 Queuing email to:", to);

  await emailQueue.add("send-email", {
    to,
    subject,
    text,
  });
}
