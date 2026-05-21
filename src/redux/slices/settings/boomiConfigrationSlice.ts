import { createSlice } from "@reduxjs/toolkit";
import { BoomiConfigGet } from "../../services/settings/boomiConfigrationServices";

interface BoomiConfigState {
    loading: boolean;
    config: any;
    error: string | null;
    fetchedConfig: any;
}

const initialState: BoomiConfigState = {
    loading: false,
    config: null,
    error: null,
    fetchedConfig: null,
};

const BoomiConfigSlice = createSlice({
    name: "boomiConfig",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(BoomiConfigGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(BoomiConfigGet.fulfilled, (state, action) => {
                state.loading = false;
                state.fetchedConfig = action.payload;
            })
            .addCase(BoomiConfigGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default BoomiConfigSlice;
