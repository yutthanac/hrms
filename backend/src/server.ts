import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import leaveRoutes from "./routes/leaveRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import profileRoutes from "./routes/profileRoutes";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

app.get("/", (_req, res) => res.json({ message: "Backend is running 🚀" }));

// ✅ mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);   // => /api/users/:id/profile และ /api/employees/department/:deptId
app.use("/api/users", profileRoutes);
app.use("/api", leaveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
