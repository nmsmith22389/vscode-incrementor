// eslint-disable-next-line import/no-named-as-default
import BigNumber from 'bignumber.js';

declare module 'bignumber.js' {
    interface BigNumber {
        /**
         * Returns `true` if the value of this BigNumber is between the value of `min` and `max`,
         * otherwise returns `false`.
         *
         * ```ts
         * const number = new BigNumber(2);
         * const min    = new BigNumber(1);
         * const max    = new BigNumber(3);
         * number.isBetween(min, max);      // true
         * number.isBetween(1, 3);          // true
         * ```
         *
         * @param min The minimum numeric value.
         * @param max The maximum numeric value.
         */
        isBetween(min: BigNumber.Value, max: BigNumber.Value): boolean;

        /**
         * Limits the value of this BigNumber to between `min` and `max` and returns the new BigNumber,
         * otherwise returns this BigNumber.
         *
         * ```ts
         * const number = new BigNumber(4);
         * const min    = new BigNumber(1);
         * const max    = new BigNumber(3);
         * number.limit(min, max);         // => BigNumber(3)
         * number.limit(1, 5);             // => BigNumber(4)
         * ```
         *
         * @param min The minimum numeric value.
         * @param max The maximum numeric value.
         */
        limit(min: BigNumber.Value, max: BigNumber.Value): BigNumber;
    }
}

BigNumber.prototype.isBetween = function (
    this: BigNumber,
    min: BigNumber.Value,
    max: BigNumber.Value
): boolean {
    const gt = this.isGreaterThanOrEqualTo(min);
    const lt = this.isLessThanOrEqualTo(max);

    return gt && lt;
};

BigNumber.prototype.limit = function (
    this: BigNumber,
    min: BigNumber.Value,
    max: BigNumber.Value
): BigNumber {
    const lt = this.lt(min);
    const gt = this.gt(max);

    if (lt) {
        return new BigNumber(min);
    } else if (gt) {
        return new BigNumber(max);
    }

    return this;
};

export { BigNumber, BigNumber as default };
