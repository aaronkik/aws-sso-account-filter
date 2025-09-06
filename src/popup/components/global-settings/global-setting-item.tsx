import Switch from '../../../components/switch';
import { type GlobalSettingKey } from '../../../services/global-settings';
import useGlobalSetting from './use-global-setting';

interface GlobalSettingItemProps {
  title: string;
  storageKey: GlobalSettingKey;
  description: {
    enabled: string;
    disabled: string;
  };
}

const GlobalSettingItem = (props: GlobalSettingItemProps) => {
  const { persistValue, persistedValue } = useGlobalSetting(props.storageKey);

  return (
    <div className='flex flex-row items-center justify-between' key={props.title}>
      <div className='flex flex-col'>
        <p className='text-base font-bold tracking-wide'>{props.title}</p>
        <p className='text-sm opacity-50'>{props.description.disabled}</p>
      </div>
      <Switch checked={persistedValue} onChange={persistValue} />
    </div>
  );
};

export default GlobalSettingItem;
