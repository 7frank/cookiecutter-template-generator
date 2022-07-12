import path from "path";
import { CookieGenerator } from "./types";
import { log } from "./log";
import { fileSubject$ } from "./generateTemplateFromGeneratorConfig";

export function listPossibleFiles(pattern: string, generator: CookieGenerator) {
  const sourceRoot = path.resolve(generator.source);
  Object.entries(generator.configuration).map(([configurationName, config]) => {
    Object.entries(config.include ?? []).map(([key, p]) => {
      const pathPattern = path.resolve(sourceRoot, p, pattern);
      fileSubject$(pathPattern, config).map(function (sourceFileName) {
        console.log(sourceFileName);
      });
    });
  });
}
