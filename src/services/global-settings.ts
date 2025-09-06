import { ChromeStorageSync } from '../repositories';

interface GetGlobalSettings {
  accountFilterStatus?: boolean;
  autoRefreshPage?: boolean;
}

export type GlobalSettingKey = keyof GetGlobalSettings;

class GlobalSettings extends ChromeStorageSync {
  async getValue(key: GlobalSettingKey): Promise<boolean> {
    const result = await super.get<GetGlobalSettings>(key);

    if (result && key in result && typeof result[key] === 'boolean') {
      return result[key];
    }

    await super.set({ [key]: true });
    return true;
  }

  async setValue(key: GlobalSettingKey, value: boolean): Promise<void> {
    return super.set({ [key]: value });
  }
}

export const globalSettings = new GlobalSettings();
