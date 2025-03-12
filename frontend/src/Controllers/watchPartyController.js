export const sendurl=async(url,id)=>{
    try {
        const res= await fetch(`/api/watchparty/sendUrl/${id}`,{
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

export const playorpaused=async(data,id)=>{
    try {
        const res= await fetch(`/api/watchparty/play_pause/${id}`,{
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



export const seeked=async(data,id)=>{
    try {
        const res= await fetch(`/api/watchparty/seek/${id}`,{
            method:"POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({seekTo:data})
        })
        console.log(data,'seek');
        console.log(res);
        
        return res;
        
    } catch (error) {
        console.error(error);
        
    }

}