import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";


interface ApprovalsCreatePayload {
    payload: any;
    log?: any
}

export const ApprovalsGet = createAsyncThunk(
    "Approvals/get",
    async ({ payload, pagination }: { payload: any; pagination: any }, { rejectWithValue }) => {

        try {
            const response = await boomiApi.post(urlGenarator("/ws/rest/EasyCICD/Approvals/Filter", pagination), payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);


export const ApprovalsUpdate = createAsyncThunk(
    "Approvals/update",
    async (
        { payload }: ApprovalsCreatePayload,
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.put(
                "/ws/rest/EasyCICD/Approved/update",
                payload
            );

            if (response.data.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    response.data?.UI_Display_Message || "Update failed"
                );

                return rejectWithValue(response.data);
            }

            showSnackbar(
                "success",
                response.data?.UI_Display_Message || "Updated successfully"
            );

            return response.data;

        } catch (error: any) {
            showSnackbar(
                "error",
                error?.response?.data?.message || "Update failed"
            );

            return rejectWithValue({
                message: error?.response?.data?.message || error.message,
            });
        }
    }
);



export const ApprovalsPush = createAsyncThunk(
    "Approvals/push",
    async (
        { payload }: ApprovalsCreatePayload,
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(
                "/ws/rest/EasyCICD/Approvals_Create/Create",
                payload
            );

            if (response.data.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    response.data?.UI_Display_Message || "Update failed"
                );
                return rejectWithValue(response.data);
            }
            showSnackbar(
                "success",
                response.data?.UI_Display_Message || "Updated successfully"
            );
            return response.data;

        } catch (error: any) {

            showSnackbar(
                "error",
                error?.response?.data?.message || "Update failed"
            );


            return rejectWithValue({
                message: error?.response?.data?.message || error.message,
            });
        }
    }
);


export const validationGet = createAsyncThunk("get/create", async ({ payload }: any, { rejectWithValue }) => {
    try {

        const response = await boomiApi.post("/ws/rest/EasyCICD/esiticket/create", payload);

        if (response.data.Response_Status === "Failure") {
            showSnackbar("error", response.data?.UI_Display_Message || "Login failed");
        } else if (response.data.Response_Status === "Success") {
            showSnackbar("success", response.data?.UI_Display_Message || "Login successful");

        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
}
);




export const ValidationsUpdate = createAsyncThunk(
    "Approvals/push",
    async (
        { payload }: any,
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(
                "/ws/rest/EasyCICD/Approvals/Status_update",
                payload
            );

            if (response.data.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    response.data?.UI_Display_Message || "Update failed"
                );

                return rejectWithValue(response.data);
            }

            showSnackbar(
                "success",
                response.data?.UI_Display_Message || "Updated successfully"
            );


            return response.data;
        } catch (error: any) {

            showSnackbar(
                "error",
                error?.response?.data?.message || "Update failed"
            );
            return rejectWithValue({
                message: error?.response?.data?.message || error.message,
            });
        }
    }
);



export const PackageCreate = createAsyncThunk(
    "Package/Create",
    async (
        { payload }: any,
        { rejectWithValue }
    ) => {
        try {
            const response = await boomiApi.post(
                "/ws/rest/EasyCICD/packagedeployments/environment",
                payload
            );

            if (response.data.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    response.data?.UI_Display_Message || "Create failed"
                );
                return rejectWithValue(response.data);
            }
            showSnackbar(
                "success",
                response.data?.UI_Display_Message || "Created successfully"
            );
            return response.data;

        } catch (error: any) {

            showSnackbar(
                "error",
                error?.response?.data?.message || "Create failed"
            );


            return rejectWithValue({
                message: error?.response?.data?.message || error.message,
            });
        }
    }
);
