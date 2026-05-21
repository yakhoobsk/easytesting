import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";

export const GitHistoryGet = createAsyncThunk(
    "gitHistory/get",
    async ({ payload, pagination }: { payload: any; pagination: any }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post(urlGenarator("/ws/rest/EasyCICD/Merge/Get", pagination), payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);


export const ComponentXMLGet = createAsyncThunk(
    "componentXML/get",
    async ({ payload }: { payload: any; }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Component/Data", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

export const UpdatedComponentXMLGet = createAsyncThunk(
    "UpdatedcomponentXML/get",
    async ({ payload }: { payload: any; }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Process/Modification", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);

export const GitValidationsGet = createAsyncThunk(
    "validations/get",
    async ({ payload }: { payload: any; }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Validation/Query", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);


export const PiplensresponceGet = createAsyncThunk(
    "Piplensresponce/get",
    async ({ payload }: { payload: any; }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/pipline/get", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);



export const PackageComponentGet = createAsyncThunk(
    "package/get",
    async ({ payload }: { payload: any; }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Package/History", payload);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);


export const DeploymentHistoryGet = createAsyncThunk(
    "deploymentHistory/get",
    async ({ payload }: { payload: any; }, { rejectWithValue }) => {
        try {
            const response = await boomiApi.post("/ws/rest/EasyCICD/Deployment/History", payload);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Fetch failed");
        }
    }
);