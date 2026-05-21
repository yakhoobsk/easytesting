import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";

interface pagnation {
    limit: number;
    page: number;
}


export const AuditGet = createAsyncThunk(
    "Audit/get",
    async (
        { Payload, pagnation }: { Payload: any; pagnation: pagnation },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(urlGenarator(`/ws/rest/Easytesting/audit/get_all_logs`, pagnation), Payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

