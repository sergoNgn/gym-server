const db = require("../db");

const getClients = async (req, res) => {
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

  const page = req.query.page ?? 0;
  const limit = req.query.limit ?? 10;

  searchParams.push(limit, page);

  const values = await db.pgClient.query({
    text: baseQuery,
    values: searchParams,
  });

  res.send({ total: values.rows[0]?.count, data: values.rows });
};

const getClientById = async (req, res) => {
  const query = {
    name: "getClientById",
    text: "SELECT * FROM clients WHERE id = $1",
    values: [req.params.id],
  };
  const values = await db.pgClient.query(query);

  res.send(values.rows[0]);
};

const saveClient = async (req, res) => {
  const query = {
    name: "saveClient",
    text: "INSERT INTO clients (data) values ($1) RETURNING id",
    values: [req.body],
  };
  const saved = await db.pgClient.query(query);

  res.status(200).send(saved.rows[0]);
};

const updateClient = async (req, res) => {
  const query = {
    name: "updateClient",
    text: "UPDATE clients SET data = ($1) WHERE id = $2",
    values: [req.body.data, req.params.id],
  };
  await db.pgClient().query(query);

  res.status(200).send();
};

const deleteClient = async (req, res) => {
  const query = {
    name: "deleteClient",
    text: "DELETE FROM clients WHERE id = $1",
    values: [req.params.id],
  };
  const exercisesQuery = {
    name: "deleteExercises",
    text: "DELETE FROM exercises WHERE client_id = $1",
    values: [req.params.id],
  };
  await db.pgClient.query(exercisesQuery);
  await db.pgClient.query(query);

  res.status(200).send();
};

module.exports = {
  getClients,
  getClientById,
  saveClient,
  updateClient,
  deleteClient,
};
