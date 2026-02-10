import { prisma } from '../../lib/prisma.ts';
import bcrypt from 'bcrypt';

export const createUserService = async (userData) => {
    const { username, password, full_name, role_id } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.users.create({
        data: { 
            username, 
            password_hash:hashedPassword, 
            full_name, 
            role_id,
            is_active: true
        },
        select:{
            id: true,
            username: true,
            full_name: true,
            is_active: true,
            roles:{
                select: {role_name: true}
            }
        }
    });
};

export const getAUserService = async (id) => {
    return await prisma.users.findUnique({
        where: {id: id},
        select:{
            id: true,
            username: true,
            full_name: true,
            is_active: true,
            roles:{
                select: {role_name: true}
            }
        }
    })
}

export const getUsersService = async (filters) => {
    const {role_id, id, search} = filters;
    return await prisma.users.findMany({
        where: {
            id: id ? Number(id) : undefined,
            role_id: role_id ? Number(role_id) : undefined,
            full_name: search ? {
                contains: search,
                mode: 'insensitive'
            } : undefined,
        },
        select:{
            id: true,
            username: true,
            full_name: true,
            is_active: true,
            roles:{
                select: {role_name: true}
            }
        }
    });
};

export const updateUserService = async (filters, userData) => {
    const {id} = filters;
    const { username, full_name, role_id, is_active, password } = userData;
    const data = {};
    if (username) data.username = username;
    if (full_name) data.full_name = full_name;
    if (role_id) data.role_id = role_id;
    if (is_active !== undefined) data.is_active = is_active;
    if (password) {
        data.password_hash = await bcrypt.hash(password, 10);
    }
    return await prisma.users.update({
        where: {
            id: Number(id)
        },
        data: data
    });
};

export const deleteUserService = async (filters) => {
    const {id} = filters;
    return await prisma.users.delete({
        where: {
            id: Number(id)
        }
    })
}