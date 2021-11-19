#!/usr/bin/env node

import { parse } from "./parser/parser.js";
import { deconstruct } from "./parser/deconstruct.js";
import { print } from "./print.js";

async function main() {
  const cronString = process.argv[2];
  const deconstructedCron = deconstruct(cronString);

  const parsedOptions = parse(deconstructedCron);

  console.log(print(parsedOptions));
}

main();
