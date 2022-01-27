import { MessageConsumerPact } from '@pact-foundation/pact';

import { applyMessagePactOptionDefaults } from './internal/config';
import { WrapperFn } from './internal/types';
import { withTimeout } from './internal/withTimeout';

import { extendPactWith } from './internal/scaffold';
import { MochaMessageConsumerOptions, ProvidedMessagePactFn } from './types';

const setupMessageProvider = (
  options: MochaMessageConsumerOptions
): MessageConsumerPact => new MessageConsumerPact(options);

const jestMessagePactWrapper = (
  options: MochaMessageConsumerOptions,
  tests: ProvidedMessagePactFn
): void => {
  withTimeout(options, () => {
    tests(setupMessageProvider(applyMessagePactOptionDefaults(options)));
  });
};

export const messagePactWith = extendPactWith<
  MochaMessageConsumerOptions,
  ProvidedMessagePactFn,
  WrapperFn<MochaMessageConsumerOptions, ProvidedMessagePactFn>
>(jestMessagePactWrapper);

export const xmessagePactWith = messagePactWith.skip;
export const fmessagePactWith = messagePactWith.only;
