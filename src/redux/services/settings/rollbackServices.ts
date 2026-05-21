import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";




export const RollbackGet = createAsyncThunk(
    "Rollback/get",
    async (
        { payload, pagination }: { payload: any; pagination: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(urlGenarator("/ws/rest/EasyCICD/RollBack/Version", pagination), payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const RollbackDetailsGet = createAsyncThunk(
    "RollbackDetails/get",
    async (
        { payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/RollBack/Data", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);




export const RollbackUpdate = createAsyncThunk(
    "rollback/update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.put("/ws/rest/EasyCICD/RollBack/Update", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Rollback update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Rollback updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Rollback update failed");
            return rejectWithValue(error.response?.data?.message || "Rollback update failed");
        }
    }
);
