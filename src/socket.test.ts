import { watchForResponse } from './socket';

test('promise watcher works', async () => {

  // fake promise resolves in 10ms for testing

  const promise = new Promise<String>((resolve, reject) => { setTimeout(() => { resolve('foo') }), 10 });
  const resolve = jest.fn();
  promise.then(resolve);
  expect(await promise).toBe('foo');
});