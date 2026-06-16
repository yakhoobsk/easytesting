import { createSlice } from "@reduxjs/toolkit";
import { ComponentDescriptionGet, AiTescases, AiTestCasesDelete } from ".././services/aitestcasesService";

interface AuthState {
    loading: boolean;
    rollback: any;
    error: string | null;
    rollbackdetails?: any;
    componentDescription: any;
}

const initialState: AuthState = {
    loading: false,
    rollback: null,
    error: null,
    rollbackdetails: null,
    componentDescription: null
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
            });
    }
});

export default RollbackSlice;