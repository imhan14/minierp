import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import type {
  UserFilters,
  CreateUserData,
  UpdateUserData,
} from "../types/index.js";

const userSelect = {
  id: true,
  username: true,
  full_name: true,
  is_active: true,
  roles: { select: { role_name: true } },
  teams: { select: { team_id: true, team_name: true } },
} as const;

export const createUserService = async (userData: CreateUserData) => {
  const { username, password, full_name, role_id } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.users.create({
    data: {
      username,
      password_hash: hashedPassword,
      full_name,
      role_id,
      is_active: true,
    },
    select: userSelect,
  });
};

export const getAUserService = async (id: number) => {
  return await prisma.users.findUnique({
    where: { id: id },
    select: userSelect,
  });
};

export const getUsersService = async (filters: UserFilters) => {
  const { role_id, id, search } = filters;
  return await prisma.users.findMany({
    where: {
      id: id ?? undefined,
      role_id: role_id ?? undefined,
      full_name: search
        ? {
            contains: search,
            mode: "insensitive",
          }
        : undefined,
    },
    select: userSelect,
  });
};

export const updateUserService = async (
  id: number,
  userData: UpdateUserData,
) => {
  const {
    username,
    full_name,
    role_id,
    is_active,
    old_password,
    new_password,
    team_id,
  } = userData;
  const data: Record<string, unknown> = {};
  if (username) data.username = username;
  if (full_name) data.full_name = full_name;
  if (role_id) data.role_id = Number(role_id);
  if (is_active !== undefined) data.is_active = is_active;
  if (new_password) {
    const user = await prisma.users.findUnique({ where: { id: id } });
    if (!user) throw new Error("User does not exist!");
    const isMatch = await bcrypt.compare(old_password!, user.password_hash!);
    if (!isMatch) {
      const error = Object.assign(new Error("The old password is incorrect."), {
        statusCode: 400,
      });
      throw error;
    }
    const isSameAsOld = await bcrypt.compare(new_password, user.password_hash!);
    if (isSameAsOld) {
      const error = Object.assign(
        new Error("The new password must not be the same as the old password."),
        { statusCode: 400 },
      );
      throw error;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(new_password, salt);
    data.password_hash = hashedNewPassword;
  }
  if (team_id) data.team_id = team_id;
  return await prisma.users.update({
    where: {
      id: id,
    },
    data: data,
    select: userSelect,
  });
};

export const deleteUserService = async (filters: { id: string }) => {
  const { id } = filters;
  return await prisma.users.delete({
    where: {
      id: Number(id),
    },
  });
};
