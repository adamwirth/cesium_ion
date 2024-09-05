import { randomUUID } from 'crypto';
import {
  createPool, sql
} from 'slonik';

import connectionString from '../connectionString.js';

/* TODO Would like to add "zod types" like this
// const construction_sites = z.object({
//   id: z.number(),
//   name: z.string(),
// });
*/

const pool = await createPool(connectionString);

/**
 * Delete all existing sites and create some dummy sites.
 */
const main = async () => {
  // todo add zod types
  try {
    await pool.query(sql.unsafe`
      DELETE FROM construction_sites;
    `);
  } catch (err) {
    // Check if the error is related to the table not existing
    if (err.message.includes('relation "construction_sites" does not exist')) {
      console.log('Hey, it looks like the table "construction_sites" does not exist.');
      console.log('You should run:');
      console.log('> npm run db-migrate');
    } else {
      // If it's another error, rethrow it or log it differently
      console.error('An unexpected error occurred:', err);
    }
  }
  // todo could do as 1 transaction instead of 10 inserts in a loop now
  for (let i = 0; i < 10; i++) {
    const project = await pool.query(
      sql.unsafe`
    INSERT INTO construction_sites (id) VALUES (${randomUUID()})
    `)
    console.log(`Created construction site with id ${Object.entries(project)}`);
  }

  await pool.end();
}

main();
