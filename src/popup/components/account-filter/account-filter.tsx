import { SaveAccountFilterForm } from './save-account-filter-form';
import { AccountFilterList } from './account-filter-list';

export const AccountFilter = () => {
  return (
    <div className='flex h-full flex-col gap-2 rounded-sm bg-slate-700 px-4 py-2 shadow-inner'>
      <h2 className='w-full text-start text-lg font-medium tracking-wider'>Add New Filter</h2>
      <SaveAccountFilterForm />
      <AccountFilterList />
    </div>
  );
};
