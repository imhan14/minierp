import {createIngredientService, deleteIngredientService, getIngredientsService, updateIngredientService} from '../services/ingredientService.js'

export const createIngredient = async (req, res) =>{
    const ingredientData = req.body;
    const ingredient = await createIngredientService(req.body);
    res.status(201).json(ingredient);
}

export const getIngredients = async (req, res) =>{
    const {id, search} = req.query;
    const filters = {
        id: id && !isNaN(Number(id)) ? Number(id) : undefined,
        search: search
    }
    const ingredients = await getIngredientsService(filters);
    res.status(200).json(ingredients);
}

export const updateIngredient = async(req, res)=>{
    const id = Number(req.params.id);
    if (isNaN(id)) throw new Error("Invalid ID");
    const ingredient = await updateIngredientService(id, req.body);
    res.status(200).json(ingredient);
}

export const deleteIngredient = async(req, res) =>{
    await deleteIngredientService(req.params);
    res.status(200).json({message:'Deleted ingredient successful!'});
}