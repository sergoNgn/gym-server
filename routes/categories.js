const categoriesRouter = (db) => {
  const { Router } = require("express");
  const router = Router();

  router.get("/", async (req, res) => {
    const query = {
      name: "getCategories",
      text: "SELECT * FROM categories",
    };
    const values = await db.pgClient.query(query);

    res.send(values.rows);
  });

  return router;
};

module.exports = categoriesRouter;
