import {
  AccountFilterList,
  AccountFilterStatusToggleButton,
  GlobalSettings,
  SaveAccountFilterForm,
} from './components';

const Popup = () => {
  return (
    <div className='flex h-full max-h-full flex-col gap-2 p-4'>
      <div className='flex flex-none flex-col gap-4'>
        <div className='mb-3 text-center'>
          <h1 className='text-xl font-medium tracking-wide'>AWS Account Filter</h1>
        </div>
        <GlobalSettings />
        <SaveAccountFilterForm />
      </div>
      <AccountFilterList />
      <AccountFilterStatusToggleButton />
    </div>
  );
};

export default Popup;
