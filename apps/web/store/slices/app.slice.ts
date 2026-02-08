import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: AppState = {
  isBusy: false,
  moodleToken: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsBusy(state, action: PayloadAction<boolean>) {
      state.isBusy = action.payload;
    },
    setMoodleToken(state, action: PayloadAction<string | null>) {
      state.moodleToken = action.payload;
    },
  },
});

export const { setIsBusy, setMoodleToken } = appSlice.actions;
export default appSlice.reducer;
