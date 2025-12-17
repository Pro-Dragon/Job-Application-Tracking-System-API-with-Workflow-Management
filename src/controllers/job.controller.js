import {
  createJob,
  updateJob,
  closeJob,
  listJobs,
} from "../services/job.service.js";

// CREATE JOB
export async function create(req, res) {
  try {
    const { title, description } = req.body;
    const companyId = req.user.companyId;

    if (!companyId) {
      return res
        .status(400)
        .json({ message: "Recruiter is not associated with a company" });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const job = await createJob({ title, description, companyId });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// UPDATE JOB
export async function update(req, res) {
  try {
    const jobId = Number(req.params.jobId);
    const companyId = req.user.companyId;

    const job = await updateJob({ jobId, companyId, data: req.body });

    res.json({
      message: "Job updated successfully",
      job,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// CLOSE JOB
export async function close(req, res) {
  try {
    const jobId = Number(req.params.jobId);
    const companyId = req.user.companyId;

    const job = await closeJob({ jobId, companyId });

    res.json({
      message: "Job closed successfully",
      job,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// LIST JOBS
export async function list(req, res) {
  try {
    const companyId = req.user.companyId;

    const jobs = await listJobs({ companyId });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
