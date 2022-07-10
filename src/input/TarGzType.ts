import { extendType } from "cmd-ts";
import { ReadStreamType } from "./ReadStreamType";

import gunzip from "gunzip-maybe";

export const TarGzType = extendType(ReadStreamType, {
  async from(inputStream) {
    return inputStream.pipe(gunzip()).pipe(process.stdout);

    // const t = await readStreamToString(inputStream);
  },
});
