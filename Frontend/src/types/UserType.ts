import type { RoleType } from "./RoleType";
export interface UserType {
  id: number;
  username: string;
  password: string;
  fullname: string;
  role_id: RoleType;
  created_at: string;
  is_active: boolean;
}
