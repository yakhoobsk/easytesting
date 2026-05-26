import { createSlice } from "@reduxjs/toolkit";
import { StatusGet } from "../../services/settings/statusConfigService";

interface AuthState {
    loading: boolean;
    status: any;
    error: string | null;
    rollbackdetails?: any;
}

const initialState: AuthState = {
    loading: false,
    status: null,
    error: null,
    rollbackdetails: null,
};


const StatusSlice = createSlice({
    name: "Status",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(StatusGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(StatusGet.fulfilled, (state, action) => {
                state.loading = false;
                state.status = action.payload;
            })

            .addCase(StatusGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});

export default StatusSlice;