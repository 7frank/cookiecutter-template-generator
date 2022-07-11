import { CookieGenerator } from "../src/types";
import {
  createPossibleIdentifiers,
  createPossibleIdentifiersPlaceholders,
} from "./utils/permutator";

/**
 * Note: atm this template does not create a cookiecutter template but instead skips the templating part by driectly replacing occurences
 */

const identifiers = createPossibleIdentifiersPlaceholders([
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
      define: identifiers.define,
      replaceInPath: [...identifiers.replace],
      replaceInFile: [...identifiers.replace],
    },
  },
};

console.log(JSON.stringify(generator, null, "  "));
