// User
export interface UserFilters {
  role_id?: number;
  id?: number;
  search?: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  full_name: string;
  role_id: number;
}

export interface UpdateUserData {
  username?: string;
  full_name?: string;
  role_id?: number;
  is_active?: boolean;
  old_password?: string;
  new_password?: string;
  team_id?: number;
}

// Auth
export interface JwtPayload {
  id: number;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      users?: {
        id: number;
        role_id: number;
        team_id: number;
      };
    }
  }
}
