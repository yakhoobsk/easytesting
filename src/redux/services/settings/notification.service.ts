import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";

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
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Update failed"
            );
        }
    }
);