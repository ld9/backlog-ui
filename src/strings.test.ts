import { strings } from "./strings";

test('has english strings', () => {
  expect(strings.getAvailableLanguages().includes('en')).toBeTruthy();
})

test('has spanish strings', () => {
  expect(strings.getAvailableLanguages().includes('es')).toBeTruthy();
})

test('can change languages properly', () => {
  expect(strings.home_login).toBe('Log In');
  strings.setLanguage('es');
  expect(strings.home_login).toBe('Iniciar sesión');
})
