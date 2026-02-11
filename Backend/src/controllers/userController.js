import {getUsersService, createUserService, updateUserService, deleteUserService, getAUserService} from '../services/userService.js'

export const getUsers = async (req, res) => {
        const filters = {
            role_id: req.query.role_id ? Number(req.query.role_id): undefined,
            id: req.query.id ? Number(req.query.id) : undefined,
            search: req.query.search
        }
        const users = await getUsersService(filters);
        res.status(200).json(users);
}

export const getAUser = async (req, res) =>{
        const id = Number(req.params.id);
        if (isNaN(id)) throw new Error("Invalid ID");
        const user = await getAUserService(id);
        if (!user) {
            return res.status(404).json({ error: 'User unavailable!' });
        }
        res.status(200).json(user)
}

export const createUser = async (req, res) => {
        const user = await createUserService(req.body);
        res.status(201).json({message: 'Created successful!', user});
}

export const updateUser = async (req, res) => {
        const id = Number(req.params.id);
        if(isNaN(Number(req.body.role_id)))
                throw new Error("Invalid role id.");
        if(isNaN(Number(req.body.id)))
                throw new Error("Invalid id.");
        const user = await updateUserService(id, req.body);
        res.status(200).json(user);
}

export const deleteUser = async (req, res) => {
        await deleteUserService(req.params);
        res.status(200).json({message:'Deleted successful!'})
}