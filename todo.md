# TODO

File to encapsulate bigger ideas than the time scope or expand on existing changes.

## Meta

- Understand frontend setup to emulate similar folder structure
- Do people have opinions on using `.cjs`, `.mjs` file extensions? This seems like the best way to mix opinionated packages, but could be a dealbreaker for devs

## Security

- Is the security hashing "quantum safe"?
- Best way to store env variables. Currently isn't "real" so I am reusing the postgresql string willy-nilly
- Best way to have UUIDs generated, ideally deferred to postgres and not done over here

## Future Proofing and futurizing

- Typescript
  - I feel weird about adding typescript. Research shows it catches bugs, but also in my experience, it can take up a lot of developer time.
    I think its the way the ecosystem is going to continue to go, and it can be valuable, but probably not for this half-day project.
    Looking at Node.js' EoL timeline and trying to future-proof, does feel like Typescript is worth pursuing...
- import instead of require/export

## Knex

- Seeing Knex's promise chain took me [down a rabbit hole](https://gajus.medium.com/stop-using-knex-js-and-earn-30-bf410349856c) that made me want to use [something else](https://github.com/gajus/slonik)
  - Knex's documentation still embraces the promise chaining, which could be fine... makes me nervous for starting a project there in 2024 though.
- I didn't see a way to "tree-shake" out unrelated query systems from Knex's import.
  This isn't a big deal.

## Small

- Update packages
- Making `.dockerignore` possibly relevant since its part of the workflow, albeit unrepresented in files
  - Maybe there's a way to have those in some `/env/` nested folder so the sidebar doesn't bloat up with more of those.
      Or I should just ignore hidden files...

## Migrating

- I quite like [this package](https://salsita.github.io/node-pg-migrate/) from evaluating options
  It does make for a different workflow though.

## DB Choices

- I feel like I have been convinced back and forth about varchar versus string type and I don't know which to pick now

## Logging

- Not sure what logger we want to use, can just use console.log for now and assume we have some third-party ($$$) that'll pick those up
