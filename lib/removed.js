import {envelope as env} from "@sugarcube/core";
import {size, uniq, flatten, merge, xor, map, isEmpty, first, last, get, pick, filter} from "lodash/fp";
import {videosbyIds} from "./api";

const ff = (l) => {
  let video_id = l.split('v=')[1];
  if(!video_id) { return undefined; }
  const ampersandPosition = video_id.indexOf('&');
  if(ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id.replace(/(\r\n\t|\n|\r\t)/gm,"");
}

const plugin = (envelope, {cfg, log}) => {
  const key = get("youtube.api_key", cfg);
  const dat = filter(u => u.id ? true : false)(envelope.data);
  console.log(uniq(flatten(map('_sc_source', envelope.data))));
  const ids = map(i => ff(i.cid.online_link) || i.id)(dat);
  console.log(ids);
  console.log(filter(i => i.includes('CW_'), ids));
  console.log(size(filter(i => i.includes('CW_'), ids)));
  return videosbyIds(key, ids)
    .then(flatten)
    .then(vids => {
      const yids = map('id', vids);
      const x = xor(yids, ids);
      return x;
    })
    .then(removedIds => {
      log.info(`in ${size(ids)} youtube videos, found ${size(removedIds)} removed videos`);
      // log.info(`++++  ${envelope.queries[0]["term"]["cid.incident_date"]["$gte"]}, ${envelope.queries[0]["term"]["cid.incident_date"]["$lt"]}, ${size(dat)}, ${size(removedIds)} ----`);
      log.info(`examples ${first(removedIds)} ${last(removedIds)}`);
      return envelope;    
    });
};

export default plugin;
