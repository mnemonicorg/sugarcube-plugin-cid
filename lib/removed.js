import {envelope as env} from "@sugarcube/core";
import {size, merge, map, isEmpty, get, flatten, pick, filter} from "lodash/fp";
import {videosbyIds} from "./api";

const plugin = (envelope, {cfg, log}) => {
  const key = get("youtube.api_key", cfg);
  const dat = filter(u => u._sc_source === 'youtube_channel')(envelope.data);
  const ids = map('id')(dat);
  return videosbyIds(key, ids)
    .then(filter(isEmpty))
    .then(size)
    .then(c => {
      log.info(`found ${c} removed vids`);
      log.info(`aaaaa ${size(envelope.data)}, ${envelope.queries[0]["term"]["cid.incident_date"]["$gte"]}, ${c} aaaaa`);
      return envelope;    
    });
};

export default plugin;
