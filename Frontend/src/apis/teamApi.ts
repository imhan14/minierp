import instance from "./axios";

interface TeamFilters {
  id?: number;
}
const teamApi = {
  getAllTeams: (params?: TeamFilters) => {
    return instance.get("/teams", { params: params });
  },
};

export default teamApi;
