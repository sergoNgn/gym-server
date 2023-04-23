module.exports = function (app) {
  const clients = require("./clients");
  const exercises = require("./exercises");
  const categories = require("./categories");
  const clientsBase = require("./clients_base");

  app.use("/clients", clients);
  app.use("/exercises", exercises);
  app.use("/categories", categories);
  app.use("/clients-base", clientsBase);
};
