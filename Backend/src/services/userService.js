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

export const updateUserService = async (id, userData) => {
    const { username, full_name, role_id, is_active, old_password, new_password } = userData;
    const data = {};
    if (username) data.username = username;
    if (full_name) data.full_name = full_name;
    if (role_id) data.role_id = Number(role_id);
    if (is_active !== undefined) data.is_active = is_active;
    if (new_password){
        const user = await prisma.users.findUnique({ where: { id: id } });
        if (!user) throw new Error("User does not exist!");
        const isMatch = await bcrypt.compare(old_password, user.password_hash);
        if (!isMatch) {
            const error = new Error("The old password is incorrect.");
            error.statusCode = 400;
            throw error;
        }
        const isSameAsOld = await bcrypt.compare(new_password, user.password_hash);
        if (isSameAsOld) {
            const error = new Error("The new password must not be the same as the old password.");
            error.statusCode = 400;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(new_password, salt);
        data.password_hash = hashedNewPassword;
    }
    return await prisma.users.update({
        where: {
            id: id
        },
        data: data,
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

export const deleteUserService = async (filters) => {
    const {id} = filters;
    return await prisma.users.delete({
        where: {
            id: Number(id)
        }
    })
}