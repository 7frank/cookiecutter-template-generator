import { extendType } from "cmd-ts";
import { ReadStreamType, readStreamToString } from "./ReadStreamType";

export const JSONType = extendType(ReadStreamType, {
  async from(inputStream) {
    const t = await readStreamToString(inputStream);

    return JSON.parse(t);
  },
});
