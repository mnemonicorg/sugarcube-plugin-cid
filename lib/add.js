import {size, map, set, merge, curry} from 'lodash/fp';
import Promise from 'bluebird';
import fs from 'fs';

Promise.promisifyAll(fs);

const plugin = (envelope, {log, }) => {
  const nu = curry(u => merge({
    dem: {
      reference_code: '',
      id: u._lf_id_hash
    }
  }, u));

  log.info(`Adding digital evidence metadata fields to ${size(envelope.data)} units`);

  return set('data', map(nu)(envelope.data))(envelope);
};

plugin.description = 'Add Digital Evidence Metaata fields';

plugin.argv = {
  'json.filename': {
    default: 'out.json',
    nargs: 1,
    desc: 'The file name to write the CSV to.',
  },
};

export default plugin;
