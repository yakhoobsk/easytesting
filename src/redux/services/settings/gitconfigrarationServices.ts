import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";

export const GitconfigGet = createAsyncThunk(
    "gitConfig/get",
    async ({ payload, pagination }: { payload: any; pagination: any }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post(urlGenarator("/ws/rest/EasyCICD/Git_Config/Data", pagination), payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);



export const GitConfigCreate = createAsyncThunk(
    "gitConfig/create",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Git_Config/Create", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Profile update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Profile updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Profile update failed");
            return rejectWithValue(error.response?.data?.message || "Profile update failed");
        }
    }
);


export const GitConfigUpdate = createAsyncThunk(
    "gitConfig/update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.put("/ws/rest/EasyCICD/Git_Config/Update", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Profile update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Profile updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Profile update failed");
            return rejectWithValue(error.response?.data?.message || "Profile update failed");
        }
    }
);


export const GitConfigDelete = createAsyncThunk(
    "gitConfig/delete",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Git_Config/Delete", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Profile update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Profile updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Profile update failed");
            return rejectWithValue(error.response?.data?.message || "Profile update failed");
        }
    }
);