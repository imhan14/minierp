import { useMemo, useState } from "react";
import { Box, Button, Divider, styled, Typography } from "@mui/material";
import { useFormulaForm } from "./customHooks/useFormulaForm";
import DataTable, { type ActionConfig } from "@/components/DataTable";
import DynamicPopup from "@/components/DynamicPopup";
import { useFormulaData } from "./customHooks/useFormulaData";
import FormulaGeneral from "./components/FormulaGeneral";
import { formulaSchema } from "@/schema/formula.schema";
// import type { FieldConfig } from "@/types/FieldConfig";
import type { FormulaDisplay } from "@/types/FormulaType";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import FormulaFiltersUI from "./components/FormulaFiltersUI";
import FormulaDetailList from "./components/FormulaDetailList";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
const FormulaPage = () => {
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedFormula, setSelectedFormula] = useState<FormulaDisplay | null>(
    null,
  );
  const [rowId, setRowId] = useState<number | null>(null);
  const [editGeneral, setEditGeneral] = useState<FormulaDisplay | null>(null);

  const { fetchFormula, formula } = useFormulaData();
  const handleOpenDetail = (row: FormulaDisplay) => {
    setSelectedFormula(row);
    setEditGeneral(row);
    setOpenDetail(true);
    setRowId(row.id);
  };
  const onCreateSuccess = (newFormula: FormulaDisplay) => {
    fetchFormula();
    handleOpenDetail(newFormula);
  };
  const { isSubmitting, handleAddNewReport } = useFormulaForm(onCreateSuccess);

  const formulaColumns = useMemo(
    () => [
      { ...formulaSchema.id, width: 20 },
      { ...formulaSchema.formula_code, width: 70, align: "center" as const },
      { ...formulaSchema.formula_name },
      { ...formulaSchema.is_active, align: "center" as const, width: 90 },
      { ...formulaSchema.product_line, align: "center" as const },
      { ...formulaSchema.specification, align: "center" as const },
      { ...formulaSchema.color, align: "center" as const, width: 80 },
      { ...formulaSchema.type_of_specification, align: "center" as const },
      { id: "actions", label: "Actions" },
    ],
    [],
  );

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setTimeout(() => {
      setSelectedFormula(null);
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
      <FormulaFiltersUI
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
          title={`Formula Code: #${selectedFormula?.formula_code}`}
          // enableSend={true}
        >
          <FormulaGeneral
            selectedFormula={selectedFormula}
            onSaveSuccess={() => fetchFormula()}
            editGeneral={editGeneral}
            onEditGeneral={setEditGeneral}
          />
          <Box>
            <Divider sx={{ my: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                Formular List (Formular)
              </Typography>
            </Divider>

            {/* <Stack spacing={1}>
                <Skeleton variant="rounded" height={600} />
              </Stack> */}
            {selectedFormula && <FormulaDetailList formula_id={rowId} />}
          </Box>
        </DynamicPopup>
      </Box>
    </>
  );
};

export default FormulaPage;
