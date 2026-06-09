import { ACTIVE_OPTIONS } from "@/pages/formula/utils/formula.constant";
import type { UserType } from "@/schema/user.schema";
import type { FieldConfig } from "@/types/FieldConfig";
import { renderBadge } from "@/utils/render";

export const USER_FIELD_CONFIGS: Partial<
  Record<keyof UserType, FieldConfig<UserType>>
> = {
  id: {
    id: "id",
    label: "id",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  username: {
    id: "username",
    label: "username",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  new_password: {
    id: "new_password",
    label: "Mật khẩu mới",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    // isReadOnly: true,
    // required: true,
  },
  full_name: {
    id: "full_name",
    label: "Full Name",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  role_id: {
    id: "role_id",
    label: "Role Id",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
    required: true,
  },
  role_name: {
    id: "role_name",
    label: "Role Name",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  is_active: {
    id: "is_active",
    label: "Trạng thái",
    inputType: "select",
    options: ACTIVE_OPTIONS,
    gridSize: { xs: 12, sm: 6 },
    render: (value) => renderBadge(value, ACTIVE_OPTIONS),
  },
  team_id: {
    id: "team_id",
    label: "Team ID",
    inputType: "number",
    gridSize: { xs: 12, sm: 6 },
  },
  team_name: {
    id: "team_name",
    label: "Team name",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
  },
  created_at: {
    id: "created_at",
    label: "Ngày tạo",
    inputType: "text",
    gridSize: { xs: 12, sm: 6 },
    isReadOnly: true,
  },
};

/** DataTable */
export const USER_TABLE_FIELDS: (keyof UserType)[] = [
  "id",
  "username",
  "full_name",
  "is_active",
  "role_name",
  "team_name",
];

/** Add New */
export const USER_ADD_FIELDS: (keyof UserType)[] = [
  "team_id",
  "role_id",
  "username",
  "new_password",
  "full_name",
];

/** Edit */
export const USER_EDIT_FIELDS: (keyof UserType)[] = [
  "team_id",
  "role_id",
  "username",
  "new_password",
  "full_name",
  "is_active",
];
