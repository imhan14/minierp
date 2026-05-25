import { UserPayload } from "@/types/index.ts";
import { prisma } from "../../lib/prisma.ts";

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
