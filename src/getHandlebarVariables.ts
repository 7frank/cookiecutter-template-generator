import hb from "handlebars";
import { Replace } from "./types";

/**
 *
 */
export function getHandlebarVariables(entry: Replace): Record<string, Replace> {
  const ast = hb.parse(entry.trg);
  let keys = {};

  for (let i in ast.body) {
    if (ast.body[i].type === "MustacheStatement") {
      const stmt = ast.body[i];

      keys[(stmt as any).path.original] = entry;
    }
  }
  return keys;
}
