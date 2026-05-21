import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";

export const EnvironmentFetch = createAsyncThunk(
  "environment/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await boomiApi.post(
        "/ws/rest/Easytesting/Environment/Fetch"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Environment fetch failed"
      );
    }
  }
);
