import { DBConfig } from 'ngx-indexed-db';

export const STORE_TYPE = {
  STORE_DRIVE_URL: 'driveUrl',
  STORE_SENTENSES: 'sentenses',
  STORE_BOOK: 'book',
};

export const dbConfig: DBConfig = {
  name: 'moment',
  version: 1,
  objectStoresMeta: [
    {
      store: STORE_TYPE.STORE_BOOK,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
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
      store: STORE_TYPE.STORE_DRIVE_URL,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'driveId', keypath: 'driveUrl', options: { unique: false } },
      ],
    },
  ],
};
