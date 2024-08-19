# TODO

## Meta

- Understand frontend setup to emulate similar folder structure

## Security

- Is the security hashing "quantum safe"?

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

