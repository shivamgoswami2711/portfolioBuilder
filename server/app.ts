import express from "express";
import cors from "cors"
import helmet from "helmet"
import bodyParser from "body-parser"
import morgan from "morgan"
import cookies from "cookie-parser"
import path from "path"

// const ErrorModdelWare = require("./middleware/error.middlewares");/




const app = express();
app.use(cookies());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
const corsOptions ={
    origin:`*`, 
    credentials:true,            
    optionSuccessStatus:200
}


app.use(cors(corsOptions));

// app.use("/api/discount",discountRoute)


// app.use(express.static(path.join(__dirname, "../client/build")));

// app.use(ErrorModdelWare);

// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
//   });
  

export default app;