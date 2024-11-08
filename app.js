require("dotenv").config();

const express = require("express");
const expessLayout = require("express-ejs-layouts");

const connectDB = require("./server/config/db");
const app = express();
const PORT = 5000 || process.env.PORT;

//connect DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Templating Engine
app.use(expessLayout);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.listen(PORT, () => {
  console.log(`App is lisining on port ${PORT}`);
});
