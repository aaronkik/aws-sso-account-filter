import { type AccountFilter } from '../services/account-filter-storage';
import { accountFilterStatus } from '../services/account-filter-status';
import { type GlobalSettingKey, globalSettings } from '../services/global-settings';

interface GenericChromeStorageChange<Type> extends chrome.storage.StorageChange {
  newValue?: Type;
  oldValue?: Type;
}

export type AccountFilterChromeStorageChange = Record<
  'accountFilters',
  GenericChromeStorageChange<Array<AccountFilter>>
>;

export type AccountFilterStatusChromeStorageChange = Record<
  'accountFilterStatus',
  GenericChromeStorageChange<Awaited<ReturnType<typeof accountFilterStatus.get>>>
>;

export type GlobalSettingsChromeStorageChange = Record<
  GlobalSettingKey,
  GenericChromeStorageChange<Awaited<ReturnType<typeof globalSettings.getValue>>>
>;
