#!/usr/bin/env esrun
import chalk from "chalk";
import { generateTemplateFromGeneratorConfig } from "./src/generateTemplateFromGeneratorConfig";
import { log } from "./src/log";
import * as fs from "fs";

import { command, binary, run, option, string } from "cmd-ts";

interface CLI {
  config: string;
}

const args: Record<keyof CLI, any> = {
  config: option({
    long: "config",
    short: "c",
    type: string,
    description: "a typescript file that exports a 'Generator' configuration",
  }),
};

async function handler({ config }: CLI) {
  if (!fs.existsSync(config)) {
    log("Must specify config file.");
    process.exit(-1);
  }

  if (config.endsWith(".ts")) config = config.replace(".ts", "");

  // FIXME it seems that we cannot import dynamically defined strings
  // const { default: generator } = await import(config.replace(".ts", ""));
  const { default: generator } = await import("./examples/auth-service");

  log(chalk.green("Let's a go!"));
  generateTemplateFromGeneratorConfig(generator);
}

const cli = command({
  name: "cli",
  args,
  handler: handler as any,
});

run(binary(cli), process.argv);
