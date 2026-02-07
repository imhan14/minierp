import { prisma } from '../../lib/prisma.ts';

export const getRolesService = async (filters) => {
    const {id} = filters;
    return await prisma.roles.findMany({
        where:{
            id: id? Number(id): undefined
        }
    });
}

export const craeteRoleService = async(roleData) => {
    const {role_name, priority_level} = roleData;
    return await prisma.roles.create({
        data:{
            role_name,
            priority_level
        }
    })
}

export const updateRoleService = async(filters, roleData) => {
    const {id} = filters;
    const {role_name, priority_level} = roleData;
    const data = {}
    if(role_name) data.roleName = role_name;
    if(priority_level) data.priorityLevel = priority_level;
    return await prisma.roles.update({
        where: {id: Number(id)},
        data:data
    })
}

export const deleteRoleService = async(filters) =>{
    const {id} = filters;
    return await prisma.roles.delete({
        where:{id:Number(id)}
    })
}