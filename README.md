# Cesium Project

This is a simple skeleton project to help you get up and running quickly. It is by no means production ready and you are welcome to customize or otherwise change any aspect of it as you see fit, such as swapping out npm modules, adding linting, etc... You can also throw out the entire skeleton and start fresh. The emphasis is on clean, well thought out code, schema, and tests, not on which particular libraries you use.

## Setup

### PostgreSQL

This project requires a PostgreSQL database. If you do not have PostgreSQL installed, you can run start one via [Docker](https://hub.docker.com/_/postgres):

```sh
docker run --rm -p 5432:5432 -e POSTGRES_PASSWORD=pg_password -d postgres
```

You will need to be able to generate uuids on there, which may be active by default.
If not, and you are getting 'id is undefined' when querying, 

try entering the container 

```sh
docker ps
...
docker exec -it <name> bash
```

and entering

```sh
psql -U postgres
```

Finally,

```sh
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### Database Connection

If you are using the above Docker command, no further action is needed on your part.
If you are using your own database instances, modify `connectionString.js` to point to it before proceeding.

### Important third party libraries

- [restify](http://restify.com/) - is used for the REST API server
- [jasmine](https://jasmine.github.io/) - is used for unit testing
- [slonik](https://github.com/gajus/slonik) - is used for Database calls, query building, and migrations

## Code

- `server.js` - contains the start of a restify-based API server running on 8080.
- `migrations/1724093689333_construction-sites.cjs` - a database migration with [node-pg-migrate](https://salsita.github.io/node-pg-migrate/getting-started) that creates the `construction_sites` table which for the sake of this project is a single column with a uuid-based id that materials can be associated with.
- `connectionString.js` - contains the Database connection string so that it can be shared by multiple files.
- `scripts/` - contains a database script called by package.json for seeding the database.

## Scripts

| Task                  | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `start`               | Runs the server on port 8080                                                |
| `test`                | Runs jasmine unit tests                                                     |
| `db-migrate`          | Applies all pending migrations to the database                              |
| `db-rollback`         | Rolls back last set of database migrations                                  |
| `db-seed`             | Seeds the database with test data                                           |
| `db-create-migration` | Creates a new database migration, takes a single parameter (migration name) |
