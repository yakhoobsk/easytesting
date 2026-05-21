import { createSlice } from "@reduxjs/toolkit";
import { RollbackDetailsGet, RollbackGet } from "../../services/settings/rollbackServices";

interface AuthState {
    loading: boolean;
    rollback: any;
    error: string | null;
    rollbackdetails?: any;
}

const initialState: AuthState = {
    loading: false,
    rollback: null,
    error: null,
    rollbackdetails: null,
};


const RollbackSlice = createSlice({
    name: "Rollback",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(RollbackGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(RollbackGet.fulfilled, (state, action) => {
                state.loading = false;
                state.rollback = action.payload;
            })

            .addCase(RollbackGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(RollbackDetailsGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(RollbackDetailsGet.fulfilled, (state, action) => {
                state.loading = false;
                state.rollbackdetails = action.payload;
            })

            .addCase(RollbackDetailsGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default RollbackSlice;