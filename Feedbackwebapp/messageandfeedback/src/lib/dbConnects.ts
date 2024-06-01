import mongoose from "mongoose";

type ConnectionsObject = {
    isConnected? :number;
}

const connections: ConnectionsObject = {}

async function  dbConnect() : Promise<void> {
    if(connections.isConnected){
    console.log("Already connnected to database");
    return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '' ,{})
        connections.isConnected = db.connections[0].readyState
        console.log("Connected to database");

    } catch (error) {
        console.log("db connection failed ",error);
        process.exit()
        
    }
}


export default dbConnect;
