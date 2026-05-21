import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";



export const DashboardGet = createAsyncThunk(
    "Dashboard/get",
    async (_: any
        , { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/dashboard/get", {});
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const ExecutionDetailsFetch = createAsyncThunk(
    "ExecutionDetails/fetch",
    async (
        { payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/ExecutionDetails/fetch", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);