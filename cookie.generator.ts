import chalk from "chalk";
import debug from "debug";
import { CookieGenerator } from "./src/types";
import { generateTemplateFromGeneratorConfig } from "./src/generateTemplateFromGeneratorConfig";

export const log = debug("c-t-g");

const generator: CookieGenerator = {
  source: "../authority-tooling",
  target: "./out",
  configuration: {
    main: {
      include: ["**/*CaseFileQueryAuthorizationService*"],
      exclude: [".git", "**/app/build/**"],
      replaceInPath: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{service-name}}AuthorizationService",
        },
      ],
      replaceInFile: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{service-name}}AuthorizationService",
        },
        {
          src: "CaseFileQueryAuthorizationCheck",
          trg: "{{check-name}}AuthorizationCheck",
        },
        {
          src: "No permission to query case file.",
          trg: "{{default-service-error}}",
        },
        {
          src: "checkCaseFileQueryEntitlement",
          trg: "{{check-method-name}}",
        },
      ],
    },
  },
};

log(chalk.green("Let's a go!"));
generateTemplateFromGeneratorConfig(generator);
