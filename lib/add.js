import {size, set} from 'lodash/fp';
import Promise from 'bluebird';

import {makeDem} from './fields';
// import {envelope as env} from 'littlefork';

const plugin = (envelope, {log, }) => {
  log.info(`Adding digital evidence metadata fields to ${size(envelope.data)} units`);

  return Promise.map(envelope.data, makeDem)
    .then(rs => {
      log.info('Concatiing with Envelope');
      return set('data', rs)(envelope);
    })
    .then(env => {
      log.info('envelope set');
      return env;
    });
  // return set('data', map(nu)(envelope.data))(envelope);
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
