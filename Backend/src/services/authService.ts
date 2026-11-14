import { UserPayload } from "@/types/index.ts";
import { prisma } from "../../lib/prisma.ts";
import bcrypt from "bcrypt";

const DEFAULT_SIGNUP_ROLE_ID = 5;

export const registerUser = async (data: {
  username: string;
  full_name: string;
  password: string;
}) => {
  const existingUser = await prisma.users.findUnique({
    where: { username: data.username },
    select: { id: true },
  });

  if (existingUser) {
    throw Object.assign(new Error("Tên đăng nhập đã được sử dụng."), {
      statusCode: 409,
    });
  }

  const password_hash = await bcrypt.hash(data.password, 10);
  return prisma.users.create({
    data: {
      username: data.username,
      full_name: data.full_name,
      password_hash,
      role_id: DEFAULT_SIGNUP_ROLE_ID,
      is_active: true,
    },
    select: { id: true, username: true, full_name: true },
  });
};

export const verifyRole = async (userData: UserPayload) => {
  return await prisma.users.findUnique({
    where: { id: userData.id },
    select: {
      is_active: true,
      role_id: true,
      team_id: true,
      teams: {
        select: {
          team_name: true,
        },
      },
    },
  });
};

export const verifyUser = async (username: string) => {
  return await prisma.users.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      full_name: true,
      is_active: true,
      role_id: true,
      team_id: true,
      password_hash: true,
      teams: {
        select: {
          team_name: true,
        },
      },
    },
  });
};
