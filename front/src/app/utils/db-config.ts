import { DBConfig } from 'ngx-indexed-db';

export const STORE_BOOK = 'book';
export const STORE_SENTENSES = 'sentenses';

export const dbConfig: DBConfig = {
  name: 'moment',
  version: 1,
  objectStoresMeta: [
    {
      store: STORE_BOOK,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'count', keypath: 'count', options: { unique: false } },
        { name: 'section', keypath: 'section', options: { unique: false } },
      ],
    },
    {
      store: STORE_SENTENSES,
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'sentenses', keypath: 'sentenses', options: { unique: false } },
      ],
    },
  ],
};
