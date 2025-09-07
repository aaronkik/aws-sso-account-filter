import { Switch } from '../shared/switch';
import { type GlobalSettingKey } from '../../../services/global-settings';
import { useGlobalSetting } from './use-global-setting';

interface GlobalSettingItemProps {
  title: string;
  storageKey: GlobalSettingKey;
  description: {
    enabled: string;
    disabled: string;
  };
}

export const GlobalSettingItem = (props: GlobalSettingItemProps) => {
  const { persistValue, persistedValue } = useGlobalSetting(props.storageKey);

  const isEnabled = persistedValue;
  const description = isEnabled ? props.description.enabled : props.description.disabled;

  return (
    <div className='flex flex-row items-center justify-between' key={props.title}>
      <div className='flex flex-col'>
        <p className='text-base font-medium tracking-wider'>{props.title}</p>
        <p className='text-sm opacity-85'>{description}</p>
      </div>
      <Switch checked={persistedValue} onChange={persistValue} />
    </div>
  );
};
