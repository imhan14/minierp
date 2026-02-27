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
    return await prisma.ingredients.create({
        data:ingredientData
    });
}

export const updateIngredientService = async (id, ingredientData) =>{
    return await prisma.ingredients.update({
        where:{id: id},
        data: ingredientData
    });
}

export const deleteIngredientService = async (id) =>{
    return await prisma.ingredients.delete({
        where:{id}
    });
}