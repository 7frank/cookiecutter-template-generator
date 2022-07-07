import glob from "glob";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import debug from "debug";

const log = debug("c-t-g");

interface Replace {
  src: string;
  trg: string;
}

interface Config {
  /**
   * paths of files that we want to include in the copy and replace process
   */
  include?: string[];
  exclude?: string[];
  replace?: Replace[];
  replaceInPath?: Replace[];
  replaceInFile?: Replace[];
}

type ConfigurationRecord = Record<"main" | string, Config>;

interface CookieGenerator {
  /**
   * a path to the root of a project or root of a github repo
   */

  source: string;

  /**
   * a path to the target where the output (the template) will be generated
   */
  target: string;

  configuration: ConfigurationRecord;
}

const generator: CookieGenerator = {
  source: "../authority-tooling",
  target: "./template-out",
  configuration: {
    main: {
      include: ["**/*CaseFileQueryAuthorizationService*"],
      exclude: [".git", "**/app/build/**"],
      replaceInPath: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{service-name}}AuthorizationService",
        },
      ],
      replaceInFile: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{service-name}}AuthorizationService",
        },
      ],
    },
  },
};

/**
 * MVP outline - work in progress
 *
 * - traverse file system (find & exclude files)
 * - replace in path
 * - replace in file
 * - copy result
 * - create cookiecutter.json with template parameters
 */

function generateTemplateFromGeneratorConfig(generator: CookieGenerator) {
  const sourceRoot = path.resolve(generator.source);
  const targetRoot = path.resolve(generator.target);

  Object.entries(generator.configuration).map(([key, config]) => {
    Object.entries(config.include ?? []).map(([key, p]) => {
      const pathPattern = path.resolve(sourceRoot, p);

      log({ pathPattern });

      glob(pathPattern, { ignore: config.exclude }, function (e, files) {
        log({ files, e });

        files.map((sourceFileName) => {
          const sourceFileAndPathWithoutRoot = sourceFileName.replace(
            sourceRoot,
            "."
          );

          const targetFileName = path.resolve(
            targetRoot,
            sourceFileAndPathWithoutRoot
          );

          log("copying files", {
            sourceFileName,
            targetFileName,
          });

          //fs.copyFileSync(sourceFileName, targetFileName);
        });
      });
    });
  });
}

log(chalk.green("Let's a go!"));
generateTemplateFromGeneratorConfig(generator);
