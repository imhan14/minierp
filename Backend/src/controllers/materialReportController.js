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
  const { role_id, team_id: userTeamId } = req.users;
  const { id, search, date, team_id: queryTeamId } = req.query;
  const filters = {
    id: id ? Number(id) : undefined,
    search: search ? search : undefined,
    date: date ? date : undefined,
    team_id: undefined,
  };
  if (role_id >= 7) filters.team_id = Number(userTeamId);
  else filters.team_id = queryTeamId ? Number(queryTeamId) : undefined;

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
