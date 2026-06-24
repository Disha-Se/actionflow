import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { env } from "../utils/env.js";
import { prisma } from "../utils/prisma.js";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true
};

const signAccessToken = (user: { id: string; email: string }) => {
  return jwt.sign({ email: user.email }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN
  });
};

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new AppError(409, "Email is already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: passwordHash
      },
      select: publicUserSelect
    });

    return {
      user,
      accessToken: signAccessToken(user)
    };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);

    if (!passwordMatches) {
      throw new AppError(401, "Invalid email or password");
    }

    const publicUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    return {
      user: publicUser,
      accessToken: signAccessToken(publicUser)
    };
  }
};
