import {
  CreateTeamData,
  TeamFilters,
  UpdateTeamData,
} from "@/types/team.type.ts";
import { prisma } from "../../lib/prisma.ts";
import { Prisma } from "../../generated/prisma/client.ts";

export const getTeamsService = async (filters: TeamFilters) => {
  const { id } = filters;
  return await prisma.teams.findMany({
    where: {
      id: id ? Number(id) : undefined,
    },
  });
};

export const createTeamService = async (teamData: CreateTeamData) => {
  const { team_name, user_id } = teamData;
  return await prisma.teams.create({
    data: {
      team_name,
      user_id,
    },
  });
};

export const updateTeamService = async (
  id: number,
  teamData: UpdateTeamData,
) => {
  const { team_name, user_id } = teamData;
  const data: Prisma.teamsWhereInput = {};
  if (team_name) data.team_name = team_name;
  if (user_id) data.user_id = user_id;
  return await prisma.teams.update({
    where: { id },
    data: data as Prisma.teamsUncheckedUpdateInput,
  });
};
export const deleteTeamService = async (filters: TeamFilters) => {
  const { id } = filters;
  return await prisma.teams.delete({
    where: {
      id: id ? Number(id) : undefined,
    },
  });
};
