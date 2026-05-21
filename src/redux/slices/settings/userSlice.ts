import { createSlice } from "@reduxjs/toolkit";
import { UserProfileGet, UserGet, UserMailGet, UserProfileUpdate, UserEdit, UserDelete } from "../../services/settings/userService";

interface AuthState {
  loading: boolean;
  userGet: any;
  error: string | null;
  UserMail: any;
  UserProfileData: any;
}

const initialState: AuthState = {
  loading: false,
  userGet: null,
  error: null,
  UserMail: null,
  UserProfileData: null,

};


const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(UserGet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(UserGet.fulfilled, (state, action) => {
        state.loading = false;
        state.userGet = action.payload;
      })

      .addCase(UserGet.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(UserMailGet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(UserMailGet.fulfilled, (state, action) => {
        state.loading = false;
        state.UserMail = action.payload;
      })

      .addCase(UserMailGet.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(UserProfileUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(UserProfileUpdate.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(UserProfileUpdate.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(UserProfileGet.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserProfileGet.fulfilled, (state, action) => {
        state.loading = false;
        state.UserProfileData = action.payload;
      })
      .addCase(UserProfileGet.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(UserEdit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserEdit.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UserEdit.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(UserDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UserDelete.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UserDelete.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
      })

  }
});

export default userSlice;
