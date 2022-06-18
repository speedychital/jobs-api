//starter files
require("dotenv").config();
require("express-async-errors");
const express = require("express");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const crud = require("./routes/jobs");
const auth = require("./routes/auth");
const authentication = require("./middleware/authentication");

//security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// swagger
const swaggerUI = require("swagger-ui-express");
const yaml = require("yamljs");
const apiDocument = yaml.load("./swagger.yaml");

//app
const app = express();

//middlewares

app.set("trust proxy", 1);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(apiDocument));

//routes
app.get("/", (req, res) => {
    res.send(
        `<h1>Jobs API version 1</h1><a href="/api-docs">Go to the documentation</a>`
    );
});
app.use("/api/v1/auth", auth);
app.use("/api/v1/jobs", authentication, crud);

//errors
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const start = async (req, res) => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log("Connected to DataBase Successfully");
        app.listen(PORT, () => console.log(`Server listening on ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
};
start();
