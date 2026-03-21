import {
  createMaterialReportService,
  getMaterialReportService,
  updateMaterialReportService,
} from "../services/materialReportService";

export const createMaterialReport = async (req, res) => {
  var fields = ["team_id", "report_date"];
  let createData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      createData[field] = req.body[field];
    }
  });
  const materialReport = await createMaterialReportService(createData);
  res.status(201).json(materialReport);
};

export const getMaterialReport = async (req, res) => {
  const filters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    date: req.query.date ? req.query.date : undefined,
  };
  const materialReports = await getMaterialReportService(filters);

  res.status(200).json(materialReports);
};

export const updateMaterialReport = async (req, res) => {
  const id = Number(req.params.id);
  const fields = [
    "team_id",
    "report_date",
    "foreman_check",
    "start_time",
    "end_time",
    "extral_materials",
    "shift",
  ];
  let updateData = {};
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const materialReport = await updateMaterialReportService(id, updateData);
  res.status(200).json(materialReport);
};
