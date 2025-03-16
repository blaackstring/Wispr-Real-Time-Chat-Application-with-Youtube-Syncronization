import mongoose from "mongoose";

const DbConnect=async()=>{
    try {
        console.log(process.env.MONGODB_URL);
        
        const conection= await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log("DB connected")
    } catch (error) {
        console.error(`error in connecting DB ${error}`)
    }
}


export default DbConnect;