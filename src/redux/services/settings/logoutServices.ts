import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";

export const Logout = createAsyncThunk(
    "logout/create",
    async ({ payload, navigate, clearAuthAction }: any, { dispatch, rejectWithValue }) => {
        try {
            const response = await boomiApi.post(
                "/ws/rest/Easytesting/User/logout",
                payload
            );

            const isSuccess = response.data.Response_Status === "Success";

            if (!isSuccess) {
                showSnackbar("error", response.data?.UI_Display_Message || "Logout failed");
                return rejectWithValue("Logout failed");
            }

            showSnackbar("success", response.data?.UI_Display_Message || "Logged out");

            dispatch(clearAuthAction());
            localStorage.clear();
            navigate("/login");

            return response.data;

        } catch (error: any) {

            showSnackbar("error", "Logout failed");

            return rejectWithValue(error);
        }
    }
);