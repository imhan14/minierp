import {getUsersService, createUserService, updateUserService, deleteUserService, getAUserService} from '../services/userService.js'

export const getUsers = async (req, res) => {
    try{
        const filters = {
            role_id: req.query.role_id ? Number(req.query.role_id): undefined,
            id: req.query.id ? Number(req.query.id) : undefined,
            search: req.query.search
        }
        const users = await getUsersService(filters);
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({error: 'Can not get users!', details: error.message})
    }
}

export const getAUser = async (req, res) =>{
    try{
        const user = await getAUserService(req.params);
        if (!user) {
            return res.status(404).json({ error: 'User unavailable!' });
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json({error: 'Can not get user!', details: error.message})
    }
}

export const createUser = async (req, res) => {
    try{
        const user = await createUserService(req.body);
        res.status(201).json({message: 'Created successful!', user});
    }catch(error){
        if (error.code === 'P2002') {
            return res.status(409).json({ 
                error: 'Username already exists!', 
                details: 'Username already exists! Choose an another username.' 
            });
        }
        res.status(500).json({error: 'Create failed!', details: error.message})
    }
}

export const updateUser = async (req, res) => {
    try{
        const user = await updateUserService(req.params, req.body);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({error: 'Update failed!', details: error.message})
    }
}

export const deleteUser = async (req, res) => {
    try{
        await deleteUserService(req.params);
        res.status(200).json({message:'Deleted successful!'})
    }catch(error){
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found to delete' });
        }
        res.status(500).json({error: 'Delete failed', details: error.message})
    }
}