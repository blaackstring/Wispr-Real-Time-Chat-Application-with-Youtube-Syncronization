export const uploadPic = async (formData) => {
    try {
      const res = await fetch(`https://wispr-chatapp.onrender.com/api/auth/uploadfile`, {
        method: "POST",
        credentials: "include", // Optional, if you need cookies/session
        body: formData, // Just send the FormData object, no need to manually set Content-Type
      });
  
      console.log(res);
      return res// Parse JSON response
    } catch (error) {
      console.error("Error while uploading profilePic", error);
    }
  };
  