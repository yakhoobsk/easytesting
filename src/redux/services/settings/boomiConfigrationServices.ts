import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";

export const BoomiConfigCreate = createAsyncThunk(
    "boomiConfig/create",
    async ({ payload }: { payload: any }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/cicd_cred/configure", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Configuration failed");
                return rejectWithValue(response.data);
            }

            showSnackbar("success", response.data?.UI_Display_Message || "Boomi configuration saved successfully");
            return response.data;
        } catch (error: any) {
            showSnackbar("error", error?.response?.data?.message || "Internal server error");
            return rejectWithValue(error.response?.data?.message || "Configuration failed");
        }
    }
);
export const BoomiConfigGet = createAsyncThunk(
    "boomiConfig/get",
    async ({ payload }: { payload: any }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Get_CICD_Cred/", payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);
