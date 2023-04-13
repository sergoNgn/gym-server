const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();

app.listen("9000");
app.use(cors());
app.use(bodyParser.json());

app.get("/clients", async (req, res) => {
  let baseQuery = "SELECT *, count(*) over () FROM clients WHERE 1=1";
  const searchParams = [];
  let paramsCount = 1;

  if (req.query.gym) {
    baseQuery = `${baseQuery} AND data ->> 'gym' = $${paramsCount++}`;
    searchParams.push(req.query.gym);
  }

  if (req.query.sex) {
    baseQuery = `${baseQuery} AND data ->> 'sex' = $${paramsCount++}`;
    searchParams.push(req.query.sex);
  }

  baseQuery = baseQuery.concat(
    ` LIMIT $${paramsCount++} OFFSET $${paramsCount++}`
  );

  searchParams.push(req.query.limit, req.query.page * req.query.limit);

  const values = await db.pgClient.query({
    text: baseQuery,
    values: searchParams,
  });

  res.send({ total: values.rows[0].count, data: values.rows });
});

app.get("/clients/:id", async (req, res) => {
  const query = {
    name: "getById",
    text: "SELECT * FROM clients WHERE id = $1",
    values: [req.params.id],
  };
  const values = await db.pgClient.query(query);

  res.send(values.rows[0]);
});

app.post("/clients", async (req, res) => {
  const query = {
    name: "save",
    text: "INSERT INTO clients (data) values ($1) RETURNING id",
    values: [req.body],
  };
  const saved = await db.pgClient.query(query);

  res.status(200).send(saved.rows[0]);
});

app.put("/clients/:id", async (req, res) => {
  const query = {
    name: "update",
    text: "UPDATE clients SET data = ($1) WHERE id = $2",
    values: [req.body.data, req.params.id],
  };
  const saved = await db.pgClient.query(query);

  res.status(200).send();
});

app.delete("/clients/:id", async (req, res) => {
  const query = {
    name: "delete",
    text: "DELETE FROM clients WHERE id = $1",
    values: [req.params.id],
  };
  await db.pgClient.query(query);

  res.status(200).send();
});

app.get("/categories", async (req, res) => {
  const query = {
    name: "getCategories",
    text: "SELECT * FROM categories",
  };
  const values = await db.pgClient.query(query);

  res.send(values.rows);
});

app.post("/exercises", async (req, res) => {
  const query = {
    name: "save",
    text: "INSERT INTO exercises (name, category_id, sex, client_id) values ($1, $2, $3, $4) RETURNING id",
    values: [
      req.body.name,
      req.body.categoryId,
      req.body.sex,
      req.body.clientId,
    ],
  };
  const saved = await db.pgClient.query(query);

  res.status(200).send(saved.rows[0]);
});

app.get("/exercies/:id", async (req, res) => {
  const query = {
    name: "getCategories",
    text: "SELECT * FROM exercises where client_id = $1",
    values: [req.params.id],
  };
  const values = await db.pgClient.query(query);

  res.send(values.rows);
});
