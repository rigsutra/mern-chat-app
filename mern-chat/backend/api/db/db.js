import { mongoose, Schema } from "mongoose";
import { DB_NAME } from "../";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n Connected to MongoDB !! DB Host ${connectionInstance.connection.host} \n`
    );
    // console.log(`MongoDB Connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB is not connected", error);
    process.exit(1);
  }
};

export default connectDB;
