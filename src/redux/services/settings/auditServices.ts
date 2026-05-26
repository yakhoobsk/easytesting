import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";




// export const AuditGet = createAsyncThunk(
//     "Audit/get",
//     async (
//         { payload, pagination }: { payload: any; pagination: any },
//         { rejectWithValue }
//     ) => {
//         try {
//             const response = await boomiApi.post(urlGenarator(`/ws/rest/Easytesting/audit/get_all_logs`, pagination), payload);

//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message || "Fetch failed"
//             );
//         }
//     }
// );


export const AuditGet = createAsyncThunk(
    "Audit/get",
    async (
        { payload, pagination }: { payload: any; pagination: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(urlGenarator("/ws/rest/Easytesting/audit/get_all_logs", pagination), payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);