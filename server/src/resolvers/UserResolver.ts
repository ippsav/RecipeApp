import argon2 from "argon2";
import { MyContext } from "../utils/context";
import { User } from "../entities";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isEmail } from "../utils/isEmail";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} from "../utils";
import { isAuth } from "../middlewares/isAuth";

@InputType()
class UserInputRegister {
  @Field()
  username: string;
  @Field()
  email: string;
  @Field()
  password: string;
}
@InputType()
class UserInputLogin {
  @Field()
  usernameOrEmail: string;
  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class ResponseData {
  @Field(() => User)
  user: User;
  @Field()
  token: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors: FieldError[] | null;
  @Field(() => ResponseData, { nullable: true })
  data: ResponseData | null;
}

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { prisma, payload }: MyContext): Promise<User | null> {
    console.log("entered");
    const user = await prisma.user.findUnique({
      where: {
        id: payload?.userId,
      },
    });
    if (!user) {
      throw new Error("user not found");
    }
    return user;
  }
  @Mutation(() => UserResponse)
  async login(
    @Ctx() { prisma, res }: MyContext,
    @Arg("options") options: UserInputLogin
  ): Promise<UserResponse> {
    const { usernameOrEmail, password } = options;
    let user: User | null;
    if (usernameOrEmail.includes("@")) {
      if (!isEmail(usernameOrEmail)) {
        return {
          errors: [
            { field: "username or email", message: "Email in wrong format" },
          ],
          data: null,
        };
      } else {
        user = await prisma.user.findUnique({
          where: {
            email: usernameOrEmail,
          },
        });
      }
    } else {
      user = await prisma.user.findUnique({
        where: {
          username: usernameOrEmail,
        },
      });
    }
    if (!user) {
      return {
        errors: [
          {
            field: "username or email",
            message: "username or email is not valid",
          },
        ],
        data: null,
      };
    }
    const isMatch = argon2.verify(user.password, password);
    if (!isMatch) {
      return {
        errors: [
          {
            field: "password",
            message: "wrong password",
          },
        ],
        data: null,
      };
    }
    sendRefreshToken(res, generateRefreshToken(user));
    return {
      errors: null,
      data: {
        user,
        token: generateAccessToken(user),
      },
    };
  }
  @Mutation(() => UserResponse)
  async register(
    @Ctx() { prisma, res }: MyContext,
    @Arg("options") options: UserInputRegister
  ): Promise<UserResponse> {
    const { email, username, password } = options;
    if (username.length < 4) {
      return {
        errors: [
          {
            field: "username",
            message: "username must be at least 4 characters",
          },
        ],
        data: null,
      };
    }
    if (!isEmail(email)) {
      return {
        errors: [
          {
            field: "email",
            message: "email in wrong format",
          },
        ],
        data: null,
      };
    }
    if (password.length < 4) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be longer than 3 characters",
          },
        ],
        data: null,
      };
    }
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
    if (user?.username === username) {
      return {
        errors: [
          {
            field: "username",
            message: "username already taken",
          },
        ],
        data: null,
      };
    } else if (user?.email === email) {
      return {
        errors: [
          {
            field: "email",
            message: "email already taken",
          },
        ],
        data: null,
      };
    }
    const hashedPassword = await argon2.hash(password);
    user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      include: {
        recipes: true,
      },
    });

    sendRefreshToken(res, generateRefreshToken(user));

    return {
      errors: [],
      data: {
        user,
        token: generateAccessToken(user),
      },
    };
  }
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      try {
        res.clearCookie("jid");
        resolve(true);
      } catch (err) {
        resolve(false);
      }
    });
  }
}
