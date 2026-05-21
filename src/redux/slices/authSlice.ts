import { createSlice } from "@reduxjs/toolkit";
import { LoginUser } from "../services/authService";
import { removeSecureItem } from "../../utils/webSecureStorage";

interface AuthState {
    loading: boolean;
    auth: any;
    error: string | null;
}

const initialState: AuthState = {
    loading: false,
    auth: null,
    error: null
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth(state: any) {
            state.auth = null;
            state.isLoading = false;
            removeSecureItem('accessToken');
            removeSecureItem('refreshTocken');
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(LoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(LoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.auth = action.payload;
            })

            .addCase(LoginUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default authSlice.reducer;
export const { clearAuth } = authSlice.actions;