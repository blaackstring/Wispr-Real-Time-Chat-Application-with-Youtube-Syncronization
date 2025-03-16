import mongoose from "mongoose"


const UserSchema=new mongoose.Schema({
    
    fullname:{
        type:String,
        required:true,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minlength:4,
        
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    ProfilePic:{
        type:String,
        default:""
    }
},{timestamps:true})


const user=mongoose.model("user",UserSchema);

export  default user