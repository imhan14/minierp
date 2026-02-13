import { prisma } from '../../lib/prisma.ts';

export const getProductsService = async (filters) => {
    const {id, search} = filters;
    const where = {}
    if(id){
        where.id = id;
    }
    if(search){
        where.OR =[
            {product_code: {contains: search, mode: 'insensitive'}},
            {product_name: {contains: search, mode: 'insensitive'}}
        ]
    }

    return await prisma.products.findMany({
        where: where
    });
}

export const createProductService = async (dataProduct) =>{
    const {product_code, product_name, unit, description} = dataProduct;
    return await prisma.products.create({
        data:{
            product_code,
            product_name,
            unit,
            description
        }
    });
}

export const updateProductService = async (filters, dataProduct) =>{
    const {id} = filters;
    const {product_code, product_name, unit, description} = dataProduct;
    const data ={}
    if(product_code) data.product_code = product_code;
    if(product_name) data.product_name = product_name;
    if(unit) data.unit = unit;
    if(description) data.description = description;
    return await prisma.products.update({
        where:{id:Number(id)},
        data:data
    });
}

export const deleteProductService = async (filters) =>{
    const {id} = filters;
    return await prisma.products.delete({
        where:{id:Number(id)}
    });
}