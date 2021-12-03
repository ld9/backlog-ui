import { BASE_API_URL, BASE_CONTENT_URL } from './variables';

test('has secure api url', () => {
  expect(BASE_API_URL.includes('https')).toBe(true);
})

test('has secure content url', () => {
  expect(BASE_CONTENT_URL.includes('https')).toBe(true);
})