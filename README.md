# Mocha-Pact

[![npm version](https://badge.fury.io/js/mocha-pact.svg)](https://badge.fury.io/js/mocha-pact)
![npm](https://img.shields.io/npm/dm/mocha-pact.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/4ad6c94892c6704253ca/maintainability)](https://codeclimate.com/github/pact-foundation/mocha-pact/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/pact-foundation/mocha-pact/badge.svg)](https://coveralls.io/github/pact-foundation/mocha-pact)
[![Dependency Status](https://img.shields.io/david/pact-foundation/mocha-pact.svg?style=flat-square)](https://david-dm.org/pact-foundation/mocha-pact)
[![devDependency Status](https://img.shields.io/david/dev/pact-foundation/mocha-pact.svg?style=flat-square)](https://david-dm.org/pact-foundation/mocha-pact#info=devDependencies)

## Mocha Adaptor to help write Pact files with ease

Basically the same as [`jest-pact`](https://github.com/pact-foundation/jest-pact), but for `mocha`

## Adaptor Installation

```
# npm
npm install --save-dev mocha-pact

# yarn
yarn add mocha-pact --dev
```

## Usage

Say that your API layer looks something like this:

```js
import axios from 'axios';

const defaultBaseUrl = 'http://your-api.example.com';

export const api = (baseUrl = defaultBaseUrl) => ({
  getHealth: () =>
    axios.get(`${baseUrl}/health`).then((response) => response.data.status),
  /* other endpoints here */
});
```

Then your test might look like:

```js
import { pactWith } from 'mocha-pact';
import { Matchers } from '@pact-foundation/pact';
import api from 'yourCode';

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
  let client;

  beforeEach(() => {
    client = api(provider.mockService.baseUrl)
  });

  describe('health endpoint', () => {
    // Here we set up the interaction that the Pact
    // mock provider will expect.
    //
    // mocha-pact takes care of validating and tearing
    // down the provider for you.
    beforeEach(() => // note the implicit return.
                     // addInteraction returns a promise.
                     // If you don't want to implict return,
                     // you will need to `await` the result
      provider.addInteraction({
        state: "Server is healthy",
        uponReceiving: 'A request for API health',
        willRespondWith: {
          status: 200,
          body: {
            status: Matchers.like('up'),
          },
        },
        withRequest: {
          method: 'GET',
          path: '/health',
        },
      })
    );

    // You also test that the API returns the correct
    // response to the data layer.
    //
    // Although Pact will ensure that the provider
    // returned the expected object, you need to test that
    // your code recieves the right object.
    //
    // This is often the same as the object that was
    // in the network response, but (as illustrated
    // here) not always.
    it('returns server health', () => // implicit return again
      client.getHealth().then(health => {
        expect(health).toEqual('up');
      }));
  });
```

### Features

- [x] instantiates the PactOptions for you
- [x] Setups Pact mock service before and after hooks so you don’t have to
- [x] Set Mocha timeout to 30 seconds preventing brittle tests in slow environments like Docker
- [x] Sensible defaults for the pact options that make sense with Mocha
- [x] Supports the main release of pact-js (9.x.x)

# Best practices

You can make your tests easier to read by extracting your request and responses:

```js
/* pact.fixtures.js */
import { Matchers } from '@pact-foundation/pact';

export const healthRequest = {
  uponReceiving: 'A request for API health',
  withRequest: {
    method: 'GET',
    path: '/health',
  },
};

export const healthyResponse = {
  status: 200,
  body: {
    status: Matchers.like('up'),
  },
};
```

```js
import { pactWith } from 'mocha-pact';
import { healthRequest, healthyResponse } from "./pact.fixtures";

import api from 'yourCode';

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
  let client;

  beforeEach(() => {
    client = api(provider.mockService.baseUrl)
  });

  describe('health endpoint', () => {

    beforeEach(() =>
      provider.addInteraction({
        state: "Server is healthy",
        ...healthRequest,
        willRespondWith: healthyResponse
      })
    );

    it('returns server health', () =>
      client.getHealth().then(health => {
        expect(health).toEqual('up');
      }));
  });
```

## Common gotchas

- Forgetting to wait for the promise from `addInteraction` in `beforeEach`.
  You can return the promise, or use `async`/`await`. If you forget this,
  your interaction may not be set up before the test runs.
- Forgetting to wait for the promise of your API call in `it`. You can
  return the promise, or use `async`/`await`. If you forget this, your
  test may pass before the `expect` assertion runs, causing a potentially
  false success.
- It's a good idea to specify a different log file for each invocation of `pactWith`,
  otherwise the logs will get overwritten when other specs start. If you provide an
  explicit port, then the default mockserver log filename includes the port number.

- If you are using `eslint-plugin-mocha` with the recommended settings, you will need to disable the rule [`mocha/no-setup-in-describe`](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-setup-in-describe.md):

  ```json
  // .eslintrc.json
  "rules": {
    "mocha/no-setup-in-describe": "off",
    ...
  }
  ```

  This is because mocha-pact dynamically generates the test setup for you.
  Disabling this rule is the [approach recommended in the
  `eslint-plugin-mocha`
  documentation](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-setup-in-describe.md)
  for when you have dynamically generated tests.

# API Documentation

Mocha-Pact has two primary functions:

- `pactWith(MochaPactOptions, (providerMock) => { /* tests go here */ })`: a wrapper that sets up a pact mock provider, applies sensible default options, and applies the setup and verification hooks so you don't have to
- `messagePactWith(MochaMessageConsumerOptions, (messagePact) => { /* tests go here */ })`: a wrapper that sets up a message pact instance and applies sensible default options

Additionally, `pactWith.only / fpactWith`, `pactWith.skip / xpactWith`, `messagePactWith.only / fmessagePactWith` and `messagePactWith.skip / xmessagePactWith` behave as you would expect from Mocha.

There are two types exported:

- `MochaProvidedPactFn`: This is the type of the second argument to `pactWith`, ie: `(provider: Pact) => void`
- `MochaPactOptions`: An extended version of `PactOptions` that has some additional convienience options (see below).
- `MochaMessageConsumerOptions`: An extended version of `MessagePactOptions` that has some additional convienience options (see below).

## Configuration

You can use all the usual `PactOptions` from pact-js, plus a timeout for
telling mocha to wait a bit longer for pact to start and run.

```ts
pactWith(MochaPactOptions, (provider) => {
  // regular http pact tests go here
});
messagePactWith(MochaMessageConsumerOptions, (messagePact) => {
  // regular message pact tests go here
});

interface ExtraOptions {
  timeout?: number; // Timeout for pact service start/teardown, expressed in milliseconds
  // Default is 30000 milliseconds (30 seconds).
  logDir?: string; // path for the log file
  logFileName?: string; // filename for the log file
}

type MochaPactOptions = PactOptions & ExtraOptions;

type MochaMessageConsumerOptions = MessageConsumerOptions & ExtraOptions;
```

### Defaults

Mocha-Pact sets some helpful default PactOptions for you. You can override any of these by explicitly setting corresponding option. Here are the defaults:

- `log` is set so that log files are written to `/pact/logs`, and named `<consumer>-<provider>-mockserver-interaction.log`. If you provided an explicit `port`, then the log file name is `<consumer>-<provider>-mockserver-interaction-port-<portNumber>.log`
- `dir` is set so that pact files are written to `/pact/pacts`
- `logLevel` is set to warn
- `timeout` is 30,000 milliseconds (30 seconds)
- `pactfileWriteMode` is set to "update"

Most of the time you won't need to change these.

A common use case for `log` is to change only the filename or the path for
logging. To help with this, Mocha-Pact provides convienience options `logDir`
and `logFileName`. These allow you to set the path or the filename
independently. In case you're wondering, if you specify `log`, `logDir` and
`logFileName`, the convienience options are ignored and `log` takes
precidence.

## Credits

- [Pact Foundation](https://github.com/pact-foundation)
- [Pact JS](https://github.com/pact-foundation/pact-js)
- [Jest-Pact](https://github.com/pact-foundation/jest-pact)
