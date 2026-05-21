import { createSlice } from "@reduxjs/toolkit";
import { AuditGet } from "../../services/settings/auditServices";

interface AuthState {
    loading: boolean;
    audit: any;
    error: string | null;
}

const initialState: AuthState = {
    loading: false,
    audit: null,
    error: null
};


const AuditSlice = createSlice({
    name: "Audit",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(AuditGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(AuditGet.fulfilled, (state, action) => {
                state.loading = false;
                state.audit = action.payload;
            })

            .addCase(AuditGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default AuditSlice;