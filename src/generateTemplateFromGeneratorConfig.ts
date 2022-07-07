import glob from "glob";
import fs from "fs";
import path from "path";
import { getHandlebarVariables } from "./getHandlebarVariables";
import { log } from "../cookie.generator";
import { Config, CookieGenerator } from "./types";

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

  const cookieCutterKeysPerConfig = {};

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
            targetFileName,
            templatedTargetFileName,
          });

          const fileContent = fs.readFileSync(sourceFileName).toString();

          const templatedData = config.replaceInFile
            ? config.replaceInFile.reduce(
                (acc, curr) => acc.replace(new RegExp(curr.src, "g"), curr.trg),
                fileContent
              )
            : fileContent;

          const keys = extractTemplateKeys(config);

          cookieCutterKeysPerConfig[configurationName] = keys;

          fs.mkdirSync(path.dirname(templatedTargetFileName), {
            recursive: true,
          });
          fs.writeFileSync(templatedTargetFileName, templatedData, {});
        });
    });
  });

  const configFileName = path.resolve(targetRoot, "cookiecutter.json");

  const cookieCutterVariables = Object.values(cookieCutterKeysPerConfig)
    .flat()
    .filter(onlyUnique)
    .reduce((acc, curr) => {
      (acc as any)[curr as string] = "";
      return acc;
    }, {});

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

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 * extract variable names from handlebars like: {{variable-name}}
 */

function extractTemplateKeys(config: Config): string[] {
  const anyKeys = config.replace?.map((curr) =>
    getHandlebarVariables(curr.trg)
  );

  const pathKeys = config.replaceInPath?.map((curr) =>
    getHandlebarVariables(curr.trg)
  );

  const fileKeys = config.replaceInFile?.map((curr) =>
    getHandlebarVariables(curr.trg)
  );

  const keys = [
    ...(anyKeys?.flatMap(Object.keys) ?? []),
    ...(pathKeys?.flatMap(Object.keys) ?? []),
    ...(fileKeys?.flatMap(Object.keys) ?? []),
  ];

  var uniqueKeys = keys.filter(onlyUnique);

  return uniqueKeys;
}
