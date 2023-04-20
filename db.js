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
  console.log("clients is initiated");
});

initPG(
  "CREATE TABLE IF NOT EXISTS categories (id serial, name text unique, PRIMARY KEY(id));"
).then((res) => {
  console.log("categories is initiated");
});

initPG(
  `insert into categories (name) values ('Ноги'), ('Грудь'), ('Спина'), ('Плечі'), ('Руки'), ('Аеробне')
    on conflict (name) do update set name = excluded.name;
  `
).then((res) => {
  console.log("categories are created");
});

initPG(
  "CREATE TABLE IF NOT EXISTS exercises (id serial, name text, client_id int references clients(id), sex text, category_id int references categories(id) ON DELETE CASCADE, PRIMARY KEY(id))"
).then((res) => {
  console.log("exercises is initiated");
});

module.exports = {
  pgClient: pgClient,
};
