import { prisma } from '../../lib/prisma.ts';

export const getIngredientsService = async (filters) =>{
    const {id} = filters;
    return await prisma.ingredients.findMany({
        where:{
            id: id? Number(id) : undefined
        }
    });
}

export const createIngredientService = async (ingredientData) =>{
    const {ingredient_code, ingredient_name, unit, description} = ingredientData;
    return await prisma.ingredients.create({
        data:{
            ingredient_code: Number(ingredient_code), 
            ingredient_name, 
            unit, 
            description
        }
    });
}

export const updateIngredientService = async (id, ingredientData) =>{
    const {ingredient_code, ingredient_name, unit, description} = ingredientData;
    const data = {};
    if(ingredient_code) data.ingredientCode = Number(ingredient_code);
    if(ingredient_name) data.ingredientName = ingredient_name;
    if(unit) data.unit = unit;
    if(description) data.description = description;
    return await prisma.ingredients.update({
        where:{id: id},
        data: data
    });
}
export const deleteIngredientService = async (filters) =>{
const {id} = filters;
    return await prisma.ingredients.delete({
        where:{id:Number(id)}
    });
}