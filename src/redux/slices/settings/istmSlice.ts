import { createSlice } from "@reduxjs/toolkit";
import { ISTMGet, ISTMCreate } from "../../services/settings/istmconnecters";

interface AuthState {
    loading: boolean;
    Istm: any;
    error: string | null;
}

const initialState: AuthState = {
    loading: false,
    Istm: null,
    error: null
};


const IstmSlice = createSlice({
    name: "Istm",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(ISTMGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(ISTMGet.fulfilled, (state, action) => {
                state.loading = false;
                state.Istm = action.payload;
            })

            .addCase(ISTMGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(ISTMCreate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ISTMCreate.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(ISTMCreate.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default IstmSlice;