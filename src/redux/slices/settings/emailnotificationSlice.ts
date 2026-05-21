import { createSlice } from "@reduxjs/toolkit";
import { EmailnotificatsGet } from "../../services/settings/emailnotificationServices";

interface AuthState {
    loading: boolean;
    emailNotifications: any;
    error: string | null;
}

const initialState: AuthState = {
    loading: false,
    emailNotifications: null,
    error: null
};


const EmailNotificationSlice = createSlice({
    name: "EmailNotification",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(EmailnotificatsGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(EmailnotificatsGet.fulfilled, (state, action) => {
                state.loading = false;
                const data = Array.isArray(action.payload) ? action.payload[0] : action.payload;
                state.emailNotifications = data?.results || [];
            })


            .addCase(EmailnotificatsGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default EmailNotificationSlice;