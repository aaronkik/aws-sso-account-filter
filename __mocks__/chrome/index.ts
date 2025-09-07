import { ChromeStorageArea } from './chrome-storage';

const storageOnChanged = {
  addListener: () => {},
  removeListener: () => {},
};

export const chrome = {
  storage: {
    sync: new ChromeStorageArea(),
    onChanged: storageOnChanged,
  },
};
