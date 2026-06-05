import Joi from "joi";

export const createTeamchema = Joi.object({
  team_name: Joi.string().min(1).max(100).required(),
});

export const updateTeamchema = Joi.object({
  team_name: Joi.string().min(1).max(100).optional(),
});
