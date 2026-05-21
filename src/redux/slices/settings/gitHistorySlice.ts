
import { createSlice } from "@reduxjs/toolkit";
import { ComponentXMLGet, DeploymentHistoryGet, GitHistoryGet, GitValidationsGet, PiplensresponceGet, UpdatedComponentXMLGet } from "../../services/settings/gitHistoryServices";

interface gitstateState {
    loading: boolean;
    history: any;
    error: string | null;
    validations?: any;
    componentxml?: any;
    updatexml?: any;
    Piplensresponce?: any;
    deploymentHistory: any;
}

const initialState: gitstateState = {
    loading: false,
    history: null,
    error: null,
    validations: null,
    componentxml: null,
    updatexml: null,
    Piplensresponce: null,
    deploymentHistory: null,
};


const GithistorySlice = createSlice({
    name: "history",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(GitHistoryGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(GitHistoryGet.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })

            .addCase(GitHistoryGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpdatedComponentXMLGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(UpdatedComponentXMLGet.fulfilled, (state, action) => {
                state.loading = false;
                state.updatexml = action.payload;
            })

            .addCase(UpdatedComponentXMLGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(ComponentXMLGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ComponentXMLGet.fulfilled, (state, action) => {
                state.loading = false;
                state.componentxml = action.payload;
            })

            .addCase(ComponentXMLGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(GitValidationsGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(GitValidationsGet.fulfilled, (state, action) => {
                state.loading = false;
                state.validations = action.payload;
            })

            .addCase(GitValidationsGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(PiplensresponceGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(PiplensresponceGet.fulfilled, (state, action) => {
                state.loading = false;
                state.Piplensresponce = action.payload;
            })

            .addCase(PiplensresponceGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(DeploymentHistoryGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(DeploymentHistoryGet.fulfilled, (state, action) => {
                state.loading = false;
                state.deploymentHistory = action.payload;
            })

            .addCase(DeploymentHistoryGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default GithistorySlice;

