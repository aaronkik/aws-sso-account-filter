import { GlobalSettings } from './components/global-settings/global-settings';
import { AccountFilter } from './components/account-filter/account-filter';

const Popup = () => {
  return (
    <div className='flex h-full max-h-full flex-col gap-6 p-4'>
      <div className='flex flex-none flex-col gap-4'>
        <h1 className='w-full text-center text-xl font-medium tracking-wider'>AWS Account Filter</h1>
        <GlobalSettings />
      </div>
      <AccountFilter />
    </div>
  );
};

export default Popup;
