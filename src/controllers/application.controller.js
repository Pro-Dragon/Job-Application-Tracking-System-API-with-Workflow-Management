import { changeApplicationStage } from "../services/application.service.js";
import { applyToJob } from "../services/application.service.js";
import prisma from "../utils/prisma.js";

export async function apply(req, res) {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.userId;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const application = await applyToJob({
      jobId: Number(jobId),
      candidateId,
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


export async function changeStage(req, res) {
  try {
    const applicationId = Number(req.params.id);
    const { nextStage } = req.body;
    const changedById = req.user.userId;

    if (!nextStage) {
      return res.status(400).json({ message: "nextStage is required" });
    }

    const updatedApplication = await changeApplicationStage({
      applicationId,
      nextStage,
      changedById,
    });

    return res.json({
      message: "Application stage updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function listMyApplications(req, res) {
  try {
    const candidateId = req.user.userId;

    const applications = await prisma.application.findMany({
      where: { candidateId },
      include: {
        job: true,
      },
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export async function listApplicationsForJob(req, res) {
  try {
    const { jobId } = req.params;
    const { stage } = req.query;
    const recruiterCompanyId = req.user.companyId;

    // Ensure job belongs to recruiter company
    const job = await prisma.job.findUnique({
      where: { id: Number(jobId) },
    });

    if (!job || job.companyId !== recruiterCompanyId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await prisma.application.findMany({
      where: {
        jobId: Number(jobId),
        ...(stage && { stage }),
      },
      include: {
        candidate: {
          select: { email: true },
        },
      },
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
