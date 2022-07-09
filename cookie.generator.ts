import chalk from "chalk";
import debug from "debug";
import { CookieGenerator } from "./src/types";
import { generateTemplateFromGeneratorConfig } from "./src/generateTemplateFromGeneratorConfig";
import generator from "./examples/auth-service";

export const log = debug("c-t-g");

log(chalk.green("Let's a go!"));
generateTemplateFromGeneratorConfig(generator);
