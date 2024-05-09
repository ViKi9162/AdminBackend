import express from "express";
import  dotenv  from 'dotenv';
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './Routes/authRout.js'
import EmployeeRout from './Routes/EmployeeRout.js'
import cors  from 'cors';
//config env

dotenv.config();
//database config 
connectDB();
//rest object
const app = express();
//middelware
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/createEmployee',EmployeeRout);


// Define a route
app.get("/", (req, res) => {
    res.send("Server is running");
});

// Define the port
const port =process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
