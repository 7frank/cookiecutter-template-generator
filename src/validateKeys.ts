import {
  getHandlebarVariables,
  getHandlebarVariables2 as getHandlebarVariablesForDefined,
} from "./getHandlebarVariables";
import { Config, Replace, TemplateKey } from "./types";
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

/**
 * extract variable names from handlebars like: {{variable-name}}
 */
export function extractTemplateKeysAndDefaults(
  config: Config,
  otherPotentialKeys?: Replace[]
): Record<TemplateKey, Replace> {
  const otherKeys = otherPotentialKeys?.reduce(
    (acc, curr) => ({ ...acc, ...getHandlebarVariables(curr) }),
    {}
  );

  const definedKeys = config.define?.reduce(
    (acc, curr) => ({ ...acc, ...getHandlebarVariablesForDefined(curr) }),
    {}
  );

  const pathKeys = config.replaceInPath?.reduce(
    (acc, curr) => ({ ...acc, ...getHandlebarVariables(curr) }),
    {}
  );

  const fileKeys = config.replaceInFile?.reduce(
    (acc, curr) => ({ ...acc, ...getHandlebarVariables(curr) }),
    {}
  );

  const keys = {
    ...otherKeys,
    ...pathKeys,
    ...fileKeys,
    ...definedKeys, // add last to override potential previous definitions
  };

  return keys;
}
