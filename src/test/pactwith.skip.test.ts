import { pactWith } from '../index';

describe('pactwith.skip', function () {
  pactWith.skip({ consumer: 'MyConsumer', provider: 'NoOtherProvider' }, () => {
    it('the test that should be skipped', function () {
      throw new Error('tests inside xpactWith should not run');
    });
  });
  it('this test should run', function () {});
});
