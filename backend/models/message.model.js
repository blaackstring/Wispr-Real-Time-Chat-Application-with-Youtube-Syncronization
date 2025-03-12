import mongoose from "mongoose";


const MessageSchema= new mongoose.Schema({
    senderid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    reciverid:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    messageContent:{
        type:String,
        required:true,
    },
    conversationid:{
         type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    }

},{timestamps:true})

const messagemodel=mongoose.model("message",MessageSchema);

export default messagemodel;