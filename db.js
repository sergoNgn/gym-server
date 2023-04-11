const { Pool } = require("pg");
const keys = require("./keys");

// init a postgress db

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDB,
  password: keys.pgPass,
  port: keys.pgPort,
});

const initPG = async (query) => {
  try {
    await pgClient.connect();
    await pgClient.query(query);

    return true;
  } catch (err) {
    console.log(err);

    return false;
  }
};

initPG(
  "CREATE TABLE IF NOT EXISTS clients (id serial, data json, PRIMARY KEY(id))"
).then((res) => {
  console.log("postgres is initiated");
});

module.exports = {
  pgClient: pgClient,
};