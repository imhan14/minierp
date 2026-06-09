import type { UserType } from "@/schema/user.schema";
import instance from "./axios";

export interface UserFilters {
  id?: number;
  role_d?: number;
  search?: string;
  orderBy?: string;
}

export interface UserData {
  username?: string;
  new_password?: string;
  full_name?: string;
  role_id?: number;
  is_active?: boolean;
  team_id?: number;
}

const userApi = {
  getAllUsers: async (params?: UserFilters) => {
    const res = await instance.get("/users", { params });
    return {
      ...res,
      data: res.data.map((item: UserType) => ({
        ...item,
        team_id: item.teams?.id,
        team_name: item.teams?.team_name,
        role_id: item.roles?.id,
        role_name: item.roles?.role_name,
      })),
    };
  },
  createUser: (data: UserData) => {
    return instance.post("/users", data);
  },
  updateUser: (id: number, data: UserData) => {
    return instance.patch(`/users/${id}`, data);
  },
  deleteUser: (id: number) => {
    return instance.delete(`/users/${id}`);
  },
};

export default userApi;
