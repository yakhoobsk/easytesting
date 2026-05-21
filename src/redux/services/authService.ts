import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "./commonAxios";
import { showSnackbar } from "../../utils/snackbar";


interface LoginPayload {
    user_email: string;
    password: string;
}

export const LoginUser = createAsyncThunk("auth/login", async (payload: LoginPayload, { rejectWithValue }) => {
    try {
        const response = await boomiApi.post("/ws/rest/Easytesting/User/login", payload);
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



export const MailValidation = createAsyncThunk(
    "auth/mailValidation",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Verify_Email/get", payload);

            return response.data;
        } catch (error: any) {

            return rejectWithValue(error.response?.data?.message || "validation failed");
        }
    }
);

export const ForgotPassword = createAsyncThunk("auth/forgotPassword", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await boomiApi.put("/ws/rest/Easytesting/Password/Forgot", payload);

        if (response.data.Response_Status === "Failure") {
            showSnackbar("error", response?.data?.UI_Display_Message || "Forgot password failed");
        } else if (response.data.Response_Status === "Success") {
            showSnackbar("success", response?.data?.UI_Display_Message || "Forgot password successful");
        }
        return response.data;
    } catch (error: any) {
        showSnackbar("error", error.response?.data?.message || "Forgot password failed");
        return rejectWithValue(error.response?.data?.message || "Forgot password failed");
    }
}
);

export const UpdatePassword = createAsyncThunk("auth/updatePassword", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await boomiApi.put("/ws/rest/Easytesting/Password/Update", payload);

        if (response.data.Response_Status === "Failure") {
            showSnackbar("error", response?.data?.UI_Display_Message || "Password update failed");
        } else if (response.data.Response_Status === "Success") {
            showSnackbar("success", response?.data?.UI_Display_Message || "Password updated successfully");
        }
        return response.data;
    } catch (error: any) {
        showSnackbar("error", error.response?.data?.message || "Password update failed");
        return rejectWithValue(error.response?.data?.message || "Password update failed");
    }
}
);