import { fpactWith } from '../index';

describe('fpactwith', function () {
  fpactWith({ consumer: 'MyConsumer', provider: 'NoProvider' }, () => {
    it('should only run this test', function () {});
  });

  it('the test that should be skipped', function () {
    throw new Error('this test should not be run');
  });
});
