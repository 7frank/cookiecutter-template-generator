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
      exclude: [".git"],

      replace: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{service-name}}AuthorizationService",
        },
      ],
    },
  },
};

log(chalk.green("Let's a go!"));

const root = path.resolve(generator.source);

Object.entries(generator.configuration).map(([key, config]) => {
  Object.entries(config.include ?? []).map(([key, p]) => {
    const pathPattern = path.resolve(root, p);

    log({ pathPattern });

    // options is optional
    glob(pathPattern, {}, function (e, files) {
      // files is an array of filenames.
      // If the `nonull` option is set, and nothing
      // was found, then files is ["**/*.js"]
      // er is an error object or null.
      log({ files, e });
      fs.copyFileSync;
    });
  });
});
