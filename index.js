const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const useRoutes = require("./routes");

const app = express();

app.listen("9000");
app.use(cors());
app.use(bodyParser.json());

useRoutes(app);
