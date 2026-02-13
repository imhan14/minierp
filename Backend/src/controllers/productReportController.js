import { createProductReportService, deleteProductReportService, getProductReportService, updateProductReportService } from "../services/productReportService";

export const createProductReport = async (req, res) =>{
    const productReport = createProductReportService(req.body);
    res.status(201).json(productReport);
}