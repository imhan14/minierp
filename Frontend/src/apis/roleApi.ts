import instance from "./axios";

interface RoleFilters {
  id?: number;
}
export interface RoleData {
  role_name?: string;
  priority_level?: number;
}
const roleApi = {
  getAllRoles: (params?: RoleFilters) => {
    return instance.get("/role", { params: params });
  },
  createRole: (data: RoleData) => {
    return instance.post("/role", data);
  },
  updateRole: (id: number, data: RoleData) => {
    return instance.patch(`/role/${id}`, data);
  },
  deleteRole: (id: number) => {
    return instance.delete(`/role/${id}`);
  },
};

export default roleApi;
