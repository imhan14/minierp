import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyUser } from "../services/authService.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await verifyUser(username);
  if (!user) return res.status(401).json({ error: "Sai tên đăng nhập" });

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) return res.status(401).json({ error: "Sai mật khẩu" });
  const token = jwt.sign(
    { id: user.id, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  res.json({
    message: "Đăng nhập thành công",
    token,
    user: {
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role_id,
      team_id: user.team_id,
    },
  });
};
