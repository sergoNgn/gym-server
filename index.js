const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

app.listen("9000");
app.use(cors());
app.use(bodyParser.json());

const routes = require("./routes")(app, db);
