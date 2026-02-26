import { cancelProductOrderService, confirmProductOrderService, createProductOrderService, deleteProductOrderService, getProductOrderService, updateProductOrderService } from "../services/productOderService";

export const createProductOrder = async (req, res) =>{
    const data = {...req.body, created_by: req.users.id};
    const productOrder = await createProductOrderService(data);
    res.status(201).json(productOrder)
}

export const getProductOrder = async (req, res) =>{
    const filters = {
        id: req.query.id? Number(req.query.id) : undefined
    }
    // console.log(req.users)
    const productOrders = await getProductOrderService(filters);
    res.status(200).json(productOrders);
}

export const updateProductOrder = async (req, res) =>{
    const id = Number(req.params.id);
    const data = {};
    if(req.body.team_id) data.team_id = Number(req.body.team_id);
    if(req.body.product_shift) data.product_shift = req.body.product_shift;
    if(req.body.input_temprature_1) data.input_temprature_1 = req.body.input_temprature_1;
    if(req.body.output_temprature_1) data.output_temprature_1 = req.body.output_temprature_1;
    if(req.body.input_temprature_2) data.input_temprature_2 = req.body.input_temprature_2;
    if(req.body.output_temprature_2) data.output_temprature_2 = req.body.output_temprature_2;
    if(req.body.order_note) data.order_note = req.body.order_note;
    
    const productOrder = await updateProductOrderService(id, data);
    res.status(200).json(productOrder);
}

export const confirmProductOrder = async (req, res) =>{
    const id = Number(req.params.id);
    const productOrder = await confirmProductOrderService(id);
    res.status(200).json(productOrder);
}

export const cancelProductOrder = async (req, res) =>{
    const id = Number(req.params.id);
    const productOrder = await cancelProductOrderService(id);
    res.status(200).json(productOrder);
}

export const deleteProductOrder = async (req, res) =>{
    const id = Number(req.params.id);
    await deleteProductOrderService(id);
    res.status(200).json({message: "Deleted successful!"})
}