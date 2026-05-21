import { createSlice } from "@reduxjs/toolkit";
import { EnvironmentFetch } from "../../services/settings/environmentService";

interface EnvironmentState {
  loading: boolean;
  environments: any[];
  error: string | null;
}

const initialState: EnvironmentState = {
  loading: false,
  environments: [],
  error: null,
};

const environmentSlice = createSlice({
  name: "environment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(EnvironmentFetch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EnvironmentFetch.fulfilled, (state, action) => {
        state.loading = false;
        state.environments = action.payload.Environments || [];
      })
      .addCase(EnvironmentFetch.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default environmentSlice;
