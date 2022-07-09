import glob from "glob";
import fs from "fs";
import path from "path";
import { log } from "../cookie.generator";
import { CookieGenerator, Replace, TemplateKey } from "./types";
import { extractTemplateKeysAndDefaults, validateKeys } from "./validateKeys";

/**
 * MVP outline - work in progress
 *
 * - traverse file system (find & exclude files)
 * - replace in path
 * - replace in file
 * - copy result
 * - create cookiecutter.json with template parameters
 */
export function generateTemplateFromGeneratorConfig(
  generator: CookieGenerator
) {
  const sourceRoot = path.resolve(generator.source);
  const targetRoot = path.resolve(generator.target);

  const cookieCutterKeysPerConfig: Record<
    string,
    Record<TemplateKey, Replace>
  > = {};

  Object.entries(generator.configuration).map(([configurationName, config]) => {
    Object.entries(config.include ?? []).map(([key, p]) => {
      const pathPattern = path.resolve(sourceRoot, p);

      log({ pathPattern });

      glob
        .sync(pathPattern, { ignore: config.exclude })
        .map(function (sourceFileName) {
          log({ sourceFileName });

          const sourceFileAndPathWithoutRoot = sourceFileName.replace(
            sourceRoot,
            "."
          );

          const targetFileName = path.resolve(
            targetRoot,
            generator.repository,
            sourceFileAndPathWithoutRoot
          );

          const templatedTargetFileName = config.replaceInPath
            ? config.replaceInPath.reduce(
                (acc, curr) => acc.replace(new RegExp(curr.src, "g"), curr.trg),
                targetFileName
              )
            : targetFileName;

          log("copying files", {
            sourceFileName,
            templatedTargetFileName,
          });

          const fileContent = fs.readFileSync(sourceFileName).toString();

          const templatedData = config.replaceInFile
            ? config.replaceInFile.reduce(
                (acc, curr) => acc.replace(new RegExp(curr.src, "g"), curr.trg),
                fileContent
              )
            : fileContent;

          const keysAndValues = extractTemplateKeysAndDefaults(config, [
            { src: "MyRepository", trg: generator.repository },
          ]);

          validateKeys(Object.keys(keysAndValues));

          cookieCutterKeysPerConfig[configurationName] = keysAndValues;

          fs.mkdirSync(path.dirname(templatedTargetFileName), {
            recursive: true,
          });
          fs.writeFileSync(templatedTargetFileName, templatedData, {});
        });
    });
  });

  const configFileName = path.resolve(targetRoot, "cookiecutter.json");

  const cookieCutterVariables = extractCookieCutterJson(
    cookieCutterKeysPerConfig
  );

  log("following keys are available in cookiecutter.json", {
    configFileName,
    cookieCutterKeysPerConfig,
    cookieCutterVariables,
  });

  fs.writeFileSync(
    configFileName,
    JSON.stringify(cookieCutterVariables, null, "  "),
    {}
  );
}

/**
 * Extracts an object sufficient for  the cookiecutter.json schema
 */
function extractCookieCutterJson(
  cookieCutterKeysPerConfig: Record<
    string,
    Record<`cookiecutter.${string}`, Replace>
  >
) {
  const cookieCutterEntriesObject = Object.values(
    cookieCutterKeysPerConfig
  ).reduce(function (result, current) {
    return Object.assign(result, current);
  }, {});

  const cookieCutterVariables = Object.entries(
    cookieCutterEntriesObject
  ).reduce((acc, [ccKey, replace]) => {
    ccKey = ccKey.replace("cookiecutter.", "");

    acc[ccKey] = replace.src;
    return acc;
  }, {} as Record<string, string>);
  return cookieCutterVariables;
}
