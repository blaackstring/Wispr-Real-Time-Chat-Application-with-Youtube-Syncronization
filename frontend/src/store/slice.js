import { getRecentUsers } from "@/Controllers/getRecentUser";
import {  createSlice } from "@reduxjs/toolkit";
import { setRecentUsers } from "./userslice.js";



const Slice=createSlice({
    name:'user',
    initialState:{
        username:'',
        fullname:'',
        gender:'',
        email:'',
        userid:'',
        ProfilePic:'',
        isloggedin:false
    },
    reducers:{
        AuthLogin:(state,action)=>{
            state.username=action.payload.username
            state.fullname=action.payload.fullname
            state.gender=action.payload.gender
            state.email=action.payload.email
            state.userid=action.payload._id
            state.ProfilePic=action.payload.ProfilePic
            state.isloggedin=action.payload._id!==''?true:false
        },
        AuthLogout:(state)=>{
            state.username=''
            state.fullname=''
            state.gender=''
            state.email=''
            state.userid=''
            state.ProfilePic=''
            state.isloggedin=false
        },
        
    }
})


export const verifyUser = () => async (dispatch) => {
  try {
      console.log("⚡ Fetching user data...");
      
      const res = await fetch(`/api/verify/verifyuser`, {
          method: "GET",
          credentials: "include",
      });

      if (!res.ok) {
          throw new Error("Failed to verify");
      }

      const data = await res.json();
      const dataof = await getRecentUsers();

      console.log("✅ Recent Users Data Fetched:", dataof);
      dispatch(AuthLogout());
      // Log before dispatching
      console.log("🚀 Dispatching setRecentUsers...", { recentUsers: dataof.recentUsers });

      dispatch(setRecentUsers({ recentUsers: dataof.recentUsers })); 

      dispatch(AuthLogin(data.user));


  } catch (error) {
      console.log("❌ Verification failed", error);
      dispatch(AuthLogout());  
  }
};

export const {AuthLogin,AuthLogout}=Slice.actions   //slice.actions is an object that contains action creators (functions that return action objects).
export default Slice.reducer;