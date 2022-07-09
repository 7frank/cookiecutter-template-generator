import chalk from "chalk";
import debug from "debug";
import { CookieGenerator } from "./src/types";
import { generateTemplateFromGeneratorConfig } from "./src/generateTemplateFromGeneratorConfig";

export const log = debug("c-t-g");

const generator: CookieGenerator = {
  source: "../authority-tooling",
  repository: "{{cookiecutter.repository_name}}",
  target: "./out",
  configuration: {
    main: {
      include: ["**/*CaseFileQueryAuthorizationService*"],
      exclude: [".git", "**/app/build/**"],
      replaceInPath: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{cookiecutter.service_name}}AuthorizationService",
        },
        {
          src: "core-component-casefile-application",
          trg: "{{cookiecutter.module_dirname}}",
        },
        {
          src: "core/component/casefile/application",
          trg: "{{cookiecutter.module_path}}",
          default:
            "{{ cookiecutter.module_dirname.lower().replace('-', '/') }}",
        },
      ],
      replaceInFile: [
        {
          src: "package com.daimler.mats.core.component.casefile.application.authorization;",
          trg: "package com.daimler.mats.{{cookiecutter.package_name}}.authorization;",
          default:
            "{{ cookiecutter.module_dirname.lower().replace('-', '.') }}",
        },
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{cookiecutter.service_name}}AuthorizationService",
        },
        {
          src: "CaseFileQueryAuthorizationCheck",
          trg: "{{cookiecutter.check_name}}AuthorizationCheck",
        },
        {
          src: "No permission to query case file.",
          trg: "{{cookiecutter.default_service_error}}",
        },
        {
          src: "checkCaseFileQueryEntitlement",
          trg: "{{cookiecutter.check_method_name}}",
        },
      ],
    },
  },
};

log(chalk.green("Let's a go!"));
generateTemplateFromGeneratorConfig(generator);
