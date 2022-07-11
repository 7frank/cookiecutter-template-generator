import { CookieGenerator } from "../src/types";
import { createPossibleIdentifiersf as createPossibleIdentifiers } from "../src/utils/permutator";

console.log(createPossibleIdentifiers(["vehicle", "position", "inquiry"]));

const generator: CookieGenerator = {
  source: "../authority-tooling",
  repository: "{{cookiecutter.repository_name}}",
  target: "./out2",
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
      replaceInPath: [],
      replaceInFile: [],
    },
  },
};

console.log(JSON.stringify(generator, null, "  "));
