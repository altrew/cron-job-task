import { maxMinUnits } from "./constants.js";

// run all parsing functions over cron sections.
export const parse = (deconstructedCron) => {
  const cronEntries = Object.entries(deconstructedCron);

  const cronExport = {};

  for (const [key, val] of cronEntries) {
    if (key === "command") {
      cronExport["command"] = val;
      continue;
    }

    const newExport =
      parseAll(key, val) ||
      parseSteps(key, val) ||
      parseRange(key, val) ||
      parseList(key, val);

    if (!newExport) throw new Error(`could not parse ${val} for ${key}`);

    cronExport[key] = newExport;
  }

  return cronExport;
};

// */n
// todo: matches for non standard m/n (not required in spec)
const stepRegex = /\*\/(\d+)/;
const parseSteps = (unit, stepString) => {
  const match = stepString?.match(stepRegex);

  if (!match) return false;

  const [, repeatTimes] = match;
  const [min, max] = maxMinUnits[unit];

  if (repeatTimes > max)
    throw new Error(`Steps Failed: on ${unit} cannot be greater than ${max}`);
  if (repeatTimes < min)
    throw new Error(`Steps Failed: on ${unit} cannot be less than ${min}`);

  const amountOfUnits = max - min;
  const times = Math.floor(amountOfUnits / repeatTimes) + 1;

  return Array.from({ length: times }, (_, index) => min + index * repeatTimes);
};

// n-n
const rangeRegex = /^(\d+)-(\d+)$/;
const parseRange = (unit, rangeString) => {
  const match = rangeString?.match(rangeRegex);

  if (!match) return false;

  const [, rangeStart, rangeEnd] = match.map((s) => parseInt(s));
  const [min, max] = maxMinUnits[unit];

  if (rangeStart < min || rangeEnd > max)
    throw new Error(
      `Range Failed: ${rangeStart}-${rangeEnd} is out of ${unit} ${min}-${max}`
    );

  const rangeLength = rangeEnd - rangeStart + 1;

  return Array.from({ length: rangeLength }, (_, i) => rangeStart + i);
};

// n,n,n | n
const listRegex = /^(\d+)(,\d+)*$/;
const parseList = (unit, listString) => {
  const match = listString?.match(listRegex);

  if (!match) return false;

  const list = listString.split(",").map((d) => parseInt(d));

  const [min, max] = maxMinUnits[unit];

  // outside of limit
  if (list.some((x) => x < min || x > max))
    throw new Error(`ListError: ${unit} is out of range.`);

  return listString.split(",").map((d) => parseInt(d));
};

const parseAll = (unit, allString) => {
  if (allString !== "*") {
    return false;
  }

  const [min, max] = maxMinUnits[unit];

  const rangeLength = max - min + 1;

  return Array.from({ length: rangeLength }, (_, i) => min + i);
};
