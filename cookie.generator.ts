#!/usr/bin/env esrun
import chalk from "chalk";
import { generateTemplateFromGeneratorConfig } from "./src/generateTemplateFromGeneratorConfig";
import { log } from "./src/log";

import {
  command,
  binary,
  run,
  positional,
  option,
  optional,
  string,
} from "cmd-ts";
import { cookieGeneratorSchema, CookieGenerator } from "./src/types";
import { JSONType } from "./src/input/JsonType";
import { ReadStream } from "fs";
import { TarGzType } from "./src/input/TarGzType";
import { listPossibleFiles } from "./src/listPossibleFiles";

interface CLI {
  config: JSON;
  input?: ReadStream;
  pattern?: string;
}

const args: Record<keyof CLI, any> = {
  config: positional({
    type: JSONType,
    description: "a typescript file that exports a 'Generator' configuration",
  }),
  input: option({
    type: optional(TarGzType),
    long: "input",
    short: "i",
    description:
      "a tar gz file or url to such a file which will override the 'source' property of the configuration",
  }),
  pattern: option({
    type: optional(string),
    long: "pattern",
    short: "p",
    description: "applies this pattern and lists all files that match",
  }),
};

async function handler({ config, input, pattern }: CLI) {
  let generator: CookieGenerator;
  try {
    generator = cookieGeneratorSchema.parse(config);
  } catch (e) {
    console.log(chalk.red("The provided generator configuration is invalid:"));
    console.log(
      chalk.bgRed(
        typeof config == "object" ? JSON.stringify(config, null, "  ") : config
      )
    );
    console.log(chalk.red("The following syntax error was thrown:"));
    console.log(chalk.bgRed(e.message));

    process.exit(-1);
  }

  if (pattern) {
    listPossibleFiles(pattern, generator);
    process.exit(0);
  }

  // TODO do something with the input stream
  input?.pipe(process.stdout).on("error", (err) => {
    console.error(err);
  });

  log(chalk.green("Let's a go!"));
  generateTemplateFromGeneratorConfig(generator);
}

const cli = command({
  name: "cookiecutter template generator",
  description:
    "A meta generator for https://github.com/cookiecutter/cookiecutter",
  args,
  handler: handler as any,
});

run(binary(cli), process.argv);
