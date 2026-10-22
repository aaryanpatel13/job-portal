import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});
const app = express();
// testing API
// app.get("/home", (req, res)=>{
//     return res.status(200).json({
//         message: "Testing API is working",
//         success : true,
//     })
// })

//middleWare
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const corsOptions = {
    origin : `http://localhost:5173`,
    credentials : true,
}
app.use(cors(corsOptions));


const PORT = process.env.PORT || 3000;

// API's
app.use("/api/v1/user", userRoute);
// http://localhost:8000/api/v1/user/register

app.use("/api/v1/company", companyRoute);
// http://localhost:8000/api/v1/company/register

app.use("/api/v1/job", jobRoute);
// http://localhost:8000/api/v1/job/post

app.use("/api/v1/application", applicationRoute);
// http://localhost:8000/api/v1/application/apply


app.listen(PORT, () => {
    connectDB();
    console.log(`server is running at ${PORT}`);
});