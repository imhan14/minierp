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
    const filters = {id: req.query.id? Number(req.query.id): undefined};
    const role = await updateRoleService(filters, req.bpdy);
    res.status(200).json(role)
}

export const deleteRole = async (req, res) =>{
    const filters = {id: req.query.id? Number(req.query.id): undefined};
    await deleteRoleService(filters); 
    res.status(200).json({message:'Deleted Role successful!'})
}