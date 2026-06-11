import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";




export const BranchNamesGet = createAsyncThunk(
    "BranchNames/get",
    async ({ payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Branch/Get", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const processGet = createAsyncThunk(
    "Process/get",
    async (
        { payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/processnames/fetch", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);



export const foldersGet = createAsyncThunk(
    "Folders/get",
    async (
        { payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/Folders/getdata", payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const ReviewerGet = createAsyncThunk(
    "Reviewer/get",
    async (
        { payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/get_role/data", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);



