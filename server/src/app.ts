import express, { Request, Response, NextFunction } from "express";


// @types/packageName
const app = express();


//* ealth route 

app.get("/", (req:Request, res:Response , next: NextFunction)=>{

res.status(200).json ({
    message: "server is ready and running ",
    success: true ,
    status : "success",
    data : null ,     
})
})


app.use((req : Request , res: Response , next : NextFunction)=>{
    const message = ` cannot get ${req.method} on ${req.path}`;

    res.status(404).json({
        message, 
        success: false,
        status : "fail", 
        data : null,
        

    })

})

export default app; 