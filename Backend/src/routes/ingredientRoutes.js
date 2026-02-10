import express from 'express'
import { validate } from "../middlewares/validate.middleware";
import { updateIngredientSchema } from "../validations/ingredient.validation";
import {updateIngredient} from '../controllers/ingredientController'

const router = express.Router();

router.patch('/:id',  validate(updateIngredientSchema),updateIngredient);

export default router;