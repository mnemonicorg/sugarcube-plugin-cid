import {envelope as env} from "@sugarcube/core";
import {size, uniq, flatten, merge, xor, map, isEmpty, get, pick, filter} from "lodash/fp";
var fs = require('fs');
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
      log.info(`found ${size(removedIds)} removed vids`);
      log.info(`aaaaa ${size(dat)}, ${envelope.queries[0]["term"]["cid.incident_date"]["$gte"]}, ${size(removedIds)} bbbbb`);
      return envelope;    
    });
};

export default plugin;
