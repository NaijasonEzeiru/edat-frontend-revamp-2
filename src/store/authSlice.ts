import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { jwtDecode } from "jwt-decode";

export interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  role: string | null;
  user_id: number | null;
  user_name: string;
  licence_expiry: string;
  is_parent: boolean;
  exp: number;
  email: string | null;
  org_code: number | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: "",
  role: "",
  user_id: null,
  email: "",
  user_name: "",
  licence_expiry: "",
  is_parent: false,
  exp: 0,
  org_code: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state = Object.assign(state, action.payload);
      state.isLoggedIn = true;
    },

    login(state, action: PayloadAction<{ username: string; role: string }>) {
      const { username, role } = action.payload;
      state.isLoggedIn = true;
      state.username = username;
      state.role = role;
    },
    logout(state) {
      console.log("logoutStore");
      state = initialState;
    },
    loadAuthState(state) {
      const edatToken = localStorage.getItem("edat_token");
      if (edatToken) {
        const _token = jwtDecode<typeof state>(edatToken);
        if (_token.exp < new Date() / 1000) {
          state.isLoggedIn = false;
        } else {
          state = Object.assign(state, _token);
          state.isLoggedIn = true;
          localStorage.setItem("isAuthenticated", "true");
        }
      } else {
        state.isLoggedIn = false;
      }
    },
  },
});

export const { setAuthState, login, logout, loadAuthState } = authSlice.actions;

export const selectAuthState = (state: AppState) => state.auth;
export const isLoggedIn = (state: AppState) => state.auth.isLoggedIn;

export default authSlice.reducer;
