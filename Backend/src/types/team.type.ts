export interface TeamFilters {
  id?: number;
  search?: string;
  team_name?: string;
  user_id?: number;
}

export interface CreateTeamData {
  team_name: string;
  user_id: number;
}

export interface UpdateTeamData {
  team_name?: string;
  user_id?: number;
}
