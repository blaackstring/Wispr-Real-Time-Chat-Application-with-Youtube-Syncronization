import Message from "@/components/Message";

export const sendmsg=async(id,data)=>{
try {
    const res=await fetch(`/api/messages/send/${id}`,{
        method:"POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({messageContent:data})
    })

    return res.json()
}
catch(Error){
    console.error('Error while sending message:', Error);
}
}

export const Recievemsg=async(id)=>{
    try {
        const res=await fetch(`/api/messages/recieve/${id}`,{
            method:"GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            
        })
    
        return res.json()
    }
    catch(Error){
        console.error('Error while Recieve message:', Error);
    }
}