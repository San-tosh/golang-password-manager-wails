import { createSlice } from "@reduxjs/toolkit";

const passwordSlice = createSlice({
  name: "password",
  initialState: {
    isFetching: false,
    error: false,
  },
  reducers: {
    passwordEntryStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    passwordEntrySuccess: (state) => {
      state.isFetching = false;
      state.error = false;
    },
    passwordEntryFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
  },
});

export const { passwordEntryStart, passwordEntrySuccess, passwordEntryFailure } = passwordSlice.actions;
export default passwordSlice.reducer;