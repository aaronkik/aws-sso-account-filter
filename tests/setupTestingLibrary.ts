import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { chrome } from '../__mocks__/chrome';

afterEach(async () => {
  await chrome.storage.sync.clear();
  cleanup();
});
