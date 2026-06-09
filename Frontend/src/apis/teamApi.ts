import instance from "./axios";

interface TeamFilters {
  id?: number;
}
export interface TeamData {
  team_name?: string;
}
const teamApi = {
  getAllTeams: (params?: TeamFilters) => {
    return instance.get("/teams", { params: params });
  },
  createTeam: (data: TeamData) => {
    return instance.post("/teams", data);
  },
  updateTeam: (id: number, data: TeamData) => {
    return instance.patch(`/teams/${id}`, data);
  },
  deleteTeam: (id: number) => {
    return instance.delete(`/teams/${id}`);
  },
};

export default teamApi;
