import { describe, expect, test } from 'vitest';
import { accountFilterStorage } from './account-filter-storage';

describe('accountFilterStorage', () => {
  test(`GIVEN a query to get accountFilters
        WHEN chrome storage is empty
        THEN expect an empty object to be returned`, async () => {
    await expect(accountFilterStorage.get()).resolves.toEqual({});
  });

  test(`GIVEN a query to get accountFilters
        WHEN accountFilters are set
        THEN expect an array of the set accountFilters to be returned`, async () => {
    const accountFilters = [
      { id: '1', enabled: true, filter: 'foo' },
      { id: '2', enabled: true, filter: 'bar' },
      { id: '3', enabled: true, filter: 'baz' },
    ];

    await accountFilterStorage.set(accountFilters);
    await expect(accountFilterStorage.get()).resolves.toEqual({ accountFilters });
  });

  test(`GIVEN accountFilters are set
        AND a query to get accountFilters is made
        AND accountFilters are overwritten
        THEN expect an array of the updated accountFilters to be returned`, async () => {
    const accountFilters = [
      { id: '1', enabled: true, filter: 'foo' },
      { id: '2', enabled: true, filter: 'bar' },
      { id: '3', enabled: true, filter: 'baz' },
    ];

    await accountFilterStorage.set(accountFilters);
    await expect(accountFilterStorage.get()).resolves.toEqual({ accountFilters });

    const updatedAccountFilters = [
      { id: '1', enabled: true, filter: 'foo' },
      { id: '2', enabled: true, filter: 'bar' },
      { id: '3', enabled: true, filter: 'baz' },
      { id: '4', enabled: true, filter: 'qux' },
    ];

    await accountFilterStorage.set(updatedAccountFilters);
    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: updatedAccountFilters,
    });
  });

  test(`GIVEN accountFilters are set sequentially 
        AND a queries are made to get accountFilters 
        THEN expect accountFilters to return the latest set value`, async () => {
    await accountFilterStorage.set([{ id: '1', enabled: true, filter: 'foo' }]);
    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [{ id: '1', enabled: true, filter: 'foo' }],
    });

    await accountFilterStorage.set([
      { id: '1', enabled: true, filter: 'foo' },
      { id: '2', enabled: true, filter: 'bar' },
    ]);
    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [
        { id: '1', enabled: true, filter: 'foo' },
        { id: '2', enabled: true, filter: 'bar' },
      ],
    });

    await accountFilterStorage.set([
      { id: '1', enabled: true, filter: 'foo' },
      { id: '2', enabled: true, filter: 'bar' },
      { id: '3', enabled: true, filter: 'baz' },
    ]);
    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [
        { id: '1', enabled: true, filter: 'foo' },
        { id: '2', enabled: true, filter: 'bar' },
        { id: '3', enabled: true, filter: 'baz' },
      ],
    });
  });

  test(`GIVEN a query to add an accountFilter
        WHEN chrome storage is empty
        THEN expect an array of the added accountFilter to be returned`, async () => {
    const accountFilterName = 'foo';

    await accountFilterStorage.add(accountFilterName);

    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [{ id: expect.any(String), enabled: true, filter: accountFilterName }],
    });
  });

  test(`GIVEN a query to add an accountFilter
        WHEN chrome storage is not empty
        AND accountFilters are set
        THEN expect the added accountFilter to be prepended in the returned array`, async () => {
    await accountFilterStorage.set([{ id: '1', enabled: true, filter: 'foo' }]);

    const accountFilterName = 'bar';

    await accountFilterStorage.add(accountFilterName);

    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [
        { id: expect.any(String), enabled: true, filter: accountFilterName },
        { id: '1', enabled: true, filter: 'foo' },
      ],
    });
  });

  test(`GIVEN a query to add a duplicate accountFilter
        WHEN chrome storage is not empty
        AND accountFilters are set
        THEN expect chrome storage to replace and prepend the duplicate filter`, async () => {
    await accountFilterStorage.set([
      { id: '3', enabled: true, filter: 'baz' },
      { id: '2', enabled: true, filter: 'bar' },
      { id: '1', enabled: true, filter: 'foo' },
    ]);

    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [
        { id: '3', enabled: true, filter: 'baz' },
        { id: '2', enabled: true, filter: 'bar' },
        { id: '1', enabled: true, filter: 'foo' },
      ],
    });

    const accountFilterName = 'foo';
    await accountFilterStorage.add(accountFilterName);

    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [
        { id: expect.any(String), enabled: true, filter: 'foo' },
        { id: '3', enabled: true, filter: 'baz' },
        { id: '2', enabled: true, filter: 'bar' },
      ],
    });
  });

  test(`GIVEN a query to add an accountFilter with whitespace
        WHEN chrome storage is empty
        THEN expect the accountFilter to be added with no whitespace`, async () => {
    const accountFilterName = '  foo  ';

    await accountFilterStorage.add(accountFilterName);

    await expect(accountFilterStorage.get()).resolves.toEqual({
      accountFilters: [{ id: expect.any(String), enabled: true, filter: 'foo' }],
    });
  });
});
