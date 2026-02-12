import { prisma } from '../../lib/prisma.ts';

export const createProductReportService = async (data) =>{
    const {report_date, team_id, furnace, shift, start_time, end_time } = data;
    return await prisma.product_reports.create({
        data:{
            report_date,
            team_id,
            furnace,
            shift,
            start_time,
            end_time
        }
    });
}

export const getProductReportService = async (filters) =>{
    const {id} = filters;
    return await prisma.product_reports.findMany({
        where:{id: id}
    });
}

export const updateProductReportService = async (id, data) =>{

    return await prisma.product_reports.update({
        where: {id:id},
        data:data
    })
}

export const deleteProductReportService = async (id) =>{
    return await prisma.product_reports.delete({
        where:{id:id}
    })
}