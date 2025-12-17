import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  create,
  update,
  close,
  list,
} from "../controllers/job.controller.js";

const router = express.Router();

// Create job
router.post(
  "/",
  authenticate,
  authorizeRoles("RECRUITER"),
  create
);

// Update job
router.put(
  "/:jobId",
  authenticate,
  authorizeRoles("RECRUITER"),
  update
);

// Close job
router.patch(
  "/:jobId/close",
  authenticate,
  authorizeRoles("RECRUITER"),
  close
);

// List jobs
router.get(
  "/",
  authenticate,
  authorizeRoles("RECRUITER"),
  list
);

export default router;
