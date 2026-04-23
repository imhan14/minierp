import { Request, Response } from "express";
import {
  createTeamService,
  deleteTeamService,
  getTeamsService,
  updateTeamService,
} from "../services/teamService.js";

export const getTeams = async (req: Request, res: Response) => {
  const filters = { id: Number(req.query.id) ?? undefined };
  const teams = await getTeamsService(filters);
  res.status(200).json(teams);
};

export const createTeam = async (req: Request, res: Response) => {
  const team = await createTeamService(req.body);
  res.status(201).json(team);
};

export const updateTeam = async (req: Request, res: Response) => {
  const team = await updateTeamService(Number(req.params.id), req.body);
  res.status(200).json(team);
};

export const deleteTeam = async (req: Request, res: Response) => {
  await deleteTeamService(req.params);
  res.status(200).json({ message: "Deleted team successful!" });
};
