import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice.js"; // ✅ Correct import for user data
import recentUserReducer from "./userslice.js"; // ✅ Import recentUsers reducer
import userclicked from './UserClickedSlice.js'
import getUsers from "./getOnlineUserslice.js";

const store = configureStore({
  reducer: {
    user: userReducer, // ✅ Manages user data
    RecentSlice: recentUserReducer, 
    UserClickedSlice:userclicked,// ✅ This should exist for recentUsers
    OnlineUsers:getUsers
  },
});

export default store;
