import hb from "handlebars";

/**
 *
 */
export function getHandlebarVariables(value: string) {
  const ast = hb.parse(value);
  let keys = {};

  for (let i in ast.body) {
    if (ast.body[i].type === "MustacheStatement") {
      const stmt = ast.body[i];

      keys[(stmt as any).path.original] = true;
    }
  }
  return keys;
}
