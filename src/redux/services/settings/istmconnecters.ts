import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";


export const ISTMGet = createAsyncThunk(
    "ISTMGet/get",
    async ({ payload }: { payload: any; }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/instance/ticket", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);


export const ISTMCreate = createAsyncThunk("ISTM/create", async ({ payload }: { payload: any }, { rejectWithValue }) => {
    try {
        const response = await boomiApi.post("/ws/rest/Easytesting/ticketinsert/details", payload);

        if (response.data.Response_Status === "Failure") {
            showSnackbar("error", response.data?.UI_Display_Message || "Operation failed");
            return rejectWithValue(response.data);
        } else if (response.data.Response_Status === "Success") {
            showSnackbar("success", response.data?.UI_Display_Message || "Settings saved successfully");
        }
        return response.data;
    } catch (error: any) {
        showSnackbar("error", "Failed to save settings");
        return rejectWithValue(error.response?.data?.message || "Operation failed");
    }
});