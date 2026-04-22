export interface MaterialDetailFilters {
  id?: number;
  material_id?: number;
  ingredient_id?: number;
  weight?: number;
  real_percent?: number;
  search?: string;
}

export interface CreateMaterialDetailData {
  material_id: number;
  ingredient_id?: number;
  weight?: number;
  real_percent?: number;
}

export interface UpdateMaterialDetailData {
  material_id?: number;
  ingredient_id?: number;
  weight?: number;
  real_percent?: number;
  note?: string;
}
