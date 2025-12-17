import { changeApplicationStage } from "../services/application.service.js";
import { applyToJob } from "../services/application.service.js";

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
