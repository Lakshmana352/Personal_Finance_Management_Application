const express = require("express");
const dotenv = require("dotenv");dotenv.config();
require("./model");
const app = express();

app.use(express.json());

// app.use("/",(req,res)=>{
//   res.status(200).json({message: "Home Page"})
// });

app.use('/api',require("./routes/authRoutes"));

app.use('/api/type',require("./routes/typeRoutes"));

app.use('/api/transactions',require("./routes/transactionRoutes"));

app.listen(process.env.PORT,()=>{
  console.log(`Server is running successfully.`);
});

module.exports = app;