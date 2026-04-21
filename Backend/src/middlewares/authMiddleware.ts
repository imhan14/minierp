import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyRole } from "../services/authService.js";
import type { JwtPayload } from "../types/index.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "You need to login!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await verifyRole(decoded);
    if (!user || !user.is_active) {
      return res.status(403).json({
        error: "Account not found!",
      });
    }

    req.users = {
      id: decoded.id,
      role_id: user.role_id,
      team_id: user.team_id,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: "Session expire or invalid!" });
  }
};
export const authorize = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoleId = req.users?.role_id;

    if (!userRoleId || !allowedRoles.includes(userRoleId)) {
      return res.status(403).json({
        error: "You have not permission!",
      });
    }

    next();
  };
};
