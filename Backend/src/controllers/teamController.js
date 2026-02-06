import {createTeamService, deleteTeamService, getTeamsService, updateTeamService} from '../services/teamService.js'

export const getTeams = async (req, res) => {
    const filters ={id: req.query.id? Number(id): undefined};
    const teams = await getTeamsService(filters);
    res.status(200).json(teams);
}

export const createTeam = async (req, res) => {
    const team = await createTeamService(req.body);
    res.status(201).json(team);
}

export const updateTeam = async (req, res) => {
    const team = await updateTeamService(req.params, req.body);
    res.status(200).json(team);
}

export const deleteTeam = async (req, res) => {
    await deleteTeamService(req.params);
    res.status(200).json({message:'Deleted team successful!'});
}