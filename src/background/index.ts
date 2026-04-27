import { accountFilterStorage } from '../services/account-filter-storage';
import { globalSettings } from '../services/global-settings';
import type { AccountFilterChromeStorageChange, GlobalSettingsChromeStorageChange } from '../types';

let originalAccountsList: NodeListOf<HTMLTableRowElement> | undefined;

const documentBodyObserver = new MutationObserver(async (mutationRecords) => {
  const accountFilterStatusIsEnabled = await globalSettings.getValue('accountFilterStatus');
  if (!accountFilterStatusIsEnabled && originalAccountsList) {
    const tbody = document.querySelector<HTMLTableElement>('table[role="treegrid"] > tbody');

    const accountRows = document.querySelectorAll<HTMLTableRowElement>(
      'tr[data-selection-item="item"][aria-level="1"]',
    );

    const isAccountListMutated = accountRows.length !== originalAccountsList.length;
    if (isAccountListMutated) {
      tbody?.replaceChildren(...originalAccountsList);
      return;
    }

    return;
  }

  for (const { removedNodes, target, type } of mutationRecords) {
    if (!(target instanceof HTMLElement)) {
      continue;
    }

    switch (type) {
      case 'attributes': {
        const isAccountsTabSelected =
          target.textContent?.toLowerCase() === 'accounts' && target.ariaSelected === 'true';

        if (!isAccountsTabSelected) {
          continue;
        }
        await filterAccountRows();
        break;
      }
      case 'childList': {
        for (const removedNode of removedNodes.values()) {
          if (!(removedNode instanceof HTMLElement)) {
            continue;
          }
          const hasFinishedLoadingAccounts = removedNode.innerText.trim().toLowerCase() === 'loading accounts';
          if (!hasFinishedLoadingAccounts) {
            continue;
          }
          await filterAccountRows();
        }
      }
    }
  }
});

documentBodyObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

const onChange = async (
  changes: chrome.storage.StorageChange | AccountFilterChromeStorageChange | GlobalSettingsChromeStorageChange,
) => {
  if (!('accountFilterStatus' in changes || 'accountFilters' in changes)) return;

  const isFilterEnabled = await globalSettings.getValue('accountFilterStatus');

  if (!isFilterEnabled && 'accountFilters' in changes) {
    return;
  }

  const tabList = document.querySelector('ul[role="tablist"]');
  if (!tabList) {
    return;
  }

  const selectedButton = tabList.querySelector('button[aria-selected="true"]');
  if (!selectedButton) {
    return;
  }

  const buttonText = selectedButton.textContent;
  if (!buttonText) {
    return;
  }
  if (buttonText.toLowerCase() !== 'accounts') return;

  /**
   * The below causes an "attribute" change in the mutation observer, prevent the need to manually refresh the page.
   */
  selectedButton.setAttribute('aws-account-filter', Date.now().toString());
};

chrome.storage.onChanged.addListener(onChange);

const filterAccountRows = async () => {
  const accountRows = document.querySelectorAll<HTMLTableRowElement>('tr[data-selection-item="item"][aria-level="1"]');

  if (!accountRows.length) {
    return;
  }

  if (!originalAccountsList) {
    originalAccountsList = accountRows;
  }

  let userStorageAccountFilters: Awaited<ReturnType<(typeof accountFilterStorage)['get']>>;

  try {
    userStorageAccountFilters = await accountFilterStorage.get();
  } catch (error) {
    console.error('Error accessing storage for key accountFilters', error);
    return;
  }

  if (!userStorageAccountFilters) return;
  if (!('accountFilters' in userStorageAccountFilters)) return;
  if (!Array.isArray(userStorageAccountFilters?.accountFilters)) return;
  if (!userStorageAccountFilters.accountFilters.length) return;

  const { accountFilters } = userStorageAccountFilters;

  let accountFilterRegExes: Array<RegExp>;

  try {
    accountFilterRegExes = accountFilters
      .filter(({ enabled }) => enabled)
      .map(({ filter }) => new RegExp(filter, 'iu'));
  } catch (error) {
    console.error('Error creating RegExp from accountFilters', error);
    return;
  }

  const accountNameMatchesAccountFilterRegExes = (awsAccountName: string) =>
    accountFilterRegExes.some((accountFilterRegEx) => accountFilterRegEx.test(awsAccountName));

  const filteredAccountRows = Array.from(originalAccountsList).filter((row) => {
    const awsAccountName = row.querySelector('[data-testid="account-list-cell"] > div')?.textContent?.trim();
    if (!awsAccountName) return false;
    return accountNameMatchesAccountFilterRegExes(awsAccountName);
  });

  const tbody = document.querySelector<HTMLTableElement>('table[role="treegrid"] > tbody');
  tbody?.replaceChildren(...filteredAccountRows);
};
