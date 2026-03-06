import { prisma } from '../../lib/prisma.ts';
import dayjs from 'dayjs';

export const createProductOrderService = async (data) =>{
    return await prisma.product_orders.create({
        data: data
    })
}

export const getProductOrderService = async (filters) =>{
    const {id, date, search} = filters;
    let dateFilter = {};
    if (date) {
        const startOfDay = dayjs(date).startOf('day').toDate();
        const endOfDay = dayjs(date).endOf('day').toDate();
        dateFilter = {
            gte: startOfDay,
            lte: endOfDay
        };
    }
    return await prisma.product_orders.findMany({
        where:{
            ...(id && { id: id }),
            ...(date && { order_date: dateFilter }),
        },
        select:{
            id                 :true,
            order_date         :true,
            formula_id         :true,
            teams              :{select:{team_name:true}},
            product_shift      :true,
            target_quantity    :true,
            urea_rate          :true,
            status             :true,
            input_temprature_1 :true,
            output_temprature_1:true,
            input_temprature_2 :true,
            output_temprature_2:true,
            order_note         :true,
            created_at         :true,
            created_by         :true
        }
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