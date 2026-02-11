import {createProductService, deleteProductService, getProductsService, updateProductService} from '../services/productService.js'

export const createProduct = async (req, res) =>{
    const product = await createProductService(req.body);
    res.status(201).json(product);
}

export const getProducts = async (req, res) =>{
    const {id, search} = req.query;
    const filters = {
        id: id && !isNaN(Number(id)) ? Number(id) : undefined,
        search: search
    };
    const products = await getProductsService(filters);
    res.status(200).json(products);
}

export const updateProduct = async (req, res) =>{
    const product = await updateProductService(req.params, req.body);
    res.status(200).json(product)
}

export const deleteProduct = async (req, res) =>{
    await deleteProductService(req.params);
    res.status(200).json({message:'Deleted product successful!'});
}