import express, { Request, Response, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
//! importing Routes
import authRoutes from "./routes/auth.routes";
// @types/packageName
const app = express();

//! using middlewares
app.use(express.json({ limit: "10mb" }));

//* health route

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "server is ready and running ",
    success: true,
    status: "success",
    data: null,
  });
});

//! using routes
app.use("/api/v1/auth", authRoutes); // v1 thing is the versioning of the api
// app.use('/api/v2/auth', authRoutes)

//! path not found
app.use((req: Request, res: Response, next: NextFunction) => {
  const message = ` cannot get ${req.method} on ${req.path}`;

  // res.status(404).json({
  // message,
  // success: false,
  // status : "fail",
  // data : null,

  // })
  const error: any = new Error(message);
  error.status = "fail";
  error.statusCode = 404;
  next(error);
});

// using error handler
app.use(errorHandler);
export default app;
