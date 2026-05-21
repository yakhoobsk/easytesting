import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";

export const ResultFetch = createAsyncThunk(
    "result/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/result/fetch", {});
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const OverallResultsFetch = createAsyncThunk(
    "result/overallResults",
    async (_, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/result/overalResults", {});
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);
