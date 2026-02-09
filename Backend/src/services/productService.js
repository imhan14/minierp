import { prisma } from '../../lib/prisma.ts';

export const getProductsService = async (filters) => {
    const {id, search} = filters;
    return await prisma.products.findMany({
        where:{
            id: id ? Number(id) : undefined,
            OR:[
                {
                    product_name: search ? {
                    contains: search,
                    mode: 'insensitive'
                    } : undefined
                },
                {
                    product_code: search ? {
                    contains: search,
                    mode: 'insensitive'
                    } : undefined
                }
            ]
        }
    });
}

export const createProductService = async (dataProduct) =>{
    const {product_code, product_name, unit, description} = dataProduct;
    return await prisma.products.create({
        data:{
            product_code: Number(product_code),
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
    if(product_code) data.productCode = product_code;
    if(product_name) data.productName = product_name;
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