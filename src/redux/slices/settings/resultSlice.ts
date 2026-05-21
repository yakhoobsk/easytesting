import { createSlice } from "@reduxjs/toolkit";
import { ResultFetch, OverallResultsFetch } from "../../services/settings/resultServices";

interface ResultState {
    loading: boolean;
    resultData: any;
    overallResults: any;
    error: string | null;
}

const initialState: ResultState = {
    loading: false,
    resultData: null,
    overallResults: null,
    error: null
};

const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ResultFetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ResultFetch.fulfilled, (state, action) => {
                state.loading = false;
                state.resultData = action.payload;
            })
            .addCase(ResultFetch.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(OverallResultsFetch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(OverallResultsFetch.fulfilled, (state, action) => {
                state.loading = false;
                state.overallResults = action.payload;
            })
            .addCase(OverallResultsFetch.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default resultSlice;
