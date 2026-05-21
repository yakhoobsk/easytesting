import { createSlice } from "@reduxjs/toolkit";
import { BranchNamesGet, foldersGet, processGet, ReviewerGet } from "../../services/settings/branchServices";

interface AuthState {
    loading: boolean;
    branchNames: any;
    error: string | null;
    processes: any;
    folderNames: any;
    reviewerNames: any;
}

const initialState: AuthState = {
    loading: false,
    branchNames: null,
    error: null,
    processes: null,
    folderNames: null,
    reviewerNames: null,
};


const branchSlice = createSlice({
    name: "BranchNames",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(BranchNamesGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(BranchNamesGet.fulfilled, (state, action) => {
                state.loading = false;
                state.branchNames = action.payload;
            })

            .addCase(BranchNamesGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(processGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(processGet.fulfilled, (state, action) => {
                state.loading = false;
                state.processes = action.payload;
            })

            .addCase(processGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(foldersGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(foldersGet.fulfilled, (state, action) => {
                state.loading = false;
                state.folderNames = action.payload;
            })

            .addCase(foldersGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ReviewerGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ReviewerGet.fulfilled, (state, action) => {
                state.loading = false;
                state.reviewerNames = action.payload;
            })

            .addCase(ReviewerGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default branchSlice;