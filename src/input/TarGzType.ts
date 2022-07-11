import { extendType } from "cmd-ts";
import { ReadStreamType } from "./ReadStreamType";

import gunzip from "gunzip-maybe";

import tar from "tar-stream";

export const GzType = extendType(ReadStreamType, {
  async from(inputStream) {
    return inputStream.pipe(gunzip());
  },
});

export const TarGzType = extendType(GzType, {
  async from(tarStream) {
    var extract = tar.extract();

    extract.on("entry", function (header, stream, next) {
      console.log(header);

      // header is the tar header
      // stream is the content body (might be an empty stream)
      // call next when you are done with this entry

      stream.on("end", function () {
        next(); // ready for next entry
      });

      stream.resume(); // just auto drain the stream
    });

    extract.on("finish", function () {
      // all entries read
    });

    return tarStream.pipe(extract);
  },
});
