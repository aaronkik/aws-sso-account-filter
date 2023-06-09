import { ChromeStorageSync } from '~/repositories';

const accountFiltersStorageKey = 'accountFilters';

export type AccountFilter = {
  enabled: boolean;
  filter: string;
  id: string;
};

type GetAccountFilterStorage = {
  [accountFiltersStorageKey]?: Array<AccountFilter>;
};

class AccountFilterStorage {
  #storageKey = accountFiltersStorageKey;
  #storage = new ChromeStorageSync();

  async get() {
    return this.#storage.get<GetAccountFilterStorage>(this.#storageKey);
  }

  async set(accountFilters: Array<AccountFilter>) {
    return this.#storage.set({ accountFilters });
  }

  async add(accountFilterName: AccountFilter['filter']) {
    const newAccountFilter: AccountFilter = {
      enabled: true,
      filter: accountFilterName.trim(),
      id: crypto.randomUUID(),
    };

    const accountFilterStorageResult = await this.get();

    if (
      !accountFilterStorageResult ||
      !('accountFilters' in accountFilterStorageResult) ||
      !Array.isArray(accountFilterStorageResult.accountFilters) ||
      accountFilterStorageResult.accountFilters.length === 0
    ) {
      return this.set([newAccountFilter]);
    }

    const filteredDuplicateAccountFilters = accountFilterStorageResult.accountFilters.filter(
      ({ filter }) => filter !== newAccountFilter.filter
    );

    return this.set([newAccountFilter, ...filteredDuplicateAccountFilters]);
  }
}

export const accountFilterStorage = new AccountFilterStorage();
