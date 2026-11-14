import express from 'express';
import { login, register } from "../controllers/authController.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validations/user.validation.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", validate(registerSchema), register);

export default router;
