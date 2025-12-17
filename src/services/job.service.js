import prisma from "../utils/prisma.js";

/**
 * CREATE JOB
 */
export async function createJob({ title, description, companyId }) {
  return prisma.job.create({
    data: {
      title,
      description,
      companyId,
      status: "OPEN",
    },
  });
}

/**
 * UPDATE JOB
 */
export async function updateJob({ jobId, companyId, data }) {
  // Ensure job belongs to recruiter company
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      companyId,
    },
  });

  if (!job) {
    throw new Error("Job not found or access denied");
  }

  return prisma.job.update({
    where: { id: jobId },
    data,
  });
}

/**
 * CLOSE JOB (soft close, NOT delete)
 */
export async function closeJob({ jobId, companyId }) {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      companyId,
    },
  });

  if (!job) {
    throw new Error("Job not found or access denied");
  }

  return prisma.job.update({
    where: { id: jobId },
    data: { status: "CLOSED" },
  });
}

/**
 * LIST JOBS (company-specific)
 */
export async function listJobs({ companyId }) {
  return prisma.job.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });
}
