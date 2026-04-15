import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import Filters from "../../components/Filters";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  styled,
  Typography,
} from "@mui/material";
import { useFormulaForm } from "./customHooks/useFormulaForm";
import DataTable, { type ActionConfig } from "@/components/DataTable";
import DynamicPopup from "@/components/DynamicPopup";
import { useFormulaData } from "./customHooks/useFormulaData";
import FormulaGeneral from "./components/FormulaGeneral";
import { formulaSchema } from "@/schema/formula.schema";
import type { FieldConfig } from "@/types/FieldConfig";
import type { FormulaDisplay } from "@/types/FormulaType";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FormulaFilters from "./components/FormulaFilters";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const FormulaPage = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<FormulaDisplay | null>(null);
  const [rowId, setRowId] = useState<number | null>(null);
  const [editGeneral, setEditGeneral] = useState<FormulaDisplay | null>(null);

  const { fetchFormula, formula } = useFormulaData();
  const onCreateSuccess = (newFormula: FormulaDisplay) => {
    fetchFormula(); // Load lại danh sách table
    handleOpenDetail(newFormula); // Tự động mở popup để người dùng nhập tiếp
  };
  const { isSubmitting, handleAddNewReport } = useFormulaForm(fetchFormula);

  const formulaColumns = useMemo(
    () => [
      {
        ...formulaSchema.id,
        width: 20,
      },
      { ...formulaSchema.formula_code, width: 70 },
      { ...formulaSchema.formula_name },
      { ...formulaSchema.is_active, align: "center" as const, width: 70 },
      { ...formulaSchema.product_line, align: "center" as const },
      { ...formulaSchema.specification, align: "center" as const },
      { ...formulaSchema.color, align: "center" as const, width: 70 },
      { ...formulaSchema.type_of_specification, align: "center" as const },
      { id: "actions", label: "Actions" },
    ],
    [],
  );

  const handleOpenDetail = (row: FormulaDisplay) => {
    setSelectedMaterial(row);
    setEditGeneral(row);
    setOpenDetail(true);
    setRowId(row.id);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setTimeout(() => {
      setSelectedMaterial(null);
    }, 300);
  };

  const actions = (): ActionConfig<FormulaDisplay>[] => {
    return [
      {
        label: "Details",
        color: "primary",
        icon: <RemoveRedEyeOutlinedIcon />,
        onClick: (row) => handleOpenDetail(row),
      },
    ];
  };

  return (
    <>
      <DrawerHeader />
      <FormulaFilters
        onFilterChange={(newFilters) => fetchFormula(newFilters)}
      />
      <Box>
        {!isSubmitting && (
          <Button
            variant="contained"
            sx={{ marginBottom: 1 }}
            onClick={handleAddNewReport}
          >
            Add new Formula
          </Button>
        )}

        <DataTable
          columns={formulaColumns}
          data={formula}
          actions={actions}
          getRowKey={(row) => row.id}
        />

        <DynamicPopup
          open={openDetail}
          onClose={handleCloseDetail}
          title={`Formula Code: #${selectedMaterial?.formula_code}`}
          // enableSend={true}
        >
          <FormulaGeneral
            selectedFormula={selectedMaterial}
            onSaveSuccess={() => fetchFormula()}
            editGeneral={editGeneral}
            onEditGeneral={setEditGeneral}
          />
          <Divider sx={{ my: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Ingredient List (Editable)
            </Typography>
          </Divider>
          {/* <MaterialDetailList material_id={rowId} /> */}
        </DynamicPopup>
      </Box>
    </>
  );
};

export default FormulaPage;
