import { prisma } from '../../lib/prisma.ts';

export const createProductOrderService = async (data) =>{
    return await prisma.product_orders.create({
        data: data
    })
}

export const getProductOrderService = async (filters) =>{
    const {id} = filters;
    return await prisma.product_orders.findMany({
        where:{id:id}
    });
}

export const updateProductOrderService = async (id, data) =>{
    const currentOrder = await prisma.product_orders.findUnique({ where: { id } });
    if(currentOrder.status !== 'pending')
        throw new Error("The current state does not allow data editing!")
    return await prisma.product_orders.update({
        where:{id:id},
        data:data
    });
}

export const confirmProductOrderService = async (id) =>{
    const currentOrder = await prisma.product_orders.findUnique({where:{id}});
    if(currentOrder.status !== 'pending')
        throw new Error("The current state does not allow data editing!");
    return await prisma.product_orders.update({
        where:{id},
        data:{status: "ok"}
    });
}

export const cancelProductOrderService = async (id) =>{
    const currentOrder = await prisma.product_orders.findUnique({where:{id}});
    if(currentOrder.status !== 'pending')
        throw new Error("The current state does not allow data editing!");
    return await prisma.product_orders.update({
        where:{id},
        data:{status: "cancel"}
    });
}

export const deleteProductOrderService = async (id) =>{
    return await prisma.product_orders.delete({
        where:{id:id}
    })
}