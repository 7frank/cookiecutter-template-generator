import path from "path";
import { CookieGenerator } from "./types";
import { log } from "./log";
import { fileIterator } from "./generateTemplateFromGeneratorConfig";

export function listPossibleFiles(generator: CookieGenerator) {
  const sourceRoot = path.resolve(generator.source);
  Object.entries(generator.configuration).map(([configurationName, config]) => {
    Object.entries(config.include ?? []).map(([key, p]) => {
      const pathPattern = path.resolve(sourceRoot, p);

      log({ pathPattern });

      fileIterator(pathPattern, config).map(function (sourceFileName) {
        log({ sourceFileName });
      });
    });
  });
}
