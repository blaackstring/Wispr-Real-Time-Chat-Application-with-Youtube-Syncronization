import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { uploadPic } from "@/Controllers/uploadProfileController.js";
import { Pencil } from "lucide-react";
import { useState } from "react";

const ProfileComponent = ({pic}) => {
  const [image, setImage] = useState(pic);

  const handleFileChange =async(e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
     const formdata= new FormData();
     formdata.append("profilepic",file);
     const res=await uploadPic(formdata);
     console.log(res);
     
    }
  };

  return (
    <div className="relative w-35 h-35">
      <Avatar className="w-full h-full">
        <AvatarImage src={image} alt="Profile Photo"   />
        <AvatarFallback>MS</AvatarFallback>
      </Avatar>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />

      {/* Pencil Icon as File Upload Trigger */}
      <label
        htmlFor="fileInput"
        className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full text-white shadow-md cursor-pointer hover:bg-blue-600"
      >
        <Pencil size={16} />
      </label>
    </div>
  );
};

export default ProfileComponent;
