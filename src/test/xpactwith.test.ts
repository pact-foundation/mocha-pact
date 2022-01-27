import { xpactWith } from '../index';

describe('xpactwith', () => {
  xpactWith({ consumer: 'MyConsumer', provider: 'NoOtherProvider' }, () => {
    test('the test that should be skipped', () => {
      throw new Error('tests inside xpactWith should not run');
    });
  });
  test('this test should run', () => {});
});
