import instance from "./axios";

interface RoleFilters {
  id?: number;
}
const roleApi = {
  getAllRoles: (params?: RoleFilters) => {
    return instance.get("/role", { params: params });
  },
};

export default roleApi;
