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

  source: String;

  /**
   * a path to the target where the output (the template) will be generated
   */
  target: String;

  configuration: ConfigurationRecord;
}

const generator: CookieGenerator = {
  source: "../../authority-tooling",
  target: "../",
  configuration: {
    main: {
      include: ["*CaseFileQueryAuthorizationService*"],
      exclude: [],

      replace: [
        {
          src: "CaseFileQueryAuthorizationService",
          trg: "{{service-name}}AuthorizationService",
        },
      ],
    },
  },
};
