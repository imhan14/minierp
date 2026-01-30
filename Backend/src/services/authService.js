import { prisma } from '../../lib/prisma.ts';

export const verifyRole = async (userData) => {
    return await prisma.users.findUnique({
        where: {id: userData.id},
        select: {is_active: true, role_id: true}
    });
};

export const verifyUser = async (username) => {
    return await prisma.users.findUnique({
        where: {username}
    });
};