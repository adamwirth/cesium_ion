const restify = require('restify');
const { sql } = require('slonik');
const { randomUUID } = require('crypto');

const getPool = require('./pool.js');

/**
 * Create a server on port (default 8080) and return it.
 * @param {int} port
 * @returns {restify.Server} server
 */
function createServer(port) {
  if (typeof port === 'undefined') port = 8080;

  const server = restify.createServer();
  server.pre(restify.pre.sanitizePath());
  server.pre(restify.pre.userAgentConnection());
  server.use(restify.plugins.bodyParser());

  /* CRUD routes on construction_site table
  * TODO Would like to have these be separated into another folder/file in some way,
  * but spending too much time thinking about it right now
  */

  // Create a construction site
  server.post('/construction-sites', async (req, res) => {
    try {
      const pool = await getPool();
      const { name, volume, cost, color, delivery_date } = req.body;
      const result = await pool.query(
        sql.unsafe`
        INSERT INTO construction_sites (id, name, volume, cost, color, delivery_date)
        VALUES (${randomUUID()}, ${name}, ${volume}, ${cost}, ${color}, ${delivery_date})
        RETURNING *;
      `
      );
      res.send(201, result.rows[0]);
    } catch (err) {
      res.send(500, { error: 'Failed to create construction site.', details: err.message });
    }
  });

  // Read all construction sites
  server.get('/construction-sites', async (req, res) => {
    try {
      const pool = await getPool();
      const result = await pool.query(
        sql.unsafe`
        SELECT * FROM construction_sites;
      `
      );
      res.send(200, result.rows);
    } catch (err) {
      res.send(500, { error: 'Failed to retrieve construction sites.', details: err.message });
    }
  });

  // Read a single construction site by ID
  server.get('/construction-sites/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await getPool();
      const result = await pool.query(
        sql.unsafe`
        SELECT * FROM construction_sites WHERE id = ${id};
      `
      );
      console.debug( { result });
      if (result.rowCount === 0) {
        res.send(404, { error: 'Construction site not found.' });
      } else {
        res.send(200, result.rows[0]);
      }
    } catch (err) {
      res.send(500, { error: 'Failed to retrieve construction site.', details: err.message });
    }
  });

  // Update a construction site by ID
  server.put('/construction-sites/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, volume, cost, color, delivery_date } = req.body;
      const pool = await getPool();
      const result = await pool.query(
        sql.unsafe`
        UPDATE construction_sites
        SET name = ${name}, volume = ${volume}, cost = ${cost}, color = ${color}, delivery_date = ${delivery_date}
        WHERE id = ${id}
        RETURNING *;
      `
      );
      if (result.rowCount === 0) {
        res.send(404, { error: 'Construction site not found.' });
      } else {
        res.send(200, result.rows[0]);
      }
    } catch (err) {
      res.send(500, { error: 'Failed to update construction site.', details: err.message });
    }
  });

  // Delete a construction site by ID
  server.del('/construction-sites/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const pool = await getPool();
      const result = await pool.query(
        sql.unsafe`
        DELETE FROM construction_sites WHERE id = ${id} RETURNING *;
      `
      );
      if (result.rowCount === 0) {
        res.send(404, { error: 'Construction site not found.' });
      } else {
        res.send(200, { message: 'Construction site deleted.' });
      }
    } catch (err) {
      res.send(500, { error: 'Failed to delete construction site.', details: err.message });
    }
  });
  
  let shuttingDown = false;
  function shutdown() {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;

    const shutdownTimeout = setTimeout(function() {
      console.log("Shutdown failed, terminating process.");
      process.exit(0);
    }, 5000);

    console.log("Closing server connections...");
    server.close(() => {
      console.log("Closing database connections...");
      getPool()
        .then((pool) => pool.end())
        .finally(() => {
          clearTimeout(shutdownTimeout);
          console.log("Server shutdown successful!");
          process.exit(0);
        });
    });
  }

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return server;
}

module.exports = createServer;