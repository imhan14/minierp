import BaseEntityPage from "@/pages/admin/BaseEntityPage";
import {
  CreateRoleSchema,
  RoleSchema,
  UpdateRoleSchema,
  type RoleCreatePayload,
  type RoleType,
  type RoleUpdatePayload,
} from "@/schema/role.schema";
import roleApi from "@/apis/roleApi";
import { roleFilterOptions } from "./utils/roleAndTeam.constants";

const Role = () => (
  <BaseEntityPage<RoleType, RoleCreatePayload, RoleUpdatePayload>
    fetchAll={roleApi.getAllRoles}
    service={{
      create: roleApi.createRole,
      update: roleApi.updateRole,
      delete: roleApi.deleteRole,
    }}
    zodSchema={RoleSchema}
    createSchema={CreateRoleSchema}
    updateSchema={UpdateRoleSchema}
    addButtonLabel="Add new Role"
    addPopupTitle="Thêm Role mới"
    editPopupTitle="Chỉnh sửa Role"
    deleteConfirmMessage={(row) => `Xóa Role "${row.role_name}"?`}
    // fieldWidths={{ Role_code: 130, Role_name: 200, unit: 100 }}
    // disabledOnEdit={["Role_code"]}
    filterOptions={roleFilterOptions}
    messages={{
      createSuccess: "Thêm Role thành công!",
      updateSuccess: "Cập nhật thành công!",
      deleteSuccess: "Xóa thành công!",
    }}
  />
);

export default Role;
