import { useCallback, useEffect, useState } from 'react';
import { type GlobalSettingKey, globalSettings } from '../../../services/global-settings';
import type { GlobalSettingsChromeStorageChange } from '../../../types';

const useGlobalSetting = (storageKey: GlobalSettingKey) => {
  const [globalSettingValue, setGlobalSettingValue] = useState<boolean>(false);

  useEffect(() => {
    const getGlobalSetting = async () => {
      try {
        const status = await globalSettings.getValue(storageKey);
        setGlobalSettingValue(status);
      } catch (error) {
        console.error(error);
      }
    };

    getGlobalSetting();
  }, [storageKey]);

  useEffect(() => {
    const onChange = (changes: chrome.storage.StorageChange | GlobalSettingsChromeStorageChange) => {
      console.table(changes);
      if (!(storageKey in changes)) {
        return;
      }
      // @ts-expect-error asserted above
      const change = changes[storageKey];

      if (!change?.newValue) {
        return;
      }

      const { newValue } = change;

      setGlobalSettingValue(newValue);
    };

    chrome.storage.onChanged.addListener(onChange);

    return () => {
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, [storageKey]);

  const persistValue = useCallback(
    async (value: boolean) => {
      try {
        await globalSettings.setValue(storageKey, value);
        setGlobalSettingValue(value);
      } catch (error) {
        console.error(error);
      }
    },
    [storageKey],
  );

  return { persistedValue: globalSettingValue, persistValue };
};

export default useGlobalSetting;
