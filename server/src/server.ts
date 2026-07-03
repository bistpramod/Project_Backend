import app from "./app"; 
import { connectDatabase } from "./config/db.config"; // cuz its named export not default
const PORT = 8080;



const DB_URI = "mongodb://localhost:27017/project_backend";

//? connect database
connectDatabase(DB_URI)






//* listen 
app.listen(PORT , ()=> {
    console.log(`server is running at http://localhost:${PORT}`)
})