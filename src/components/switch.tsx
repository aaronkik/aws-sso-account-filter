import { Switch as _Switch, type SwitchProps as _SwitchProps } from '@headlessui/react';
import { Fragment } from 'react';

interface SwitchProps extends _SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Switch = (props: SwitchProps) => {
  return (
    <_Switch {...props} checked={props.checked} onChange={props.onChange} as={Fragment}>
      {({ checked }) => (
        <button
          className={`${
            checked ? 'bg-orange-400' : 'bg-slate-400'
          } relative inline-flex h-7 w-11 min-w-11 items-center rounded-sm`}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-5 w-4 transform rounded-sm bg-white transition`}
          />
        </button>
      )}
    </_Switch>
  );
};

export default Switch;
