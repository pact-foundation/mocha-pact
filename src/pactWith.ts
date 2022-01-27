import { Pact } from '@pact-foundation/pact';
import { applyPactOptionDefaults } from './internal/config';
import { WrapperFn } from './internal/types';
import { withTimeout } from './internal/withTimeout';

import { extendPactWith } from './internal/scaffold';
import { MochaPactOptions, JestProvidedPactFn } from './types';

const setupProvider = (options: MochaPactOptions): Pact => {
  const pactMock: Pact = new Pact(options);

  before(function MochaPactSetup() {
    return pactMock.setup();
  });
  after(function MochaPactTeardown() {
    return pactMock.finalize();
  });
  afterEach(function MochaPactVerifyAfterEach() {
    return pactMock.verify();
  });

  return pactMock;
};

// This should be moved to pact-js, probably
export const getProviderBaseUrl = (provider: Pact): string =>
  provider.mockService
    ? provider.mockService.baseUrl
    : `http://${provider.opts.host}:${provider.opts.port}`;

const pactWithWrapper = (
  options: MochaPactOptions,
  tests: JestProvidedPactFn
): void => {
  withTimeout(options, () => {
    tests(setupProvider(applyPactOptionDefaults(options)));
  });
};

export const pactWith = extendPactWith<
  MochaPactOptions,
  JestProvidedPactFn,
  WrapperFn<MochaPactOptions, JestProvidedPactFn>
>(pactWithWrapper);

export const xpactWith = pactWith.skip;
export const fpactWith = pactWith.only;
