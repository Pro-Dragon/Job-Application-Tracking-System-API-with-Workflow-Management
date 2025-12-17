import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { apply, changeStage } from "../controllers/application.controller.js";

const router = express.Router();

// Candidate applies
router.post(
  "/apply",
  authenticate,
  authorizeRoles("CANDIDATE"),
  apply
);

// Recruiter / Hiring Manager change stage
router.patch(
  "/:id/stage",
  authenticate,
  authorizeRoles("RECRUITER", "HIRING_MANAGER"),
  changeStage
);

export default router;
