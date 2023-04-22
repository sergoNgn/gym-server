const exercisesRoutes = (db) => {
  const { Router } = require("express");
  const router = Router();

  router.post("/", async (req, res) => {
    const query = {
      name: "saveExercise",
      text: "INSERT INTO exercises (name, category_id, sex) values ($1, $2, $3) RETURNING id",
      values: [req.body.name, req.body.categoryId, req.body.sex],
    };
    const saved = await db.pgClient.query(query);

    res.status(200).send(saved.rows[0]);
  });

  router.get("/", async (req, res) => {
    const query = {
      name: "getExercises",
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
  });

  router.delete("/:id", async (req, res) => {
    const query = {
      name: `deleteExercises${req.params.id}`,
      text: "DELETE FROM exercises where id = $1",
      values: [req.params.id],
    };
    const values = await db.pgClient.query(query);

    res.status(200).send();
  });

  return router;
};

module.exports = exercisesRoutes;
