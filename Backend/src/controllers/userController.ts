import type { Request, Response } from "express";
import {
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
  getAUserService,
} from "../services/userService";
import catchAsync from "@/utils/catchAsync";

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    role_id: req.query.role_id ? Number(req.query.role_id) : undefined,
    id: req.query.id ? Number(req.query.id) : undefined,
    search: req.query.search as string | undefined,
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

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const data = {};
  const id = Number(req.params.id);
  if (isNaN(Number(req.body.role_id))) throw new Error("Invalid role id.");
  if (isNaN(Number(req.body.id))) throw new Error("Invalid id.");
  const user = await updateUserService(id, req.body);
  res.status(200).json(user);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await deleteUserService(req.params as { id: string });
  res.status(200).json({ message: "Deleted successful!" });
});
