import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";



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
        { payload, pagination }: { payload: any; pagination: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(urlGenarator("/ws/rest/Easytesting/ExecutionDetails/fetch", pagination), payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const ExecutionCreate = createAsyncThunk(
    "execution/create",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/executionsetup/insert", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Execution create failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Execution created successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Execution create failed");
            return rejectWithValue(error.response?.data?.message || "Execution create failed");
        }
    }
);



export const ComparisonCreate = createAsyncThunk(
    "comparison/create",
    async (responses: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/comparision/results", responses);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Comparison create failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Comparison created successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Comparison create failed");
            return rejectWithValue(error.response?.data?.message || "Comparison create failed");
        }
    }
);
