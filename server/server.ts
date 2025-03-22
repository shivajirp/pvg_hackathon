import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

require("dotenv").config();

export const app = express();

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

app.use(cookieParser());
