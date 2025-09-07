import { afterEach, describe, expect, test, vi } from 'vitest';
import { ChromeStorageSync } from '../repositories';
import { type GlobalSettingKey, globalSettings } from './global-settings';

const chromeStorageSyncGetSpy = vi.spyOn(ChromeStorageSync.prototype, 'get');
const chromeStorageSyncSetSpy = vi.spyOn(ChromeStorageSync.prototype, 'set');

describe('globalSettings', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getValue', () => {
    test.each<GlobalSettingKey>(['accountFilterStatus', 'autoRefreshPage'])(
      `GIVEN a query to get %s
          THEN expect the key %s to be used to access the storage item`,
      async (key) => {
        await globalSettings.getValue(key);

        expect(chromeStorageSyncGetSpy).toBeCalledTimes(1);
        expect(chromeStorageSyncGetSpy).toBeCalledWith(key);
      },
    );

    test.each<GlobalSettingKey>(['accountFilterStatus', 'autoRefreshPage'])(
      `GIVEN a query to get %s
          WHEN chrome storage is empty
          THEN expect getValue to resolve to true and set the default value`,
      async (key) => {
        chromeStorageSyncGetSpy.mockResolvedValueOnce({});

        const result = await globalSettings.getValue(key);

        expect(result).toBe(true);
        expect(chromeStorageSyncSetSpy).toBeCalledTimes(1);
        expect(chromeStorageSyncSetSpy).toBeCalledWith({ [key]: true });
      },
    );

    test.each<GlobalSettingKey>(['accountFilterStatus', 'autoRefreshPage'])(
      `GIVEN a query to get %s
          WHEN chrome storage returns undefined
          THEN expect getValue to resolve to true and set the default value`,
      async (key) => {
        chromeStorageSyncGetSpy.mockResolvedValueOnce(undefined);

        const result = await globalSettings.getValue(key);

        expect(result).toBe(true);
        expect(chromeStorageSyncSetSpy).toBeCalledTimes(1);
        expect(chromeStorageSyncSetSpy).toBeCalledWith({ [key]: true });
      },
    );

    test.each<GlobalSettingKey>(['accountFilterStatus', 'autoRefreshPage'])(
      `GIVEN a query to get %s
          WHEN chrome storage returns a valid boolean value of true
          THEN expect getValue to resolve to true without setting default`,
      async (key) => {
        chromeStorageSyncGetSpy.mockResolvedValueOnce({ [key]: true });

        const result = await globalSettings.getValue(key);

        expect(result).toBe(true);
        expect(chromeStorageSyncSetSpy).not.toBeCalled();
      },
    );
  });

  describe('setValue', () => {
    test.each<GlobalSettingKey>(['accountFilterStatus', 'autoRefreshPage'])(
      `GIVEN a request to set %s to true
          THEN expect the key %s to be used to set the value in chrome storage`,
      async (key) => {
        await globalSettings.setValue(key, true);

        expect(chromeStorageSyncSetSpy).toHaveBeenCalledExactlyOnceWith({ [key]: true });
      },
    );

    test.each<GlobalSettingKey>(['accountFilterStatus', 'autoRefreshPage'])(
      `GIVEN a request to set %s to false
          THEN expect the key %s to be used to set the value in chrome storage`,
      async (key) => {
        await globalSettings.setValue(key, false);

        expect(chromeStorageSyncSetSpy).toHaveBeenCalledExactlyOnceWith({ [key]: false });
      },
    );
  });
});
