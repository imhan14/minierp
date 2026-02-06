import { prisma } from '../../lib/prisma.ts';

export const getTeamsService = async (filters) => {
    const {id} = filters;
    return await prisma.teams.findMany({
        where:{
            id: id ? Number(id) : undefined
        }
    })
}

export const createTeamService = async (teamData) => {
    const {team_name, user_id} = teamData;
    return await prisma.teams.create({
        data:{
            team_name,
            user_id
        }
    })
}

export const updateTeamService = async (filters, teamData) =>{
    const {id} = filters;
    const {team_name, user_id} = teamData;
    const data = {}
    if(team_name) data.team_name = team_name;
    if(user_id) data.user_id = user_id
    return await prisma.teams.update({
        where:{ id: Number(id)},
        data: data
    })
}
export const deleteTeamService = async (filters) =>{
    const {id} = filters;
    return await prisma.teams.delete({
        where:{
            id: id? Number(id): undefined
        }
    })
}