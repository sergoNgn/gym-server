const { Pool } = require("pg");
const keys = require("../keys");
const {
  create_categories,
  create_client_base,
  create_client_clients_base,
  create_clients,
  create_exercises,
  init_categories,
} = require("./queries");

// init a postgress db

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDB,
  password: keys.pgPass,
  port: keys.pgPort,
});

const execute = async (query) => {
  try {
    await pgClient.connect();
    await pgClient.query(query);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

execute(create_clients)
  .then(() => execute(create_categories))
  .then(() => execute(init_categories))
  .then(() => execute(create_exercises))
  .then(() => execute(create_client_base))
  .then(() => {
    console.log("db is initiated");
  });

module.exports = {
  pgClient: pgClient,
};
