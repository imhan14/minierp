import instance from "./axios";

export interface FiltersProps {
  id?: number;
}

const formulaApi = {
  getAllFormula: (filters?: FiltersProps) => {
    return instance.get("/formula", { params: filters });
  },
};

export default formulaApi;
