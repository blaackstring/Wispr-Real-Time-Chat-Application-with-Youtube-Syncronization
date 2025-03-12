import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "RecentSlice",
    initialState: {
        recentUsers: [
          {
            ProfilePic: "",
            createdAt: " ",
            fullname: " ",
            gender: " ",
            updatedAt: "",
            username: " ",
            id: "",
          },
        ],
      },
      
    reducers: {
        setRecentUsers: (state, action) => {
            console.log("🛠️ Inside setRecentUsers Reducer 🚀");
            console.log("🔄 Action Payload:", action.payload);

            state.recentUsers = [...action.payload.recentUsers];  // ✅ Force state update
        }
    },
});

export const { setRecentUsers } = userSlice.actions;
export default userSlice.reducer;
