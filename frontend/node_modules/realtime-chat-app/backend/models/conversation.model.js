import mongoose from "mongoose";


const ConversationSchema=new mongoose.Schema({
    participants:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    messages:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"message",
        default:[]
    }]
},{timestamps:true})

const ConversationModel=mongoose.model("conversation",ConversationSchema);

export default ConversationModel;