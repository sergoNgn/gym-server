const db = require("../db");
const { exercise_data } = require("../utils/consts");

const getByClientId = async (req, resp) => {
  const query = {
    text: `SELECT cbe.exercise_id, cbe.data, ex.name, ex.category_id FROM clients_base_exercises cbe 
    inner join exercises ex on cbe.exercise_id = ex.id where base_id = (SELECT id from clients_base cb WHERE cb.client_id = $1)`,
    values: [req.params.clientId],
  };

  try {
    const values = await db.pgClient.query(query);
    resp.send(values.rows);
  } catch (err) {
    resp.status(500).send("failed to get client base");
  }
};

const saveNewBase = async (req, resp) => {
  try {
    const createBaseQuery = {
      text: "INSERT into clients_base (client_id) values ($1) on conflict (client_id) do update set client_id = excluded.client_id RETURNING id",
      values: [req.params.clientId],
    };

    const savedBase = await db.pgClient.query(createBaseQuery);

    const queryExercises = {
      text: "SELECT * from exercises ex WHERE ex.sex = (SELECT data::json->>'sex' from clients c WHERE c.id = $1)",
      values: [req.params.clientId],
    };
    const allExercises = await db.pgClient.query(queryExercises);

    const exerciseValues = allExercises.rows?.map((e) => {
      return `(${savedBase.rows[0].id}, ${e.id}, '${JSON.stringify(
        exercise_data
      )}')`;
    });

    await db.pgClient.query(
      `INSERT into clients_base_exercises (base_id, exercise_id, data) VALUES ${exerciseValues}`
    );

    resp.status(200).send();
  } catch (err) {
    console.log(err);
    resp.status(500).send("failed to save client base");
  }
};

const updateBase = async (req, resp) => {
  try {
    const getBaseQuery = {
      text: "SELECT id from clients_base WHERE client_id = $1",
      values: [req.params.clientId],
    };

    const base = await db.pgClient.query(getBaseQuery);
    const exercises = req.body.exercises;

    const exerciseValues = exercises.map((e) => {
      return `(${base.rows[0].id}, ${e.exercise_id}, '${JSON.stringify(
        e.data
      )}')`;
    });

    await db.pgClient.query(
      `INSERT into clients_base_exercises (base_id, exercise_id, data) VALUES ${exerciseValues} on conflict (base_id, exercise_id) do update set data = excluded.data`
    );

    resp.status(200).send();
  } catch (err) {
    resp.status(500).send("failed to update client base");
  }
};

module.exports = {
  getByClientId,
  saveNewBase,
  updateBase,
};
