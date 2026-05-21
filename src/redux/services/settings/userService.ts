import { createAsyncThunk } from "@reduxjs/toolkit";
import { boomiApi, urlGenarator } from "../commonAxios";
import { showSnackbar } from "../../../utils/snackbar";



interface UserCreatePayload {
  payload: any;
  // onClose?: () => void;

}

export const UserGet = createAsyncThunk(
  "user/get",
  async (
    { payload, pagination }: { payload: any; pagination: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await boomiApi.post(urlGenarator("/ws/rest/Easytesting/User/Fetch_User_Details", pagination), payload);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const UserCreate = createAsyncThunk("user/create", async ({ payload }: UserCreatePayload, { rejectWithValue }) => {
  try {

    const response = await boomiApi.post("/ws/rest/Easytesting/User/Create", payload);
    if (response.data.Response_Status === "Failure") {
      showSnackbar("error", response.data?.UI_Display_Message || "User creation failed");
    } else if (response.data.Response_Status === "Success") {
      showSnackbar("success", response.data?.UI_Display_Message || "User created successfully");

    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "User creation failed");
  }
}
);

export const UserEdit = createAsyncThunk("user/edit", async (payload: any, { rejectWithValue }) => {
  try {

    const response = await boomiApi.put("/ws/rest/Easytesting/User/Update", payload);
    if (response.data.Response_Status === "Failure") {
      showSnackbar("error", response.data?.UI_Display_Message || "User update failed");
    } else if (response.data.Response_Status === "Success") {
      // onClose && onClose();
      showSnackbar("success", response.data?.UI_Display_Message || "User update successful");

    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
}
);

export const UserDelete = createAsyncThunk("user/delete", async (deletePayload: any, { rejectWithValue }) => {
  try {
    const payload = {
      user_id: deletePayload.user_id,
      is_status: 0
    };
    const response = await boomiApi.put("/ws/rest/Easytesting/User/Status_Data_Update", payload);
    if (response.data.Response_Status === "Failure") {
      showSnackbar("error", response.data?.UI_Display_Message || "Delete failed");
    } else if (response.data.Response_Status === "Success") {
      showSnackbar("success", response.data?.UI_Display_Message || "User deleted successfully");
    }
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Delete failed");
  }
}
);



export const UserMailGet = createAsyncThunk(
  "user/mailget",
  async (
    _: any,
    { rejectWithValue }
  ) => {
    try {
      const response = await boomiApi.post("/ws/rest/Easytesting/usermails/dropdown");

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);

export const UserProfileUpdate = createAsyncThunk(
  "user/profileUpdate",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await boomiApi.put("/ws/rest/Easytesting/Profile/details_update", payload);

      if (response.data.Response_Status === "Failure") {
        showSnackbar("error", response.data?.UI_Display_Message || "Profile update failed");
        return rejectWithValue(response.data);
      } else if (response.data.Response_Status === "Success") {
        showSnackbar("success", response.data?.UI_Display_Message || "Profile updated successfully");
      }

      return response.data;
    } catch (error: any) {
      showSnackbar("error", "Profile update failed");
      return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
  }
);

export const UserProfileGet = createAsyncThunk(
  "profile/get",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await boomiApi.post(
        "/ws/rest/Easytesting/Profile/fetch",
        payload
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Fetch failed"
      );
    }
  }
);
