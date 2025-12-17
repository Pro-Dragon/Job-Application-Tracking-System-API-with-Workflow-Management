import { getStageChangeEmail } from "../utils/applicationEmailTemplates.js";
import prisma from "../utils/prisma.js";
import { isValidTransition } from "../utils/applicationStateMachine.js";
import { sendEmailAsync } from "./email.service.js";

/**
 * Candidate applies to a job
 */
export async function applyToJob({ jobId, candidateId }) {
  // 1️⃣ Fetch job + company + recruiters
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: {
        include: {
          users: {
            where: { role: "RECRUITER" },
            select: { email: true },
          },
        },
      },
    },
  });

  if (!job || job.status !== "OPEN") {
    throw new Error("Job not available for application");
  }

  // 2️⃣ Fetch candidate email
  const candidate = await prisma.user.findUnique({
    where: { id: candidateId },
    select: { email: true },
  });

  // 3️⃣ Prevent duplicate
  const existingApplication = await prisma.application.findFirst({
    where: { jobId, candidateId },
  });

  if (existingApplication) {
    throw new Error("You have already applied for this job");
  }

  // 4️⃣ Transaction
  const application = await prisma.$transaction(async (tx) => {
    const app = await tx.application.create({
      data: {
        jobId,
        candidateId,
        stage: "APPLIED",
      },
    });

    await tx.applicationHistory.create({
      data: {
        applicationId: app.id,
        fromStage: "APPLIED",
        toStage: "APPLIED",
        changedById: candidateId,
      },
    });

    return app;
  });

  // 5️⃣ Candidate email
  await sendEmailAsync({
    to: candidate.email,
    subject: "Application Submitted",
    text: `Your application for the job has been successfully submitted.`,
  });

  // 6️⃣ Recruiter emails
  for (const recruiter of job.company.users) {
    await sendEmailAsync({
      to: recruiter.email,
      subject: "New Application Received",
      text: `A new candidate has applied for your job posting.`,
    });
  }

  return application;
}


/**
 * Recruiter / Hiring Manager changes application stage
 */


export async function changeApplicationStage({
  applicationId,
  nextStage,
  changedById,
}) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      candidate: { select: { email: true } },
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const currentStage = application.stage;

  if (!isValidTransition(currentStage, nextStage)) {
    throw new Error(
      `Invalid stage transition from ${currentStage} to ${nextStage}`
    );
  }

  // 1️⃣ DB transaction
  const updatedApplication = await prisma.$transaction(async (tx) => {
    const updated = await tx.application.update({
      where: { id: applicationId },
      data: { stage: nextStage },
    });

    await tx.applicationHistory.create({
      data: {
        applicationId,
        fromStage: currentStage,
        toStage: nextStage,
        changedById,
      },
    });

    return updated;
  });

  // 2️⃣ Prepare email
  const { subject, text } = getStageChangeEmail({
    fromStage: currentStage,
    toStage: nextStage,
  });

  // 3️⃣ Send email asynchronously
  await sendEmailAsync({
    to: application.candidate.email,
    subject,
    text,
  });

  return updatedApplication;
}
