import {
  CraeteRoleData,
  RoleFilters,
  UpdateRoleData,
} from "@/types/role.type.ts";
import { prisma } from "../../lib/prisma.ts";
import { Prisma } from "../../generated/prisma/client.ts";

export const getRolesService = async (filters: RoleFilters) => {
  const { id } = filters;
  return await prisma.roles.findMany({
    where: {
      id: id ? Number(id) : undefined,
    },
  });
};

export const craeteRoleService = async (roleData: CraeteRoleData) => {
  const { role_name, priority_level } = roleData;
  return await prisma.roles.create({
    data: {
      role_name,
      priority_level,
    },
  });
};

export const updateRoleService = async (
  id: number,
  roleData: UpdateRoleData,
) => {
  const { role_name, priority_level } = roleData;
  const data: Prisma.rolesWhereInput = {};
  if (role_name) data.role_name = role_name;
  if (priority_level) data.priority_level = priority_level;
  return await prisma.roles.update({
    where: { id: id },
    data: data as Prisma.rolesUncheckedUpdateInput,
  });
};

export const deleteRoleService = async (id: number) => {
  return await prisma.roles.delete({
    where: { id: id },
  });
};
