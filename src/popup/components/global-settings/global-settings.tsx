import { type ComponentPropsWithoutRef } from 'react';
import { GlobalSettingItem } from './global-setting-item';

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

export const GlobalSettings = () => {
  return (
    <div className='flex flex-col gap-2 rounded-sm bg-slate-700 px-4 py-2 shadow-inner [&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-slate-50/20 [&>*:not(:last-child)]:pb-2'>
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
