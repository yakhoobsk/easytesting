import { createSlice } from "@reduxjs/toolkit";
import { ComponentDescriptionGet, AiTescases, AiTestCasesDelete, TescasesGet, TestCasesDelete, TestCasesUpdate } from ".././services/aitestcasesService";

interface AuthState {
    loading: boolean;
    rollback: any;
    error: string | null;
    rollbackdetails?: any;
    componentDescription: any;
    testCasesList: any[];
    testCasesListLoading: boolean;
}

const initialState: AuthState = {
    loading: false,
    rollback: null,
    error: null,
    rollbackdetails: null,
    componentDescription: null,
    testCasesList: [],
    testCasesListLoading: false
};


const RollbackSlice = createSlice({
    name: "Rollback",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(ComponentDescriptionGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ComponentDescriptionGet.fulfilled, (state, action) => {
                state.loading = false;
                state.componentDescription = action.payload;
            })

            .addCase(ComponentDescriptionGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(AiTescases.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(AiTescases.fulfilled, (state, action) => {
                state.loading = false;
                state.rollbackdetails = action.payload;
            })

            .addCase(AiTescases.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(AiTestCasesDelete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(AiTestCasesDelete.fulfilled, (state, action) => {
                state.loading = false;
                state.rollbackdetails = action.payload;
            })

            .addCase(AiTestCasesDelete.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(TescasesGet.pending, (state) => {
                state.testCasesListLoading = true;
                state.error = null;
            })

            .addCase(TescasesGet.fulfilled, (state, action) => {
                state.testCasesListLoading = false;
                const results = action.payload?.[0]?.Results || action.payload?.Results || [];
                state.testCasesList = Array.isArray(results) ? results : [];
            })

            .addCase(TescasesGet.rejected, (state, action: any) => {
                state.testCasesListLoading = false;
                state.error = action.payload;
            })

            .addCase(TestCasesDelete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(TestCasesDelete.fulfilled, (state, action) => {
                state.loading = false;
                state.rollbackdetails = action.payload;
            })

            .addCase(TestCasesDelete.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(TestCasesUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(TestCasesUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.rollbackdetails = action.payload;
            })

            .addCase(TestCasesUpdate.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default RollbackSlice;