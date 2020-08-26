const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");

// Load env variables
dotenv.config({ path: "./config.env" });

// Router
const filetotext = require("./routes/filetotext");

const app = express();
app.use(express.json());
app.use(fileupload())

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security middlewares
app.use(helmet());            // Set security headers
app.use(xss());               // Prevent cross site scripting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,   // 10 minutes
  max: 1000,                  // Max requests per time
});
app.use(limiter);             // Rate limiting
app.use(hpp());               // HTTP parameter polution
app.use(cors());              // Enable cors

// Mounting routes
app.use("/", filetotext);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);