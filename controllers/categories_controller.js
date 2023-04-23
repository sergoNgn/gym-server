const db = require("../db");

const getCategories = async (req, res) => {
  const query = {
    name: "getCategories",
    text: "SELECT * FROM categories",
  };
  const values = await db.pgClient.query(query);

  res.send(values.rows);
};

module.exports = {
  getCategories,
};
