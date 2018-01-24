import {envelope as env} from "@sugarcube/core";
import {merge, isEmpty, get, flatten} from "lodash/fp";
import {videosbyIds} from "./api";

const plugin = (envelope, {cfg, log}) => {
  const key = get("youtube.api_key", cfg);
  let count = 0;
  return env
    .fmapDataAsync(u => {
      if (["youtube_channel"].includes(u._sc_source)) {
        console.log(u.id);
        return videosbyIds(key, [u.id])
          .then(flatten)
          .then(r => {
            console.log(r);
            const rr = isEmpty(r);
            console.log(rr);
            if (rr) {
              count += 1;
              return merge(u, {youtubeRemoved: true});
            }
            return u;
          });
      }
      return u;
    }, envelope)
    .then(enn => {
      log.info(`found ${count} removed vids`);
      return enn;
    });
};

export default plugin;
