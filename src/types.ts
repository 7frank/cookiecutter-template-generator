export interface Replace {
  src: string;
  trg: string;
  default?: string;
}
export interface Config {
  /**
   * paths of files that we want to include in the copy and replace process
   */
  include?: string[];
  /**
   * path pattern that will be excluded e.g. "**\/*.js"
   */
  exclude?: string[];
  /**
   * define variables that are used by others
   */
  define?: Omit<Replace, "src">[];
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

  /**
   * a string containing a handlebar  e.g. {{cookiecutter.repository_name}} which is required by cookiecutter to generate code from a template
   */
  repository: string;

  configuration: ConfigurationRecord;
}

export type TemplateKey = `cookiecutter.${string}`;
