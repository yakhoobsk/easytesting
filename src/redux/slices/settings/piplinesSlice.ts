import { createSlice } from "@reduxjs/toolkit";
import { PiplinesGet } from "../../services/settings/piplineServices";

interface AuthState {
    loading: boolean;
    piplines: any;
    error: string | null;
}

const initialState: AuthState = {
    loading: false,
    piplines: null,
    error: null
};


const piplinesSlice = createSlice({
    name: "Piplines",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(PiplinesGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(PiplinesGet.fulfilled, (state, action) => {
                state.loading = false;
                state.piplines = action.payload;
            })

            .addCase(PiplinesGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default piplinesSlice;