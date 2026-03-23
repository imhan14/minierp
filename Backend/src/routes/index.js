import express from "express";
import authRouter from "./authRoutes.js";
import userRouter from "./userRoutes.js";
import teamRouter from "./teamRoutes.js";
import productRouter from "./productRoutes.js";
import roleRouter from "./roleRoutes.js";
import productReportRouter from "./productReportRoutes.js";
import productOrderRouter from "./productOrderRoutes.js";
import ingredientRouter from "./ingredientRoutes.js";
import formulaDetailRouter from "./formulaDetailRoutes.js";
import materialReportRouter from "./materialReportRoutes.js";
import materialDetailRouter from "./materialDetailRoutes.js";
import productReportDetailRouter from "./productReportDetailRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/teams", teamRouter);
router.use("/product", productRouter);
router.use("/role", roleRouter);
router.use("/ingredient", ingredientRouter);
router.use("/product-report", productReportRouter);
router.use("/product-order", productOrderRouter);
router.use("/formula-detail", formulaDetailRouter);
router.use("/material-report", materialReportRouter);
router.use("/material-detail", materialDetailRouter);
router.use("/product-report-detail", productReportDetailRouter);

export default router;
