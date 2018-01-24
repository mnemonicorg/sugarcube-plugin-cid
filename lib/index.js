import addPlugin from "./add";
import removed from "./removed";

const plugins = {
  add_cid_fields: addPlugin,
  removed_videos: removed,
};

export {plugins};
export default {plugins};
