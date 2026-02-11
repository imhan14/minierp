import {craeteRoleService, deleteRoleService, getRolesService, updateRoleService} from '../services/roleService.js'

export const getRoles = async (req, res) =>{
    const filters = {id: req.query.id? Number(req.query.id): undefined};
    const roles = await getRolesService(filters);
    res.status(200).json(roles)
}

export const createRole = async (req, res) =>{
    const role = await craeteRoleService(req.body)
    res.status(201).json(role);
}

export const updateRole = async (req, res) =>{
    const id = Number(req.params.id);
    if(isNaN(Number(req.params.id)))
        throw new Error("Invalid id.");
    const role = await updateRoleService(id, req.body);
    res.status(200).json(role);
}

export const deleteRole = async (req, res) =>{
        const id = Number(req.params.id);
    if(isNaN(Number(req.params.id)))
        throw new Error("Invalid id.");
    await deleteRoleService(id); 
    res.status(200).json({message:'Deleted Role successful!'})
}