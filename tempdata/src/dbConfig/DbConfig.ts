import mongoose from 'mongoose'
export async function connect(){
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is not defined');
    }
    mongoose.connect(mongoUrl);
    const connection = mongoose.connection;
    connection.on('connected', () => {
        console.log("connected to db");
    });
    connection.on('error', (error) => {
        console.log("connection error please make sure the db is working " + error);
        process.exit();
    });
  } catch (error) {
    console.log("something went", error);
  }
   
}