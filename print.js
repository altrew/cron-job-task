export const camelToSentence = (camel) =>
  camel.replace(/([a-z])([A-Z])/g, (_, p1, p2) => {
    return `${p1} ${p2.toLowerCase()}`;
  });

export const print = (parsedCron) => {
  let output = "";

  const cronEntries = Object.entries(parsedCron);
  const longestKey = 12;

  for (const [key, value] of cronEntries) {
    const readableKey = camelToSentence(key);
    output += readableKey;

    output += " ".repeat(longestKey - readableKey.length + 2);

    output += value.join(" ");
    output += "\n";
  }

  return output;
};
