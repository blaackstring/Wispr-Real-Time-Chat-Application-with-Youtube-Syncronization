export const getRecentUsers=async()=>{
try {
  const res=await  fetch(`/api/search/recentUsers`,{
        method:"GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
      
      const data= await res.json();
      console.log(data);
      return data;
      
      
} catch (error) {
    console.log(error.message);
    
}
    }