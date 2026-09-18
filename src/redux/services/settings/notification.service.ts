import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";

interface NotificationPayload {
    event_type: string;
    is_enabled: number;
    recipients: string;
    Environments: string;
}

export const NotificationUpdate = createAsyncThunk(
    "Notification/update",
    async (
        payload: NotificationPayload,
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.put("/ws/rest/Easy/CICD/email/notification", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Notification update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Notification updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Notification update failed");
            return rejectWithValue(
                error.response?.data?.message || "Update failed"
            );
        }
    }
);