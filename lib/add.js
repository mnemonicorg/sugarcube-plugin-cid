import {size, map, set, merge, curry, concat, get} from 'lodash/fp';
import Promise from 'bluebird';
import fs from 'fs';
import dateformat from 'dateformat';

Promise.promisifyAll(fs);

const plugin = (envelope, {log, }) => {
  const nu = curry(u => merge({
    _lf_content_fields: concat(u._lf_content_fields, ['dem']),
    dem: {
      reference_code: '',
      staff_id: 'littlefork',
      date: dateformat(get('_lf_pubdates.source')(u), 'yyyy-mm-dd'),
      time: dateformat(get('_lf_pubdates.source')(u), 'h:MM:ss'),
      creator: get('snippet.channelTitle')(u),
      filename: get('_lf_downloads.0.location')(u),
      recording_date: get('_lf_pubdates.source')(u),
      location: '',
      summary: '',
      description: '',
      Generation: true,
      existence_original: '',
      edited: false,
      online: true,
      online_link: get('_lf_downloads.0.term')(u),
      online_title: get('snippet.title')(u),
      file_size: 'TODO',
      duration: get('contentDetails.duration')(u),
      date_of_acquisition: get('_lf_pubdates.fetch')(u),
      acquired_from: get('snippet.channelTitle')(u),
      chain_of_custody: '',
      date_of_fixity: get('_lf_pubdates.fetch')(u),
      md5_hash: get('_lf_downloads.0.md5')(u),
      content_type: 'IMAGE',
      language: get('_lf_language')(u),
      finding_aids: '',
      graphic_content: true,
      security_restriction_status: '',
      rights_owner: '',
      rights_declatation: '',
      creator_willing: false,
      priority: '',
      keywords: [],
      notes: '',
      device_used: '',
      weapons_used: [],
      landmarks: [],
      weather: '',
      type_of_violation: {
        viol1: false,
        viol2: false,
      },
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
