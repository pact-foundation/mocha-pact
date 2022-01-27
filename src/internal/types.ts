/** @internal */
export interface ConsumerOptions {
  consumer: string;
  provider: string;
}

/** @internal */
export type WrapperFn<O extends ConsumerOptions, P> = (o: O, p: P) => void;

/** @internal */
export interface WrapperWithOnlyAndSkip<O extends ConsumerOptions, P>
  extends WrapperFn<O, P> {
  only: WrapperFn<O, P>;
  skip: WrapperFn<O, P>;
}
