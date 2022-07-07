import { getHandlebarVariables } from "./getHandlebarVariables";
import { Config } from "./types";
import chalk from "chalk";

export function validateKeys(keys: string[]) {
  function filterbychr(str) {
    var regex = /[a-zA-Z0-9_.]+/g;
    return str
      .match(regex)
      .filter(function (m, i, self) {
        return i == self.indexOf(m);
      })
      .join("");
  }

  keys.map((key) => {
    const filteredKey = filterbychr(key);
    if (filteredKey != key) {
      console.log(
        "key must only contain alphanumeric values and underscores: ",
        chalk.bgRed(key)
      );
      process.exit(-1);
    }
  });
}
export function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
/**
 * extract variable names from handlebars like: {{variable-name}}
 */
export function extractTemplateKeys(config: Config): string[] {
  const anyKeys = config.replace?.map((curr) =>
    getHandlebarVariables(curr.trg)
  );

  const pathKeys = config.replaceInPath?.map((curr) =>
    getHandlebarVariables(curr.trg)
  );

  const fileKeys = config.replaceInFile?.map((curr) =>
    getHandlebarVariables(curr.trg)
  );

  const keys = [
    ...(anyKeys?.flatMap(Object.keys) ?? []),
    ...(pathKeys?.flatMap(Object.keys) ?? []),
    ...(fileKeys?.flatMap(Object.keys) ?? []),
  ];

  var uniqueKeys = keys.filter(onlyUnique);

  return uniqueKeys;
}
