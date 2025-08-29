import type { NextConfig } from 'next'
import jsonObjDefault from './object.json' with { type: 'json' }
import jsonArray from './array.json' with { type: 'json' }
// ESM doesn't support named imports from JSON files.

export default {
  env: {
    jsonObjDefault: jsonObjDefault.object,
    jsonObjDefault123: String(jsonObjDefault['123number']),
    jsonObjDefaultWithSpace: jsonObjDefault['with space'],
    jsonObjDefaultWithHyphen: jsonObjDefault['with-hyphen'],
    jsonArray: jsonArray[0].array,
  },
} satisfies NextConfig
