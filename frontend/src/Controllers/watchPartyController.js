export const sendurl=async(url,id,senderid)=>{
    try {
        const res= await fetch(`/api/watchparty/sendUrl/${id}/${senderid}`,{
            method:"POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({url})
        })
        console.log(url);
        return res;
        
    } catch (error) {
        console.error(error);
        
    }
}

export const playorpaused=async(data,id,senderid)=>{
    try {
        const res= await fetch(`/api/watchparty/play_pause/${id}/${senderid}`,{
            method:"POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({isPlaying:data})
        })
        console.log(data);
        console.log(res);
        
        return res;
        
    } catch (error) {
        console.error(error);
        
    }

}



export const seeked=async(data,id,senderid)=>{
    try {
        const res= await fetch(`/api/watchparty/seek/${id}/${senderid}`,{
            method:"POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({seekTo: Number(data)})
        })
        console.log(data,'seek');
        console.log(res);
        
        return res;
        
    } catch (error) {
        console.error(error);
        
    }

}