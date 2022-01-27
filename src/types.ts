import {
  MessageConsumerPact,
  Pact,
  MessageConsumerOptions,
  PactOptions,
} from '@pact-foundation/pact';
import { WrapperWithOnlyAndSkip } from './internal/types';

interface ExtraOptions {
  timeout?: number;
  logDir?: string;
  logFileName?: string;
}

export type MochaPactOptions = PactOptions & ExtraOptions;

export type MochaMessageConsumerOptions = MessageConsumerOptions & ExtraOptions;

export type JestProvidedPactFn = (provider: Pact) => void;

export type ProvidedMessagePactFn = (messagePact: MessageConsumerPact) => void;

export type PactWith = WrapperWithOnlyAndSkip<
  MochaPactOptions,
  JestProvidedPactFn
>;

export type MessagePactWith = WrapperWithOnlyAndSkip<
  MochaMessageConsumerOptions,
  ProvidedMessagePactFn
>;
