import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DataBase Connectend Successfully");
  } catch (err) {
    console.error("Database connection failed", err.message);
    process.exit(1);
  }
};

export default ConnectDB;
