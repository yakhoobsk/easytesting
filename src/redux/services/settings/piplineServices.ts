import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";


// interface UserCreatePayload {
//     payload: any;
//     // onClose?: () => void;

// }

export const PiplinesGet = createAsyncThunk(
    "Piplines/get",
    async (
        { payload }: { payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Env_Update/get_env_approval", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);



export const environmentUpdate = createAsyncThunk(
    "env/environmentUpdate",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.put("/ws/rest/EasyCICD/Env_Update/data", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Environment update failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Environment updated successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Environment update failed");
            return rejectWithValue(error.response?.data?.message || "Environment update failed");
        }
    }
);