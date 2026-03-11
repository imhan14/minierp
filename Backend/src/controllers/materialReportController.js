import {
  createMaterialReportService,
  getMaterialReportService,
  updateMaterialReportService,
} from "../services/materialReportService";

export const createMaterialReport = async (req, res) => {
  const materialReport = await createMaterialReportService(req.body);
  res.status(201).json(materialReport);
};

export const getMaterialReport = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
  };
  const materialReports = await getMaterialReportService(filters);
  res.status(200).json(materialReports);
};

export const updateMaterialReport = async (req, res) => {
  const id = Number(req.params.id);
  var data = {};
  // if(req.body.team_id) data.team_id = Number(req.body.team_id);
  // if(req.body.report_date) data.report_date = req.body.report_date;
  if (req.body.foreman_check) data.foreman_check = req.body.foreman_check;
  if (req.body.start_time) data.start_time = req.body.start_time;
  if (req.body.end_time) data.end_time = req.body.end_time;
  if (req.body.extral_materials)
    data.extral_materials = req.body.extral_materials;
  console.log(data);
  const materialReport = await updateMaterialReportService(id, data);
  res.status(200).json(materialReport);
};
