import { createSlice } from "@reduxjs/toolkit";

const OnlineUsersSlice = createSlice({
  name: "OnlineUsers",
  initialState: null,
  reducers: {
    // Action to set the online users array
    getUsers: (state, action) => {
      return action.payload;  // Directly return the new state (we don't mutate the state here)
    },
  },
});

// Exporting the action creator
export const { getUsers } = OnlineUsersSlice.actions;

// Export the reducer to be used in the store
export default OnlineUsersSlice.reducer;
