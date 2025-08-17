type GetChromeStorageParams = string | null | string[];
type GetChromeStorageReturn<T> = { [K in keyof T]: T[K] } | null | undefined;

type SetChromeStorageParams<T> = { [K in keyof T]: T[K] };
type SetChromeStorageReturn = ReturnType<chrome.storage.StorageArea['set']>;

export class ChromeStorageSync {
  #chromeStorageSync = chrome.storage.sync;

  async get<T>(key: GetChromeStorageParams): Promise<GetChromeStorageReturn<T>> {
    // @ts-expect-error - don't know why this isn't working yet
    return await this.#chromeStorageSync.get(key);
  }

  async set<T>(items: SetChromeStorageParams<T>): Promise<SetChromeStorageReturn> {
    return await this.#chromeStorageSync.set(items);
  }
}
