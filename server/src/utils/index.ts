import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "../entities";
import { IPayload } from "./types";

export const generateAccessToken = (user: User): string => {
  const { ACCESS_TOKEN_SECRET } = process.env;
  const token = sign({ userId: user.id }, ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
  return token;
};

export const generateRefreshToken = (user: User): string => {
  const { REFRESH_TOKEN_SECRET } = process.env;
  const token = sign({ userId: user.id }, REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  return token;
};

export const authenticateAccessToken = (token: string): IPayload => {
  const { ACCESS_TOKEN_SECRET } = process.env;
  const payload = verify(token, ACCESS_TOKEN_SECRET!) as IPayload;
  return payload;
};

export const authenticateRefreshToken = (token: string): IPayload => {
  const { REFRESH_TOKEN_SECRET } = process.env;
  const payload = verify(token, REFRESH_TOKEN_SECRET!) as IPayload;
  return payload;
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh_token",
    sameSite: "lax",
  });
};
