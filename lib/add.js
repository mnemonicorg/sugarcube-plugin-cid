import {size, merge, curry, uniq, set, concat, get} from 'lodash/fp';
import Promise from 'bluebird';
import dateformat from 'dateformat';
// import {envelope as env} from 'littlefork';

const plugin = (envelope, {log, }) => {
  const nu = curry(u => merge({
    _lf_content_fields: uniq(concat(u._lf_content_fields, ['dem'])),
    dem: {
      reference_code: (get('_lf_id_hash')(u)).substr(0, 8),
      relevant: false,
      verified: false,
      public: false,

      online_title: get('snippet.title')(u),
      online_title_ar: get('snippet.title')(u),
      online_title_en: get('snippet.title')(u),

      online_link: get('_lf_downloads.0.term')(u),

      description: get('snippet.description')(u),

      summary_ar: '',
      summary_en: '',

      incident_date: dateformat(get('_lf_pubdates.source')(u), 'yyyy-mm-dd'),
      incident_time: dateformat(get('_lf_pubdates.source')(u), 'h:MM:ss'),
      location: '',

      latitude: '',
      longitude: '',

      channel_id: get('snippet.channelId')(u),
      view_count: get('statistics.viewCount')(u),


      creator: get('snippet.channelTitle')(u),
      filename: get('_lf_downloads.0.location')(u),

      generation: true,
      existence_original: '',
      edited: false,
      online: true,
      file_size: 'TODO',
      duration: get('contentDetails.duration')(u),
      date_of_acquisition: get('_lf_pubdates.fetch')(u),
      upload_date: get('_lf_pubdates.source')(u),

      acquired_from: get('snippet.channelTitle')(u),
      chain_of_custody: '',
      date_of_fixity: '',
      md5_hash: get('_lf_downloads.0.md5')(u),
      content_type: 'IMAGE',
      language: get('_lf_language')(u),
      finding_aids: '',
      graphic_content: true,
      security_restriction_status: '',
      rights_owner: get('snippet.channelTitle')(u),
      rights_declaration: '',
      creator_willing: false,
      priority: '',
      keywords: [],
      notes: '',
      device_used: '',
      weapons_used: [],
      landmarks: [],
      collections: [],
      weather: '',
      type_of_violation: {
        Massacres_and_other_unlawful_killing: false,
        Arbitrary_arrest_and_unlawful_detention: false,
        Hostage_taking: false,
        Enforced_disappearance: false,
        Torture_and_ill_treatment_of_detainees: false,
        Sexual_and_gender_based_violence: false,
        Violations_of_childrens_rights: false,
        Unlawful_attacks: false,
        Violations_against_specifically_protected_persons_and_objects: false,
        Use_of_illegal_weapons: false,
        Sieges_and_violations_of_economic_social_and_cultural_rights: false,
        Arbitrary_and_forcible_displacement: false,
      },
      staff_id: 'littlefork',
      armed_group: '',
    }
  }, u));

  log.info(`Adding digital evidence metadata fields to ${size(envelope.data)} units`);

  return Promise.map(envelope.data, nu)
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
