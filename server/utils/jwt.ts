require("dotenv").config();
import { IUser } from "../models/user.models";
import { Response } from "express";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse enviroment variables to integrates with fallback values
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

// options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

// export const sendToken = (user: IUser, statusCode: number, res: Response) => {
//   const accessToken = user.SignAccessToken();
//   const refreshToken = user.SignRefreshToken();
//   // upload session to redis
//   redis.set(user._id as string, JSON.stringify(user) as any);

//   res.status(statusCode).json({
//     success: true,
//     user,
//     accessToken,
//     refreshToken,
//   });
// };



export const sendToken = (user: any, statusCode: number, res: Response) => {
  const token = user.getJWTToken();

  // Cookie options
  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day expiry
    httpOnly: true, // Secure against XSS
    secure: process.env.NODE_ENV === "production", // Only secure in production
    sameSite: "strict" as "strict",
  };

  res.status(statusCode).cookie("access_token", token, options).json({
    success: true,
    user,
    token, // Still returning for reference
  });
};
