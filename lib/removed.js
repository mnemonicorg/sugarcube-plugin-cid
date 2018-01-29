import {envelope as env} from "@sugarcube/core";
import {size, uniq, flatten, merge, xor, map, isEmpty, first, last, get, pick, filter} from "lodash/fp";
import {videosbyIds} from "./api";

const plugin = (envelope, {cfg, log}) => {
  const key = get("youtube.api_key", cfg);
  const dat = filter(u => u._sc_source === 'youtube_channel')(envelope.data);
  console.log(uniq(flatten(map('_sc_source', envelope.data))));
  const ids = map('id')(dat);
  return videosbyIds(key, ids)
    .then(flatten)
    .then(vids => {
      const yids = map('id', vids);
      const x = xor(yids, ids);
      return x;
    })
    .then(removedIds => {
      log.info(`in ${size(ids)} youtube videos, found ${size(removedIds)} removed videos`);
      log.info(`++++  ${envelope.queries[0]["term"]["cid.incident_date"]["$gte"]}, ${envelope.queries[0]["term"]["cid.incident_date"]["$lt"]}, ${size(dat)}, ${size(removedIds)} ----`);
      log.info(`examples ${first(removedIds)} ${last(removedIds)}`);
      return envelope;    
    });
};

export default plugin;
