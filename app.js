const express = require("express");
const app = express();
const api = require("./routes/api");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cors());
//token get
app.use(cookieParser());

//tempfiles uploader
app.use(fileUpload({ useTempFiles: true }));
//data get
app.use(express.json());

dotenv.config({
  path: ".env",
});

connectDB();

//route load
//http://localhost:5000/api/
app.use("/api", api);

// server create
app.listen(process.env.PORT, () => {
  console.log(`localhost:${process.env.PORT}`);
});
