const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const keys = require("./keys");

const app = express();

app.listen("9000");
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDB,
  password: keys.pgPass,
  port: keys.pgPort,
});

const initPG = async (query) => {
  try {
    await pgClient.connect();
    await pgClient.query(query);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

initPG(
  "CREATE TABLE IF NOT EXISTS clients (id serial, data json, PRIMARY KEY(id))"
).then((res) => {
  console.log("postgres is initiated");
});

app.get("/clients", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM clients");

  res.send(values.rows);
});

app.get("/clients/:id", async (req, res) => {
  const query = {
    name: "getById",
    text: "SELECT * FROM clients WHERE id = $1",
    values: [req.params.id],
  };
  const values = await pgClient.query(query);

  res.send(values.rows[0]);
});

app.post("/clients", async (req, res) => {
  const query = {
    name: "save",
    text: "INSERT INTO clients (data) values ($1) RETURNING id",
    values: [req.body],
  };
  const saved = await pgClient.query(query);

  res.status(200).send(saved.rows[0]);
});

app.put("/clients/:id", async (req, res) => {
  const query = {
    name: "update",
    text: "UPDATE clients SET data = ($1) WHERE id = $2",
    values: [req.body.data, req.params.id],
  };
  const saved = await pgClient.query(query);

  res.status(200).send();
});

app.delete("/clients/:id", async (req, res) => {
  const query = {
    name: "delete",
    text: "DELETE FROM clients WHERE id = $1",
    values: [req.params.id],
  };
  pgClient.query(query);

  res.status(200).send();
});
