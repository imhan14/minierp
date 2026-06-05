import BaseEntityPage from "@/pages/admin/BaseEntityPage";
import {
  CreateTeamSchema,
  TeamSchema,
  UpdateTeamSchema,
  type TeamCreatePayload,
  type TeamType,
  type TeamUpdatePayload,
} from "@/schema/team.schema";
import teamApi from "@/apis/teamApi";
import { teamFilterOptions } from "./utils/roleAndTeam.constants";

const Team = () => (
  <BaseEntityPage<TeamType, TeamCreatePayload, TeamUpdatePayload>
    fetchAll={teamApi.getAllTeams}
    service={{
      create: teamApi.createTeam,
      update: teamApi.updateTeam,
      delete: teamApi.deleteTeam,
    }}
    zodSchema={TeamSchema}
    createSchema={CreateTeamSchema}
    updateSchema={UpdateTeamSchema}
    addButtonLabel="Add new Team"
    addPopupTitle="Thêm Team mới"
    editPopupTitle="Chỉnh sửa Team"
    deleteConfirmMessage={(row) => `Xóa Team "${row.team_name}"?`}
    // fieldWidths={{ Team_code: 130, Team_name: 200, unit: 100 }}
    // disabledOnEdit={["Team_code"]}
    filterOptions={teamFilterOptions}
    messages={{
      createSuccess: "Thêm Team thành công!",
      updateSuccess: "Cập nhật thành công!",
      deleteSuccess: "Xóa thành công!",
    }}
  />
);

export default Team;
