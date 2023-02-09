import { DBConfig } from 'ngx-indexed-db';

export const STORE_TYPE = {
  STORE_BOOK: 'book',
  STORE_SENTENSES: 'sentenses',
  STORE_SETTING: 'setting',
};

export const dbConfig: DBConfig = {
  name: 'moment',
  version: 1,
  objectStoresMeta: [
    {
      store: STORE_TYPE.STORE_BOOK,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'count', keypath: 'count', options: { unique: false } },
        { name: 'section', keypath: 'section', options: { unique: false } },
      ],
    },
    {
      store: STORE_TYPE.STORE_SENTENSES,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'sentenses', keypath: 'sentenses', options: { unique: false } },
      ],
    },
    {
      store: STORE_TYPE.STORE_SETTING,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'order', keypath: 'order', options: { unique: false } },
        {
          name: 'secondLangIsHide',
          keypath: 'secondLangIsHide',
          options: { unique: false },
        },
        {
          name: 'useSpeechSynthesis',
          keypath: 'useSpeechSynthesis',
          options: { unique: false },
        },
        { name: 'voice', keypath: 'voice', options: { unique: false } },
      ],
    },
  ],
};
