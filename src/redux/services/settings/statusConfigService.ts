import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";




export const StatusGet = createAsyncThunk(
    "Status/get",
    async (
        _: any,
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/statusconfig/detail");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);



export const StatusUpdate = createAsyncThunk(
    "status/update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/Configuration/statusfetch", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Status update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Status updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Status update failed");
            return rejectWithValue(error.response?.data?.message || "Status update failed");
        }
    }
);
