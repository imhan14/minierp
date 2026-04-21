import catchAsync from "@/utils/catchAsync.js";
import {
  createIngredientService,
  deleteIngredientService,
  getIngredientsService,
  updateIngredientService,
} from "../services/ingredientService.js";
import { Request, Response } from "express";
import { UpdateIngredientData } from "@/types/ingredient.type.js";

export const createIngredient = async (req: Request, res: Response) => {
  const data = req.body;
  const ingredient = await createIngredientService(data);
  res.status(201).json(ingredient);
};

export const getIngredients = async (req: Request, res: Response) => {
  const { id, search } = req.query;
  const filters: Record<string, unknown> = {
    id: id && !isNaN(Number(id)) ? Number(id) : undefined,
    search: search,
  };
  const ingredients = await getIngredientsService(filters);
  res.status(200).json(ingredients);
};

export const updateIngredient = catchAsync(
  async (req: Request, res: Response) => {
    const data: UpdateIngredientData = {};
    if (req.body.ingredient_code)
      data.ingredient_code = req.body.ingredient_code;
    if (req.body.ingredient_name)
      data.ingredient_name = req.body.ingredient_name;
    if (req.body.unit) data.unit = req.body.unit;
    if (req.body.description) data.description = req.body.description;
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("Invalid ID");
    const ingredient = await updateIngredientService(id, data);
    res.status(200).json(ingredient);
  },
);

export const deleteIngredient = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await deleteIngredientService(id);
  res.status(200).json({ message: "Deleted ingredient successful!" });
};
