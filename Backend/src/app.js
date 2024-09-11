import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
); //TELLS US ABOUT THE SIZE OF THE DATA

app.use(cookieParser()); //TO READ COOKIES

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

//routes import
import userRouter from "./routes/user.routes.js";
import uploadRoutes from "./middlewares/multer.middleware.js";

//ROUTES DECLARATIONS
app.use("/api/v1/users", userRouter);
app.use("/api", uploadRoutes);

export { app };
