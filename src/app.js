//Setup Express
const express = require("express");
const app = express();
require('express-async-errors');
require('dotenv').config();


//Modules
const helmet = require("helmet");
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const cors = require("cors");

//Setup Config
const config = require("config");

//Import Error Middleware
const error = require("./middleware/error");

//Import Routes
const users = require("./routes/users");
const auth = require("./routes/auth");
const recipes = require("./routes/recipes");
const contacts = require("./routes/contacts");

//Load Data From Config File
const connectionString = config.get("db.connectionString");
const serverPort = config.get("port");
const recipesPrivateKey = config.get("recipesPrivateKey");

//Check Environmental Variables are setup
if (!recipesPrivateKey) {
  console.error("FATAL ERROR: RECIPES_PRIVATE_KEY is not defined.");
  process.exit(1);
}

//Connect to MongoDB
async function connectMongoDB() {
  try {
    const connectionResult = await mongoose.connect(connectionString);
    if (connectionResult) console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Connection failed", error);
  }
}
connectMongoDB();

//Use Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Use Routes Middleware
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/recipes", recipes);
app.use("/api/contacts", contacts);

//Error Middleware
app.use(error);

//Start Server
const port = process.env.PORT || serverPort;
app.listen(port, () => console.log(`Listening on port ${port}`));
