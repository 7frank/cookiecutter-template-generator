import { CookieGenerator } from "../src/types";
import { createPossibleIdentifiersf as createPossibleIdentifiers } from "../src/utils/permutator";

/**
 * Note: atm this template does not create a cookiecutter template but instead skips the templating part by driectly replacing occurences
 */

const identifiers = createPossibleIdentifiers([
  "vehicle",
  "position",
  "inquiry",
]);

/**
 * TODO instead try to define variables via https://cookiecutter.readthedocs.io/en/stable/advanced/private_variables.html?highlight=lower
 *  define  "__rendered": "{{ cookiecutter.project_name|lower }}"
 * _not_rendered
 */

const generator: CookieGenerator = {
  source: "../authority-tooling",
  repository: "{{cookiecutter.repository_name}}",
  target: "./out2",
  configuration: {
    main: {
      include: ["**/ui-api-rest-core-component-vehiclepositioninquiry/**"],
      exclude: [".git", "**/build/libs/**"],
      replaceInPath: [],
      replaceInFile: [],
    },
  },
};

console.log(JSON.stringify(generator, null, "  "));
