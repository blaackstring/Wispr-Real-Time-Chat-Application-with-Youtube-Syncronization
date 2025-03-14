import { getReciverSocketId, io } from "../Socket.io/Socket.js"

export const SendUrl=(req,res)=>{
    try {
        const {id:receiverid}=req.params;
    const url=req.body.url
console.log(url,receiverid);



    const ReciverSocketId=getReciverSocketId(receiverid);
    console.log(ReciverSocketId);
    

    if(ReciverSocketId) io.to(ReciverSocketId).emit("send_url",{url,receiverid, ReciverSocketId});

    res.status(201).json({
        success: true,
        message:"Url send",
        url
    });
}
    catch (error) {
        res.status(500).json({
            success: false,
            message:"Url send failed"
        });
            console.error(error)
        
    }
}



export const PlayorPaused=(req,res)=>{
    try {
        const {id:receiverid}=req.params;
    const isPlaying=req.body.isPlaying
  
    const ReciverSocketId=getReciverSocketId(receiverid);
    console.log(ReciverSocketId,"From db");
    
    if(ReciverSocketId) io.to(ReciverSocketId).emit("play_pause",isPlaying);

    res.status(201).json({
        success: true,
        message:"play or paused successfuly",
        isPlaying
    });
}
catch (error) {
    res.status(500).json({
        success: false,
        message:"play or paused failed"
    });
        console.error(error)
    
}
}




export const seek=(req,res)=>{
    try {
        const {id:receiverid}=req.params;
    const seekTo=req.body.seekTo

    const ReciverSocketId=getReciverSocketId(receiverid);

    if(ReciverSocketId) io.to(ReciverSocketId).emit("seek",seekTo);

    console.log("FROMDB SEEK",ReciverSocketId);
    

    res.status(201).json({
        success: true,
        message:"Seeked successfuly",
        seekTo
        
    });
}
catch (error) {
    res.status(500).json({
        success: false,
        message:"Seeked failed"
    });
        console.error(error)
    
}
}
