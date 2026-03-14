import React, { useState } from "react";
import {
  materialReportSchema,
  type MaterialReportDisplay,
} from "../../../schema/materialReport.schema";
import DataTable from "../../../components/DataTable";

const MaterialReportTable = () => {
  const [materialReports, setMaterialReports] = useState<
    MaterialReportDisplay[]
  >([]);
  const columns = [
    { ...materialReportSchema.team_name, width: 100 },
    { ...materialReportSchema.report_date },
    { ...materialReportSchema.shift },
    { ...materialReportSchema.start_time },
    { ...materialReportSchema.end_time },
    { id: "actions", label: "Details" },
  ];

  return <></>;
};

export default MaterialReportTable;
