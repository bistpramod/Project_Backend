import mongoose from "mongoose";
export const connectDatabase = (DB_URI: string) => {
  mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("------------Database Connection Error");
      console.log(error);
    });
};


// it is for the database connection , and its working fine