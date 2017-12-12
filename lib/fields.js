import {uniq, concat, get, mergeAll, curry, find} from "lodash/fp";
import dateformat from "dateformat";
// import {envelope as env} from "littlefork";

const defaults = u => ({
  _lf_content_fields: uniq(concat(u._lf_content_fields, ["dem"])), // eslint-disable-line
  dem: {
    reference_code: get("_lf_id_hash")(u).substr(0, 8),
    incident_date: dateformat(get("_lf_pubdates.source")(u), "yyyy-mm-dd"),
    incident_time: dateformat(get("_lf_pubdates.source")(u), "h:MM:ss"),
    date_of_acquisition: get("_lf_pubdates.fetch")(u),
    upload_date: get("_lf_pubdates.source")(u),
    staff_id: "littlefork",
    summary_ar: "",
    summary_en: "",
    location: "",
    latitude: "",
    longitude: "",
    relevant: false,
    verified: false,
    public: false,
    online_title: "",
    online_title_ar: "",
    online_title_en: "",
    online_link: "",
    description: "",
    channel_id: "",
    view_count: "",
    filename: "",
    creator: "",
    generation: true,
    existence_original: "",
    edited: false,
    online: true,
    file_size: "",
    duration: "",
    acquired_from: "",
    chain_of_custody: "",
    date_of_fixity: "",
    md5_hash: "",
    content_type: "",
    language: "",
    finding_aids: "",
    graphic_content: true,
    security_restriction_status: "",
    rights_owner: "",
    rights_declaration: "",
    creator_willing: false,
    priority: "",
    keywords: [],
    notes: "",
    device_used: "",
    weapons_used: [],
    landmarks: [],
    collections: [],
    weather: "",
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
    armed_group: "",
  },
});

const yVideo = u => ({
  dem: {
    online_title: get("snippet.title")(u),
    online_title_ar: get("snippet.title")(u),
    online_title_en: get("snippet.title")(u),
    online_link: get("_lf_downloads.0.term")(u),
    description: get("snippet.description")(u),
    channel_id: get("snippet.channelId")(u),
    view_count: get("statistics.viewCount")(u),
    filename: get("_lf_downloads.0.location")(u),
    creator: get("snippet.channelTitle")(u),
    duration: get("contentDetails.duration")(u),
    acquired_from: get("snippet.channelTitle")(u),
    md5_hash: get("_lf_downloads.0.md5")(u),
    language: get("_lf_language")(u),
    rights_owner: get("snippet.channelTitle")(u),
  },
});

const getTDl = u => {
  const ff = find(d => d.type === "twitter_video", u._lf_downloads);
  if (ff) {
    return ff.location;
  }
  return get("_lf_downloads.0.location")(u);
};

const tweet = u => ({
  dem: {
    online_title: get("tweet")(u),
    online_title_ar: get("tweet")(u),
    online_title_en: get("tweet")(u),

    online_link: `https://twitter.com/${get(
      "user.screen_name",
      u
    )}/status/${get("tweet_id", u)}`,

    filename: getTDl(u),
    md5_hash: get("_lf_downloads.0.md5")(u),

    description: get("tweet")(u),
    channel_id: get("user.user_id")(u),
    creator: get("user.screen_name")(u),
    acquired_from: get("user.screen_name")(u),
    language: get("_lf_language")(u),
    rights_owner: get("user.screen_name")(u),
  },
});

export const sources = {
  defaults,
  youtube_channel: yVideo,
  twitter_feed: tweet,
};

export const makeDem = curry(u =>
  mergeAll([sources.defaults(u), u, sources[u._lf_source](u)])
);

export default {
  makeDem,
};
