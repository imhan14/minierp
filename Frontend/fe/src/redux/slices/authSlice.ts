import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const ROLE_MAP: Record<number, string> = {
    1:	"Administrator",
    2:	"CEO",
    3:	"Deputy Director",
    4:	"Department",
    5:	"Staff",
    6:	"Staff",
    7:	"Test UpdateRole"
}
export interface AuthState{
    id: number,
    username: string,
    full_name: string, 
    role: string
}

const initialState: AuthState = {
    id: 0,
    username: "",
    full_name: "", 
    role: "",
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        authInformation: (state, action: PayloadAction<{id: number, username: string, full_name: string, role: number}>) => {
            state.id = action.payload.id;
            state.full_name = action.payload.username;
            state.username = action.payload.full_name;
            state.role = ROLE_MAP[action.payload.role] || "Unknown Role";
        },
        logout: (state) => {
            // state.id = 0;
            return initialState;
        }
    }
})

export const {authInformation, logout} = authSlice.actions

export default authSlice.reducer