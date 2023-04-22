module.exports = function (app, db) {
  const clients = require("./clients")(db);
  const exercises = require("./exercises")(db);
  const categories = require("./categories")(db);
  const clientsBase = require("./clients_base")(db);

  app.use("/clients", clients);
  app.use("/exercises", exercises);
  app.use("/categories", categories);
  app.use("/clients-base", clientsBase);
};
