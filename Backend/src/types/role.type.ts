export interface RoleFilters {
  id?: number;
  search?: string;
}

export interface CraeteRoleData {
  role_name: string;
  priority_level: number;
}

export interface UpdateRoleData {
  role_name?: string;
  priority_level?: number;
}
