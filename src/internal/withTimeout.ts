interface TimeoutOption {
  timeout?: number;
}

export const withTimeout = (
  options: TimeoutOption,
  tests: () => void
): void => {
  const pactTestTimeout = options.timeout || 30000;

  describe(`with ${pactTestTimeout} ms timeout for Pact`, function MochaPactWithTimeout() {
    before(function MocaPactBeforeTestTimeout() {
      this.timeout(pactTestTimeout);
    });

    tests();
  });
};
