import { type ComponentPropsWithoutRef } from 'react';
import GlobalSettingItem from './global-setting-item';

const globalSettings: ComponentPropsWithoutRef<typeof GlobalSettingItem>[] = [
  {
    title: 'Account Filtering',
    storageKey: 'accountFilterStatus',
    description: {
      enabled: 'Currently enabled',
      disabled: 'Currently disabled',
    },
  },
  {
    title: 'Auto-Refresh Page',
    storageKey: 'autoRefreshPage',
    description: {
      enabled: 'Refresh when filters change',
      disabled: 'Manual refresh only',
    },
  },
];

const GlobalSettings = () => {
  return (
    <div className='flex flex-col gap-4 rounded-sm bg-slate-700 p-4 shadow-inner'>
      {globalSettings.map((setting) => (
        <GlobalSettingItem
          key={setting.storageKey}
          title={setting.title}
          storageKey={setting.storageKey}
          description={setting.description}
        />
      ))}
    </div>
  );
};

export default GlobalSettings;
