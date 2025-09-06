import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, vi, describe, expect, test } from 'vitest';
import useGlobalSetting from './use-global-setting';
import { globalSettings } from '../../../services/global-settings';

const getGlobalSettingValue = vi.spyOn(globalSettings, 'getValue');
const setGlobalSettingValue = vi.spyOn(globalSettings, 'setValue');

const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('useGlobalSetting', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test(`GIVEN the global setting value is initially false
        WHEN persistValue is invoked with true
        THEN expect persistedValue to change to true`, async () => {
    getGlobalSettingValue.mockResolvedValueOnce(false);
    setGlobalSettingValue.mockResolvedValueOnce();

    const { result } = renderHook(() => useGlobalSetting('accountFilterStatus'));

    await waitFor(() => {
      expect(result.current.persistedValue).toBe(false);
    });

    act(() => {
      result.current.persistValue(true);
    });

    await waitFor(() => {
      expect(result.current.persistedValue).toBe(true);
    });

    expect(setGlobalSettingValue).toHaveBeenCalledWith('accountFilterStatus', true);
  });

  test(`GIVEN the global setting value is initially true
        WHEN persistValue is invoked with false
        THEN expect persistedValue to change to false`, async () => {
    getGlobalSettingValue.mockResolvedValueOnce(true);
    setGlobalSettingValue.mockResolvedValueOnce();

    const { result } = renderHook(() => useGlobalSetting('autoRefreshPage'));

    await waitFor(() => {
      expect(result.current.persistedValue).toBe(true);
    });

    act(() => {
      result.current.persistValue(false);
    });

    await waitFor(() => {
      expect(result.current.persistedValue).toBe(false);
    });

    expect(setGlobalSettingValue).toHaveBeenCalledWith('autoRefreshPage', false);
  });

  test(`GIVEN the global setting getValue throws an error
        WHEN the hook is rendered
        THEN expect persistedValue to remain false`, async () => {
    getGlobalSettingValue.mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useGlobalSetting('accountFilterStatus'));

    await waitFor(() => {
      expect(result.current.persistedValue).toBe(false);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Storage error'));
  });

  test(`GIVEN the global setting setValue throws an error
        WHEN persistValue is invoked
        THEN expect persistedValue to remain unchanged`, async () => {
    getGlobalSettingValue.mockResolvedValueOnce(false);
    setGlobalSettingValue.mockRejectedValueOnce(new Error('Storage error'));

    const { result } = renderHook(() => useGlobalSetting('accountFilterStatus'));

    await waitFor(() => {
      expect(result.current.persistedValue).toBe(false);
    });

    act(() => {
      result.current.persistValue(true);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Storage error'));
    });

    expect(result.current.persistedValue).toBe(false);
  });
});
