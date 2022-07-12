import glob from "glob";
import fs from "fs";
import path from "path";
import Rx from "rxjs";

import {
  Config,
  CookieGenerator,
  FileDescriptor,
  FileDescriptorSubject,
  Replace,
  TemplateKey,
} from "./types";
import { extractTemplateKeysAndDefaults, validateKeys } from "./validateKeys";
import { log } from "./log";

export function fileSubject$(
  pathPattern: string,
  config: Config
): FileDescriptorSubject {
  var eventStream = new Rx.Subject<FileDescriptor>();

  glob(
    pathPattern,
    { ignore: config.exclude, nodir: true },
    function (err, files) {
      files.map((sourceFileName) => {
        const fileContent = fs.readFileSync(sourceFileName).toString();
        eventStream.next({ name: sourceFileName, content: fileContent });
      });
    }
  );

  return eventStream;
}

/**
 * MVP outline - work in progress
 *
 * - traverse file system (find & exclude files)
 * - replace in path
 * - replace in file
 * - copy result
 * - create cookiecutter.json with template parameters
 */
export async function generateTemplateFromGeneratorConfig(
  generator: CookieGenerator,
  { input }: { input?: FileDescriptorSubject }
) {
  // TODO do something with the input stream
  // if (input) {
  //   var observer: Partial<Rx.Observer<FileDescriptor>> = {
  //     next: function (next) {
  //       console.log(next);
  //     },
  //     error: function (error) {
  //       console.log(error);
  //     },

  //     complete: function () {
  //       console.log("done");
  //     },
  //   };

  //   input.subscribe(observer);
  // }

  /*
  const subject$=fileSubject$(pathPattern, config)
   
      const value: boolean = await Rx.of(subject$).toPromise();
  */

  const sourceRoot = path.resolve(generator.source);
  const targetRoot = path.resolve(generator.target);

  const cookieCutterKeysPerConfig: Record<
    string,
    Record<TemplateKey, Replace>
  > = {};

  for await (const [configurationName, config] of Object.entries(
    generator.configuration
  )) {
    for await (const [key, p] of Object.entries(config.include ?? [])) {
      const pathPattern = path.resolve(sourceRoot, p);

      log({ pathPattern });

      const subject$ = fileSubject$(pathPattern, config);

      subject$.subscribe(function ({
        name: sourceFileName,
        content: fileContent,
      }) {
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

      await Rx.firstValueFrom(subject$);
    }
  }

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

    acc[ccKey] = replace.default ?? replace.src;
    return acc;
  }, {} as Record<string, string>);
  return cookieCutterVariables;
}
