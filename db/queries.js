const create_clients =
  "CREATE TABLE IF NOT EXISTS clients (id serial, data json, PRIMARY KEY(id))";

const create_categories =
  "CREATE TABLE IF NOT EXISTS categories (id serial, name text unique, PRIMARY KEY(id))";

const init_categories = `insert into categories (name) values ('Ноги'), ('Грудь'), ('Спина'), ('Плечі'), ('Руки'), ('Аеробне')
  on conflict (name) do update set name = excluded.name;`;

const create_exercises =
  "CREATE TABLE IF NOT EXISTS exercises (id serial, name text, sex text, category_id int references categories(id), PRIMARY KEY(id))";

const create_client_base =
  "CREATE TABLE IF NOT EXISTS clients_base (id serial, client_id int references clients(id), PRIMARY KEY(id))";

const create_client_base_exercises =
  "CREATE TABLE IF NOT EXISTS clients_base_exercises (base_id int references clients_base(id), exercise_id int references exercises(id), data json, PRIMARY KEY(base_id, exercise_id))";

module.exports = {
  create_clients,
  create_categories,
  init_categories,
  create_exercises,
  create_client_base,
  create_client_base_exercises,
};
