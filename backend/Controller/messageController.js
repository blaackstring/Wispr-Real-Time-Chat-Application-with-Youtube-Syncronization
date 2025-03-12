import ConversationModel from "../models/conversation.model.js";
import messagemodel from "../models/message.model.js";
import { getReciverSocketId, io } from "../Socket.io/Socket.js";

export const sendmessage= async(req,res)=>{
try {
    const message=String(req.body.messageContent);   ;
    const senderid=req.user._id;
    const {id:receiverid}=req.params;
     
let chat=await ConversationModel.findOne({
         participants:{$all:[senderid,receiverid]}

    })
    if(!chat){
        chat= await ConversationModel.create({
         participants:[senderid,receiverid],
             
        })
    }
    const newmsg=await messagemodel({
        senderid:senderid,
        reciverid:receiverid,
        messageContent:message,
        conversationid:chat._id
    })
console.log(newmsg);

    if(newmsg){
        chat.messages.push(newmsg._id);
    }


    await Promise.all([chat.save(),newmsg.save()]); 
    
    const ReciverSocketId=getReciverSocketId(receiverid)

    if(ReciverSocketId) io.to(ReciverSocketId).emit("New_Message",newmsg);
    
    // it returns  promise that will be resolved  when both model are updated or saved in db
    res.status(201).json({
        success: true,
        message:"Message sent successfully",
        chat
    });

} catch (error) {
    res.status(500).json({
        success: false,
        message:"Sending Message  failed"
    });
        console.log(error)
}
}


export const recievemsg = async (req, res) => {
    try {
        const senderid = req.user._id;
        const { id: receiverid } = req.params;

        // 🔍 Find the conversation between sender and receiver
        const chat = await ConversationModel.findOne(
            { participants: { $all: [senderid, receiverid] } }
        );

        if (!chat) {
            return res.status(200).json([]); // ✅ Return empty if no conversation exists
        }

        const messages = await messagemodel.find({ conversationid: chat._id }) // Select only required fields
        .sort({ createdAt: 1 });
        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error receiving message:", error);
        return res.status(500).json({
            success: false,
            message: "Receiving Message Failed"
        });
    }
};
