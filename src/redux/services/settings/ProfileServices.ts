import { createAsyncThunk } from "@reduxjs/toolkit";
import { showSnackbar } from "../../../utils/snackbar";
import { boomiApi } from "../commonAxios";

export const UpdatePasswordUser = createAsyncThunk("auth/updatePassword", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await boomiApi.put("/ws/rest/EasyCICD/Password/update", payload);

        if (response.data.Response_Status === "Failure") {
            showSnackbar("error", response?.data?.UI_Display_Message || "Login failed");
        } else if (response.data.Response_Status === "Success") {
            showSnackbar("success", response?.data?.UI_Display_Message || "Login successful");
        }
        return response.data;
    } catch (error: any) {
        showSnackbar("error", error.response?.data?.message || "Login failed");
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
}
);