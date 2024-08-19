import { randomUUID } from 'crypto';
import {
  createPool, sql
} from 'slonik';

import connectionString from '../connectionString.js';

// const construction_sites = z.object({
//   id: z.number(),
//   name: z.string(),
// });

const pool = await createPool(connectionString);

const main = async () => {
  // Delete all existing sites and create some dummy sites.
  // todo add zod types
  await pool.query(sql.unsafe`
    DELETE FROM construction_sites returning *;
  `);
  // todo could do as 1 transaction instead of 10 inserts in a loop now
  for (let i = 0; i < 10; i++) {
    
    const project = await pool.query(
      sql.unsafe`
    INSERT INTO construction_sites (id) VALUES (${randomUUID()})
    `)

    console.log(`Created construction site with id ${project[0].id}`);
  }

  await pool.end();
}

main();
