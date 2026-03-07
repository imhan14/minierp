import { getFormulaDetailService } from "../services/formulaDetailService"

export const getFormulaDetail = async (req, res) =>{
    const filters = {
       formula_id: req.query.formula_id? Number(req.query.formula_id): undefined
    };
    const formulaDetail = await getFormulaDetailService(filters);
    res.status(200).json(formulaDetail);
}