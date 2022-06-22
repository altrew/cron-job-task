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

    // split the values by potential commas
    const splitValues = val.split(",");

    const newExport = [];

    for (const nestedValue of splitValues) {
      const nestedParse =
        parseAll(key, nestedValue) ||
        parseSteps(key, nestedValue) ||
        parseRange(key, nestedValue) ||
        parseList(key, nestedValue);

      if (!nestedParse)
        throw new Error(`could not parse ${nestedValue} for ${key}`);

      newExport.push(...nestedParse);
    }

    cronExport[key] = newExport;
  }

  return cronExport;
};

// */n
// todo: matches for non standard m/n (not required in spec)
const stepRegex = /((\d+)-?(\d+)?|\*)\/(\d+)/;
const parseSteps = (unit, stepString) => {
  const match = stepString?.match(stepRegex);

  if (!match) return false;

  let [, , matchMin, matchMax, repeatTimes] = match;

  if (matchMin === "*") matchMin = 0;

  const [min, max] = maxMinUnits[unit];

  if (matchMin < min)
    throw new Error(
      `Steps Failed: on ${unit}, min match cannot be less than unit.`
    );
  if (matchMax > max)
    throw new Error(
      `Steps Failed: on ${unit}, max match cannot be greater than unit.`
    );

  if (repeatTimes > max)
    throw new Error(`Steps Failed: on ${unit} cannot be greater than ${max}`);
  if (repeatTimes < min)
    throw new Error(`Steps Failed: on ${unit} cannot be less than ${min}`);

  const maxMinusValue = matchMax !== undefined ? max - +matchMax : 0;

  const amountOfUnits = max - min - +matchMin - maxMinusValue;
  const times = Math.floor(+amountOfUnits / +repeatTimes) + 1;

  return Array.from(
    { length: times },
    (_, index) => +matchMin + min + index * +repeatTimes
  );
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
