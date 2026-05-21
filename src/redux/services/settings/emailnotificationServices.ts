import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";

export const EmailNotificationUpdate = createAsyncThunk(
    "emailNotification/update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.put("/ws/rest/Easytesting/emailnotification/update", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Email notification update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Email notification updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Email notification update failed");
            return rejectWithValue(error.response?.data?.message || "Email notification update failed");
        }
    }
);



export const EmailnotificatsGet = createAsyncThunk(
    "mailnotification/get",
    async ({ payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/Emails_Get/details", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const EmailNotificationCreate = createAsyncThunk(
    "emailNotification/create",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/emailnotification/create", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Email notification create failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Email notification created successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Email notification create failed");
            return rejectWithValue(error.response?.data?.message || "Email notification creation failed");
        }
    }
);

