import { useEffect, useRef, useState } from 'react';
import type { AccountFilterChromeStorageChange } from '~/types';
import { accountFilterStorage, type AccountFilter } from '~/services/account-filter-storage';
import AccountFilterItem from './account-filter-item';

const AccountFilterList = () => {
  const [accountFilters, setAccountFilters] = useState<Array<AccountFilter>>([]);
  const divListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getAndSetUserAccountFilters = async () => {
      const userAccountFilters = await accountFilterStorage.get();

      if (!userAccountFilters) return;
      if (!('accountFilters' in userAccountFilters)) return;

      setAccountFilters(userAccountFilters.accountFilters);
    };

    getAndSetUserAccountFilters();
  }, []);

  useEffect(() => {
    const onChange = (changes: chrome.storage.StorageChange | AccountFilterChromeStorageChange) => {
      if (!('accountFilters' in changes)) return;

      const { accountFilters } = changes;

      if (!accountFilters?.newValue) return;

      const { newValue, oldValue } = accountFilters;

      setAccountFilters(newValue);

      if (Array.isArray(oldValue) && oldValue.length >= newValue.length) return;

      divListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    chrome.storage.onChanged.addListener(onChange);

    return () => {
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, []);

  return (
    <div className='flex flex-1 flex-col'>
      {accountFilters.length ? (
        <>
          <p className='flex-none py-2 text-xs font-semibold tracking-wider'>
            Filters ({accountFilters.length})
          </p>
          <div
            className='flex flex-[1_1_0px] overflow-y-auto rounded-sm bg-slate-700 shadow-inner'
            ref={divListRef}
          >
            <ul className='w-full'>
              {accountFilters.map((filter) => (
                <AccountFilterItem
                  key={filter.id}
                  filterItem={filter}
                  filterList={accountFilters}
                />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className='mt-4 text-center text-lg font-medium text-slate-400'>You have no filters</p>
      )}
    </div>
  );
};

export default AccountFilterList;
