import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { prisma } from "./client";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { MyContext } from "./utils/context";
import cors from "cors";
import { UserResolver } from "./resolvers/UserResolver";
import cookieParser from "cookie-parser";
import { IPayload } from "./utils/types";
import { authenticateRefreshToken, generateAccessToken } from "./utils";

const main = async () => {
  const app = express();
  app.use(cookieParser());
  const { PORT } = process.env;
  app.use(
    cors({
      credentials: true,
    })
  );
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return { ok: true, accessToken: "" };
    }
    let payload: IPayload | null;
    try {
      payload = authenticateRefreshToken(token);
    } catch (error) {
      return res.send({ ok: false, accessToken: "" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });
    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }
    return res.send({
      ok: true,
      accessToken: generateAccessToken(user),
    });
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      prisma,
      req,
      res,
    }),
  });
  apolloServer.applyMiddleware({ app, cors: false });
  app.listen(PORT || 4000, () => {
    console.log(`Server running at port ${PORT || 4000}`);
  });
};

main().catch((err) => console.log(err.details));
