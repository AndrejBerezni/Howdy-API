require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");

// connect to database
const connectDB = require("./db/connect");

//routers
const authenticationRouter = require("./routes/auth");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(cors());

//passport configuration
require("./config/passport-jwt");

app.use(passport.initialize());

// parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1/auth", authenticationRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//start the application
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
