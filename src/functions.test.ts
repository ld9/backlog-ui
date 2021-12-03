import { checkTokenStillActive } from './functions';


test('null token rejects', async () => {
  expect(await checkTokenStillActive()).toBeFalsy();
})

test('expired token rejects', async () => {
  var localStorageMock = (function () {
    var store = {};
    return {
      getItem: function (key: any) {
        return store[key];
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      clear: function () {
        store = {};
      },
      removeItem: function (key) {
        delete store[key];
      }
    };
  })();

  localStorageMock.setItem("user-token-expires", 0);
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  expect(await checkTokenStillActive()).toBeFalsy();
})

test('active token returns', async () => {
  var localStorageMock = (function () {
    var store = {};
    return {
      getItem: function (key: any) {
        return store[key];
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      clear: function () {
        store = {};
      },
      removeItem: function (key) {
        delete store[key];
      }
    };
  })();

  localStorageMock.setItem("user-token-expires", new Date(new Date().getTime() + (1000 * 60 * 60 * 24)).getTime());
  localStorageMock.setItem("user-token", "test-token-dummy");

  // console.log(new Date(localStorageMock.getItem("user-token-expires")) < new Date(), localStorageMock.getItem("user-token"));

  Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  expect(await checkTokenStillActive()).toBe(false);
})