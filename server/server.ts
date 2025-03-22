import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// import dotenv from "dotenv";
import { connectDB } from "./utils/connectDB";
import userRouter from "./routes/user.route";

require("dotenv").config();

export const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}))

app.use('/api/v1', userRouter);

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT} || PORT`);
});

