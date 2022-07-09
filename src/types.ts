import { z } from "zod";

export const replaceSchema = z.object({
  src: z.string(),
  trg: z.string(),
  default: z.string().optional(),
});

export const configSchema = z.object({
  include: z.array(z.string()).optional(),
  exclude: z.array(z.string()).optional(),
  define: z.array(replaceSchema.omit({ src: true })).optional(),
  replaceInPath: z.array(replaceSchema).optional(),
  replaceInFile: z.array(replaceSchema).optional(),
});

export type Replace = z.infer<typeof replaceSchema>;
export type Config = z.infer<typeof configSchema>;

type ConfigurationMap = Map<"main" | string, Config>;

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

  configuration: ConfigurationMap;
}

export type TemplateKey = `cookiecutter.${string}`;
