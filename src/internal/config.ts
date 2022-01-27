import { PactfileWriteMode } from '@pact-foundation/pact';
import { LogLevel } from '@pact-foundation/pact/dsl/options';
import * as path from 'path';
import { MochaMessageConsumerOptions, MochaPactOptions } from '../types';

const logHint = (options: MochaPactOptions) =>
  options.port ? `-port-${options.port}` : '';

const applyCommonDefaults = (
  options: MochaPactOptions | MochaMessageConsumerOptions
) => ({
  log: path.resolve(
    options.logDir ? options.logDir : path.join(process.cwd(), 'pact', 'logs'),
    options.logFileName
      ? options.logFileName
      : `${options.consumer}-${
          options.provider
        }-mockserver-interaction${logHint(options)}.log`
  ),
  dir: path.resolve(process.cwd(), 'pact/pacts'),
  logLevel: 'warn' as LogLevel,
  pactfileWriteMode: 'update' as PactfileWriteMode,
});

export const applyPactOptionDefaults = (
  options: MochaPactOptions
): MochaPactOptions => ({
  ...applyCommonDefaults(options),
  spec: 2,
  ...options,
});

export const applyMessagePactOptionDefaults = (
  options: MochaMessageConsumerOptions
): MochaMessageConsumerOptions => ({
  ...applyCommonDefaults(options),
  spec: 3,
  ...options,
});
