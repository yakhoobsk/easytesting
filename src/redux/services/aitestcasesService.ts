import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi } from "./commonAxios";
// import { showSnackbar } from "../../../utils/snackbar";
import { showSnackbar } from "../../utils/snackbar";
import axios from "axios";

export const AiTestCasesCreate = createAsyncThunk(
    "AiTestCases/create",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/TestCase/Create", payload);

            if (response.data.Response_Status === "Failure") {
                showSnackbar("error", response.data?.UI_Display_Message || "Email notification create failed");
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar("success", response.data?.UI_Display_Message || "Email notification created successfully");
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Email notification create failed");
            return rejectWithValue(error.response?.data?.message || "Email notification creation failed");
        }
    }
);

export const AiTestCasesUpdate = createAsyncThunk(
    "AiTestCases/update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.put(
                "/ws/rest/Easytesting/TestCase/TestCase_update",
                payload
            );

            if (response.data.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    response.data?.UI_Display_Message || "Test case update failed"
                );
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar(
                    "success",
                    response.data?.UI_Display_Message || "Test case updated successfully"
                );
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Test case update failed");
            return rejectWithValue(
                error.response?.data?.message || "Test case update failed"
            );
        }
    }
);

export const AiTestCasesDelete = createAsyncThunk(
    "AiTestCases/delete",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.delete(
                "/ws/rest/Easytesting/TestCase/Delete",
                payload
            );

            if (response.data.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    response.data?.UI_Display_Message || "Test case delete failed"
                );
                return rejectWithValue(response.data);
            } else if (response.data.Response_Status === "Success") {
                showSnackbar(
                    "success",
                    response.data?.UI_Display_Message || "Test case deleted successfully"
                );
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Test case delete failed");
            return rejectWithValue(
                error.response?.data?.message || "Test case delete failed"
            );
        }
    }
);

export const ComponentDescriptionGet = createAsyncThunk(
    "/ComponentDesc/ComponentDescription",
    async (payload: any
        , { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/ws/rest/ComponentDesc/ComponentDescription/POST", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const AiTescases = createAsyncThunk(
    "/AiTestCases/GeneratingAllTestCases",
    async (payload: any
        , { rejectWithValue }) => {

        try {
            const response = await axios.post("http://localhost:5000/api/test-cases/generate", payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const TescasesGet = createAsyncThunk(
    "/TestCases/Get",
    async (payload: any
        , { rejectWithValue }) => {

        try {
            const response = await boomiApi.post("/ws/rest/Easytesting/TestCase/get", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fetch failed"
            );
        }
    }
);

export const TestCasesUpdate = createAsyncThunk(
    "TestCases/update",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.put(
                "/ws/rest/Easytesting/TestCase/Update",
                payload
            );

            const resData = Array.isArray(response.data) ? response.data[0] : response.data;

            if (resData?.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    resData?.UI_Display_Message || "Test case update failed"
                );
                return rejectWithValue(resData);
            } else {
                showSnackbar(
                    "success",
                    resData?.UI_Display_Message || "Test Cases updated successfully"
                );
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Test case update failed");
            return rejectWithValue(
                error.response?.data?.message || "Test case update failed"
            );
        }
    }
);

export const TestCasesDelete = createAsyncThunk(
    "TestCases/delete",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await boomiApi.delete(
                "/ws/rest/Easytesting/TestCase/Delete",
                { data: payload }
            );

            const resData = Array.isArray(response.data) ? response.data[0] : response.data;

            if (resData?.Response_Status === "Failure") {
                showSnackbar(
                    "error",
                    resData?.UI_Display_Message || "Test case delete failed"
                );
                return rejectWithValue(resData);
            } else {
                showSnackbar(
                    "success",
                    resData?.UI_Display_Message || "Test case deleted successfully"
                );
            }

            return response.data;
        } catch (error: any) {
            showSnackbar("error", "Test case delete failed");
            return rejectWithValue(
                error.response?.data?.message || "Test case delete failed"
            );
        }
    }
);

