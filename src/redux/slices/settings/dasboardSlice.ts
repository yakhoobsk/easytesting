import { createSlice } from "@reduxjs/toolkit";
import { DashboardGet, ExecutionDetailsFetch } from "../../services/settings/dashboardServices";

interface AuthState {
    loading: boolean;
    dashboard: any;
    executionDetails: any;
    error: string | null;
    "Total Deployments"?: string;
    "Approved Approvals"?: string;
    "Pending Approvals"?: string;
    "Rejected Approvals"?: string;
    "Deployment Success"?: string;
    "This Week Deployment Success"?: string;
}

const initialState: AuthState = {
    loading: false,
    dashboard: null,
    executionDetails: null,
    error: null
};


const DashboardSlice = createSlice({
    name: "Dashboard",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(DashboardGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(DashboardGet.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
            })

            .addCase(DashboardGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            .addCase(ExecutionDetailsFetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ExecutionDetailsFetch.fulfilled, (state, action) => {
                state.loading = false;
                state.executionDetails = action.payload;
            })

            .addCase(ExecutionDetailsFetch.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default DashboardSlice;