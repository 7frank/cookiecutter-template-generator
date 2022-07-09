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

      define: [
        {
          trg: "{{cookiecutter.auth_z_service_prefix}}",
          default: "CaseFileQuery",
        },
      ],
      replaceInPath: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{cookiecutter.auth_z_service_prefix}}AuthorizationService",
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
          trg: "{{cookiecutter.service_name}}",
          default: "{{cookiecutter.auth_z_service_prefix}}AuthorizationService",
        },
        {
          src: "CaseFileQueryAuthorizationCheck",
          trg: "{{cookiecutter.check_name}}",
          default: "{{cookiecutter.auth_z_service_prefix}}AuthorizationCheck",
        },
        {
          src: "checkCaseFileQueryEntitlement",
          trg: "{{cookiecutter.check_method_name}}",
          default: "check{{cookiecutter.auth_z_service_prefix}}Entitlement",
        },
        {
          src: "No permission to query case file.",
          trg: "{{cookiecutter.default_service_error}}",
          default:
            "No permission to initiate {{cookiecutter.auth_z_service_prefix}}.",
        },
      ],
    },
  },
};

log(chalk.green("Let's a go!"));
generateTemplateFromGeneratorConfig(generator);
