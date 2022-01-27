import { InteractionObject, Pact } from '@pact-foundation/pact';
import * as supertest from 'supertest';
import expect = require('expect.js');
import { getProviderBaseUrl, pactWith } from '../index';

const getClient = (provider: Pact) => supertest(provider.mockService.baseUrl);
const pactPort = 5001;

const postValidRequest: InteractionObject = {
  state: 'A pet 1845563262948980200 exists',
  uponReceiving: 'A get request to get a pet 1845563262948980200',
  willRespondWith: {
    status: 200,
  },
  withRequest: {
    method: 'GET',
    path: '/v2/pet/1845563262948980200',
    headers: { api_key: '[]' },
  },
};
describe('pactWith', function () {
  describe('with explicit port', function () {
    pactWith(
      { consumer: 'MyConsumer', provider: 'pactWith', port: pactPort },
      (provider: Pact) => {
        describe('pact integration', function () {
          beforeEach(function () {
            return provider.addInteraction(postValidRequest);
          });

          it('should be be able to hide the pact stuff behind the scenes with a port of the users choosing', function () {
            return getClient(provider)
              .get('/v2/pet/1845563262948980200')
              .set('api_key', '[]')
              .expect(200);
          });
        });

        describe('provider object', function () {
          it('should show the specified port in the URL', function () {
            expect(provider.mockService.baseUrl).to.match(
              new RegExp(`${pactPort}$`)
            );
          });
          it('should return the port on getProviderBaseUrl', function () {
            expect(getProviderBaseUrl(provider)).to.equal(
              `http://127.0.0.1:${pactPort}`
            );
          });
        });
      }
    );
  });

  describe('with no port', function () {
    pactWith(
      { consumer: 'MyConsumer', provider: 'pactWith2' },
      (provider: Pact) => {
        describe('pact integration', function () {
          beforeEach(function () {
            return provider.addInteraction(postValidRequest);
          });

          it('should be ok if i dont provide a port', function () {
            return getClient(provider)
              .get('/v2/pet/1845563262948980200')
              .set('api_key', '[]')
              .expect(200);
          });
        });

        describe('provider object', function () {
          it('should show the randomly assigned port in the URL', function () {
            expect(provider.mockService.baseUrl).to.match(
              new RegExp(`\\d{4,5}$`)
            );
          });

          it('should return the host on getProviderBaseUrl', function () {
            expect(getProviderBaseUrl(provider)).to.match(
              new RegExp('^http://127.0.0.1:\\d{4,5}$')
            );
          });
        });
      }
    );

    describe('custom log locations', function () {
      const arbitraryPact = (provider: Pact) => {
        describe('pact test', function () {
          beforeEach(function () {
            return provider.addInteraction(postValidRequest);
          });

          it('works', function () {
            return getClient(provider)
              .get('/v2/pet/1845563262948980200')
              .set('api_key', '[]')
              .expect(200);
          });
        });
      };

      describe('with logDir', function () {
        describe('without logFileName', function () {
          pactWith(
            {
              consumer: 'MyConsumer',
              provider: 'pactWith2',
              logDir: 'pact/log/custom',
            },
            (provider: Pact) => {
              arbitraryPact(provider);
            }
          );
        });
        describe('with logFileName', function () {
          pactWith(
            {
              consumer: 'MyConsumer',
              provider: 'pactWith2',
              logDir: 'pact/log/custom',
              logFileName: 'someLog.txt',
            },
            (provider: Pact) => {
              arbitraryPact(provider);
            }
          );
        });
      });
      describe('with only logFileName', function () {
        pactWith(
          {
            consumer: 'MyConsumer',
            provider: 'pactWith2',
            logFileName: 'someOtherLog.txt',
          },
          (provider: Pact) => {
            arbitraryPact(provider);
          }
        );
      });
    });
  });
});
