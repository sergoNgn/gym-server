const db = require("../db");
const { exercise_data } = require("../utils/consts");

const saveExercise = async (req, res) => {
  const saveExQuery = {
    text: "INSERT INTO exercises (name, category_id, sex) values ($1, $2, $3) RETURNING id",
    values: [req.body.name, req.body.categoryId, `${req.body.sex}`],
  };
  const getClientsBaseQuery = {
    text: "SELECT id FROM clients_base WHERE client_id in (SELECT id FROM clients WHERE data::json->>'sex' = $1)",
    values: [req.body.sex],
  };

  const savedExercise = await db.pgClient.query(saveExQuery);
  const client_bases = await db.pgClient.query(getClientsBaseQuery);

  const baseIds = client_bases.rows?.map((r) => r.id);

  if (baseIds?.length) {
    const exerciseValues = baseIds.map(
      (id) =>
        `(${id}, ${savedExercise.rows[0]?.id}, '${JSON.stringify(
          exercise_data
        )}')`
    );

    const updateClientBaseQuery = `INSERT into clients_base_exercises (base_id, exercise_id, data) VALUES ${exerciseValues}`;

    await db.pgClient.query(updateClientBaseQuery);
  }

  res.status(200).send(savedExercise.rows[0]);
};

const getAllExercises = async (req, res) => {
  const query = {
    text: "SELECT * FROM exercises",
  };
  const values = await db.pgClient.query(query);

  res.send(
    values.rows.map((r) => {
      return {
        ...r,
        categoryId: r.category_id,
      };
    })
  );
};

const deleteExercise = async (req, res) => {
  const deleteExQuery = {
    text: "DELETE FROM exercises where id = $1",
    values: [req.params.id],
  };
  const deleteExFromBaseQuery = {
    text: "DELETE FROM clients_base_exercises where exercise_id = $1",
    values: [req.params.id],
  };

  await db.pgClient.query(deleteExFromBaseQuery);
  await db.pgClient.query(deleteExQuery);

  res.status(200).send();
};

module.exports = {
  getAllExercises,
  saveExercise,
  deleteExercise,
};
