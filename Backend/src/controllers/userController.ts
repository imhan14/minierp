import type { Request, Response } from "express";
import {
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
  getAUserService,
} from "../services/userService";
import catchAsync from "@/utils/catchAsync";
import { UserFilters } from "@/types";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filters: UserFilters = {
    id: req.query.id ? Number(req.query.id) : undefined,
    role_id: req.query.role_id ? Number(req.query.role_id) : undefined,
    search: req.query.search ? String(req.query.search) : undefined,
    orderBy: req.query.orderBy ? String(req.query.orderBy) : undefined,
  };
  const users = await getUsersService(filters);
  res.status(200).json(users);
});

export const getAUser = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) throw new Error("Invalid ID");
  const user = await getAUserService(id);
  if (!user) {
    res.status(404).json({ error: "User unavailable!" });
    return;
  }
  res.status(200).json(user);
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await createUserService(req.body);
  res.status(201).json({ message: "Created successful!", user });
});
// role user thông thường muốn update phải viết thêm 1 controller update riêng cho user
export const updateUserAdmin = async (req: Request, res: Response) => {
  const roleId = req.users?.role_id ? Number(req.users.role_id) : null;
  const ALLOWED_ROLES = [1, 2, 3];
  if (!roleId || !ALLOWED_ROLES.includes(roleId)) {
    return res
      .status(403)
      .json({ message: "Access denied: Your role is not allowed." });
  }

  const id = Number(req.params.id);
  if (isNaN(id)) throw new Error("Invalid params id.");

  if (req.body.role_id !== undefined && isNaN(Number(req.body.role_id))) {
    throw new Error("Invalid role id.");
  }
  const updateData = { ...req.body };
  if (updateData.password && !updateData.new_password) {
    updateData.new_password = updateData.password;
  }
  console.log(req.body); //=================================================
  const user = await updateUserService(id, updateData, roleId);
  res.status(200).json(user);
};

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await deleteUserService(req.params as { id: string });
  res.status(200).json({ message: "Deleted successful!" });
});
