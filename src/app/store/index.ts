import { configureStore, createSlice } from "@reduxjs/toolkit";

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState: { isLoggedIN: false },
  reducers: {
    login(state) {
      state.isLoggedIN = true;
    },
    logout(state) {
      sessionStorage.removeItem("userId"); // Remove from session storage
      state.isLoggedIN = false;
    },
  },
});


export const userActions = userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

// Define RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
