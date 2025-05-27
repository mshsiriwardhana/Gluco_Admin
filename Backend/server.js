import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import doctorRoutes from "./routes/doctor.route.js";
import hospitalRoutes from "./routes/hospital.route.js";
import scheduleRoutes from "./routes/schedule.route.js";
dotenv.config();


// Connect to database before starting the server
connectDB();

const app = express();

app.use(express.json()); // Middleware to parse JSON

app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));


// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/schedules", scheduleRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log("Server is running at http://localhost:" + PORT);
});
