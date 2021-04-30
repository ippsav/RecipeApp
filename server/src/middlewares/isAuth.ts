import { MyContext } from "../utils/context";
import { MiddlewareFn } from "type-graphql";
import { authenticateAccessToken } from "../utils";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];
  if (!authorization) {
    throw new Error("not authenticated");
  }
  const token = authorization.split(" ")[1];
  try {
    const payload = authenticateAccessToken(token);
    context.payload = payload;
  } catch (err) {
    throw new Error("not authenticated");
  }
  return next();
};
