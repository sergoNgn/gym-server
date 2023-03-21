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

app.post("/clients", async (req, res) => {
  const saved = await pgClient.query(
    "INSERT INTO clients (data) values ($1) RETURNING id",
    [req.body]
  );

  res.status(200).send(saved.rows[0]);
});

app.put("/clients", async (req, res) => {
  pgClient.query("UPDATE clients SET data = ($1) WHERE id = $2", [
    req.body.data,
    req.body.id,
  ]);

  res.status(200).send();
});

app.delete("/clients", async (req, res) => {
  pgClient.query("DELETE FROM clients WHERE id = $1", [req.body.id]);

  res.status(200).send();
});