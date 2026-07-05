class appError extends Error {
    status : "error" | "fail";
    isOperation : boolean ; 
    constructor (
        public message : string, 
        public statusCode: number, 

    ){
        super(message);
        this.statusCode = statusCode; 
        this.isOperation = true;
        this.status = statusCode >= 500 ? "error" : "fail";
        Error.captureStackTrace(this, appError);
    }
}

//! this code is used in all kind of projects so its like you can copy paste all this code

export default appError;


