import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import DataTable from "./DataTable";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import type { OrderDisplay } from "../pages/OrderPage";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

interface PopupDetailType {
  openDetail: boolean;
  selectedOrder: OrderDisplay | null;
  onCloseDetail: () => void;
  orderColumns: string;
}

const PopupDetailFormula = ({
  openDetail,
  selectedOrder,
  onCloseDetail,
}: PopupDetailType) => {
  return (
    <Dialog open={openDetail} onClose={onCloseDetail} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        Details: #{selectedOrder?.id}
        <IconButton onClick={onCloseDetail} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ py: 3 }}>
        <Typography>General</Typography>
        <Divider />
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {/* {orderColumns.map((item) => (
            <Grid key={item.id} size={{ xs: 2, sm: 4, md: 4 }}>
              <Item>
                {item.label}
                <Typography>asd</Typography>
              </Item>
            </Grid>
          ))} */}
        </Grid>
        <Divider />
        {/* <DataTable
            columns={formulaColumns}
            data={formula}
            // actions={actions}
            getRowKey={(row) => row.id}
          /> */}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCloseDetail} color="inherit" variant="outlined">
          Đóng
        </Button>
        {/* <Button
            onClick={() => window.print()}
            variant="contained"
            color="primary"
          >
            In báo cáo
          </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default PopupDetailFormula;
