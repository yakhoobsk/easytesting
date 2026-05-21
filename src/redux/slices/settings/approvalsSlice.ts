
import { createSlice } from "@reduxjs/toolkit";
import { ApprovalsGet } from "../../services/settings/approvalsServices";

interface approvalsState {
    loading: boolean;
    approvals: any;
    error: string | null;
}

const initialState: approvalsState = {
    loading: false,
    approvals: null,
    error: null
};


const ApprovalsSlice = createSlice({
    name: "approvals",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(ApprovalsGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ApprovalsGet.fulfilled, (state, action) => {
                state.loading = false;
                state.approvals = action.payload;
            })

            .addCase(ApprovalsGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default ApprovalsSlice;

