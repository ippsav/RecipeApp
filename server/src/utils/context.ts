import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { IPayload } from "./types";

export interface MyContext {
  prisma: PrismaClient;
  req: Request;
  res: Response;
  payload?: IPayload;
}
