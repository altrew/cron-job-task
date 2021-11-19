# Cron Job Task

Here is my submission for the cron job parser.

## How to run

1. Install Node.js @ 16. (reference `.nvmrc`).
1. `npm install`. (optional: as there are currently no dependencies)

If running locally:
`./cli.js "*/15 0 1,15 * 1-5 /usr/bin/find"`

If running as a dependency:
`cron-job-task "*/15 0 1,15 * 1-5 /usr/bin/find"`

(note: please make sure the cron string is wrapped in quotes so that `process.argv` understands it as one section and does not break it up).

## How its built

This project has been built in Node `v16.13.0` (LTS) as shown in the `.nvmrc`. This project has no dependencies and runs on JS functions alone.

## How it works

1. `./cli.js` Run to initialise functions
   - reads `process.argv` to access cron command
1. `./parser/deconstruct.js` Deconstructs cron command into sections
   - `minute`, `hour`, `dayOfMonth`, `month`, `dayOfWeek`.
1. `./parser/parser.js` Runs parse function on cron expressions.
   - `n-n`, `n`, `*/n`, `*`
1. `./print.js` Prints output of parsed cron.

## Improvements

Given more time I would have made a few improvements:

- introduce tests to make sure scenarios of expressions in cron are checked and all integration works too.
- introduce static typing so each function is clear to understand (input output). This will also help keep datastructure consistent across application.
- static analysis (linting).
- build system to support more versions.
- better git history! :)
