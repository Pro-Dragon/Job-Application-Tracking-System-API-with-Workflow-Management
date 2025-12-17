import express from "express";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import jobRoutes from "./routes/job.routes.js";


const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/applications", applicationRoutes);
app.use("/jobs", jobRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
