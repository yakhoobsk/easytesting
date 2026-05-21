
import { createSlice } from "@reduxjs/toolkit";
import { GitconfigGet } from "../../services/settings/gitconfigrarationServices";

interface gitstateState {
    loading: boolean;
    configGet: any;
    error: string | null;
}

const initialState: gitstateState = {
    loading: false,
    configGet: null,
    error: null
};


const GitconfigSlice = createSlice({
    name: "gitConfig",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(GitconfigGet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(GitconfigGet.fulfilled, (state, action) => {
                state.loading = false;
                state.configGet = action.payload;
            })

            .addCase(GitconfigGet.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default GitconfigSlice;

