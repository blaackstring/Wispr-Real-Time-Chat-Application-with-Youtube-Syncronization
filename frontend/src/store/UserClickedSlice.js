import { createSlice } from "@reduxjs/toolkit"

const UserClickedSlice=createSlice({
    name:"UserClickedSlice",
    initialState:{
        clicked:false,
        user:{},
    },
    reducers:{
        userClicked:(state,action)=>{
            state.clicked=true;
            console.log(action.payload);
            state.user=action.payload;
            
        }
    }
})

export const {userClicked}=UserClickedSlice.actions;

export default UserClickedSlice.reducer;