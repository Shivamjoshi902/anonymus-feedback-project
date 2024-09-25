import mongoose from "mongoose";

type connectionObject = {
    isConnected?:Number
} 

const connection : connectionObject = {}

export default async function dbConnect(){
    if(connection.isConnected){
        console.log("database is already connected");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        connection.isConnected = db.connections[0].readyState
        console.log("database connected successfully");
        return
        
    } catch (error) {
        console.error("error while connecting to MongoDB : ",error);
        process.exit(1);
    }
}