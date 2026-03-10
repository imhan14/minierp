import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
const localSavedUser = JSON.parse(localStorage.getItem("user") || "{}");

const ROLE_MAP: Record<number, string> = {
  1: "Administrator",
  2: "CEO",
  3: "Deputy Director",
  4: "Department",
  5: "Staff",
  6: "Staff",
  7: "Test UpdateRole",
};
export interface AuthState {
  id: number;
  username: string;
  full_name: string;
  role: string;
}

const initialState: AuthState = {
  id: localSavedUser.id || 0,
  username: localSavedUser.username || "",
  full_name: localSavedUser.full_name || "",
  role: ROLE_MAP[localSavedUser.role] || "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authInformation: (
      state,
      action: PayloadAction<{
        id: number;
        username: string;
        full_name: string;
        role: number;
      }>,
    ) => {
      state.id = action.payload.id;
      state.full_name = action.payload.username;
      state.username = action.payload.full_name;
      state.role = ROLE_MAP[action.payload.role] || "Unknown Role";
    },
    logout: (state) => {
      // state.id = 0;
      return initialState;
    },
  },
});

export const { authInformation, logout } = authSlice.actions;

export default authSlice.reducer;
