interface Replace {
  src: string;
  trg: string;
}
export interface Config {
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

export interface CookieGenerator {
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