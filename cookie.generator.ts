#!/usr/bin/env esrun
import chalk from "chalk";
import { generateTemplateFromGeneratorConfig } from "./src/generateTemplateFromGeneratorConfig";
import { log } from "./src/log";

import { command, binary, run, positional } from "cmd-ts";
import { cookieGeneratorSchema, CookieGenerator } from "./src/types";
import { JSONType } from "./src/ReadStreamType";

interface CLI {
  config: JSON;
}

const args: Record<keyof CLI, any> = {
  config: positional({
    type: JSONType,
    description: "a typescript file that exports a 'Generator' configuration",
  }),
};

async function handler({ config }: CLI) {
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
