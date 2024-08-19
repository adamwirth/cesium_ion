const { createPool } = require('slonik');
const connectionString = require('./connectionString');

// Attempting to potentially reuse the pool. Can import this module/file instead of duplicating code
let pool;

async function initializePool() {
  if (!pool) {
    pool = await createPool(connectionString);
  }
  return pool;
}

module.exports = async function getPool() {
  if (!pool) {
    await initializePool();
  }
  return pool;
};
