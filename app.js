require("dotenv").config({ path: "./.env" });
require("./api/config/db");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.SERVER_PORT;
const cors = require("cors");
const routes = require("./api/routes");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

app.use(
  session({
    secret: "test@123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
    },
    store: new FileStore({
      path: "./sessions",
      ttl: 86400,
      reapInterval: 86400,
    }),
  })
);

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://127.0.0.1:4200",
    "http://localhost:4200",
    "https://central.myonedx.com",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", routes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`App listening at Port: ${port}`);
});

module.exports = app;
