require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");

// connect to database
const connectDB = require("./db/connect");

//routers
const authenticationRouter = require("./routes/auth");

//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//security
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(helmet());

app.use(
  cors({
    // [to be updated - when deployed, set app domain]
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

// parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//passport configuration
require("./config/passport-jwt");

app.use(passport.initialize());

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
