import instance from "./axios";

interface TeamFilters {
  id?: number;
}
const teamApi = {
  getAllteams: (params?: TeamFilters) => {
    return instance.get("/teams", { params: params });
  },
};

export default teamApi;
