const clientBaseRoutes = (db) => {
  const { Router } = require("express");
  const router = Router();

  router.get("/:clientId", async (req, resp) => {
    const query = {
      text: "SELECT cb.exercise_id, cb.data, ex.name, ex.category_id FROM clients_base cb inner join exercises ex on cb.exercise_id = ex.id where cb.client_id = $1",
      values: [req.params.clientId],
    };

    try {
      const values = await db.pgClient.query(query);
      resp.send(values.rows);
    } catch (err) {
      resp.status(500).send("failed to get client base");
    }
  });

  router.post("/:clientId", async (req, resp) => {
    const queryExercises = {
      text: "SELECT * from exercises ex WHERE ex.sex = (SELECT data::json->>sex from clients c WHERE c.id = $1)",
      values: [req.params.clientId],
    };

    try {
      const allExercises = await db.pgClient.query(queryExercises);
      data = {
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
        10: "",
        11: "",
        12: "",
        13: "",
        14: "",
        15: "",
      };

      console.log(data);

      const exerciseValues = allExercises.rows.map((e) => {
        return `(${req.params.clientId}, ${e.id}, '${JSON.stringify(data)}')`;
      });

      await db.pgClient.query(
        `INSERT into clients_base (client_id, exercise_id, data) VALUES ${exerciseValues}`
      );

      resp.status(200).send();
    } catch (err) {
      console.log(err);
      resp.status(500).send("failed to save client base");
    }
  });

  router.patch("/:clientId", async (req, resp) => {
    try {
      const query = {
        text: "UPDATE clients_base set data = ($1) WHERE client_id = $2 AND exercise_id = $3",
        values: [req.body.data, req.params.clientId, req.body.exerciseId],
      };
      await db.pgClient.query(query);
      resp.status(200).send();
    } catch (err) {
      resp.status(500).send("failed to update client base");
    }
  });

  return router;
};

module.exports = clientBaseRoutes;
