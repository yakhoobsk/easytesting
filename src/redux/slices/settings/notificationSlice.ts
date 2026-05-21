import { createSlice } from "@reduxjs/toolkit";
import { NotificationUpdate } from "../../services/settings/notification.service";

interface NotificationState {
    loading: boolean;
    success: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    loading: false,
    success: false,
    error: null
};

const notificationSlice = createSlice({
    name: "Notification",
    initialState,
    reducers: {
        resetNotificationStatus: (state) => {
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(NotificationUpdate.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(NotificationUpdate.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(NotificationUpdate.rejected, (state, action: any) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});

export const { resetNotificationStatus } = notificationSlice.actions;
export default notificationSlice;