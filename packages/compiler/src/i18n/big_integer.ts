/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Represents a big integer using a buffer of its individual digits, with the least significant
 * digit stored at the beginning of the array (little endian).
 *
 * 使用单个数字的缓冲区表示一个大整数，最低有效位存储在数组的开头（小端）。
 *
 * For performance reasons, each instance is mutable. The addition operation can be done in-place
 * to reduce memory pressure of allocation for the digits array.
 *
 * 出于性能原因，每个实例都是可变的。加法操作可以就地完成，以减少为数字数组分配的内存压力。
 *
 */
export class BigInteger {
  static zero(): BigInteger {
    return new BigInteger([0]);
  }

  static one(): BigInteger {
    return new BigInteger([1]);
  }

  /**
   * Creates a big integer using its individual digits in little endian storage.
   *
   * 使用小端存储中的单个数字创建一个大整数。
   *
   */
  private constructor(private readonly digits: number[]) {}

  /**
   * Creates a clone of this instance.
   *
   * 创建此实例的克隆。
   *
   */
  clone(): BigInteger {
    return new BigInteger(this.digits.slice());
  }

  /**
   * Returns a new big integer with the sum of `this` and `other` as its value. This does not mutate
   * `this` but instead returns a new instance, unlike `addToSelf`.
   *
   * 返回一个以 `this` 和 `other` 之和作为值的新大整数。与 `addToSelf` 不同，这不会改变 `this`
   * ，而是返回一个新实例。
   *
   */
  add(other: BigInteger): BigInteger {
    const result = this.clone();
    result.addToSelf(other);
    return result;
  }

  /**
   * Adds `other` to the instance itself, thereby mutating its value.
   *
   * 将 `other` 添加到实例本身，从而改变其值。
   *
   */
  addToSelf(other: BigInteger): void {
    const maxNrOfDigits = Math.max(this.digits.length, other.digits.length);
    let carry = 0;
    for (let i = 0; i < maxNrOfDigits; i++) {
      let digitSum = carry;
      if (i < this.digits.length) {
        digitSum += this.digits[i];
      }
      if (i < other.digits.length) {
        digitSum += other.digits[i];
      }

      if (digitSum >= 10) {
        this.digits[i] = digitSum - 10;
        carry = 1;
      } else {
        this.digits[i] = digitSum;
        carry = 0;
      }
    }

    // Apply a remaining carry if needed.
    if (carry > 0) {
      this.digits[maxNrOfDigits] = 1;
    }
  }

  /**
   * Builds the decimal string representation of the big integer. As this is stored in
   * little endian, the digits are concatenated in reverse order.
   *
   * 构建大整数的十进制字符串表示。由于这是以小端格式存储的，因此这些数字会以相反的顺序连接。
   *
   */
  toString(): string {
    let res = '';
    for (let i = this.digits.length - 1; i >= 0; i--) {
      res += this.digits[i];
    }
    return res;
  }
}

/**
 * Represents a big integer which is optimized for multiplication operations, as its power-of-twos
 * are memoized. See `multiplyBy()` for details on the multiplication algorithm.
 *
 * 表示一个针对乘法运算优化的大整数，因为它的二次幂是被记忆的。有关乘法算法的详细信息，请参阅
 * `multiplyBy()` 。
 *
 */
export class BigIntForMultiplication {
  /**
   * Stores all memoized power-of-twos, where each index represents `this.number * 2^index`.
   *
   * 存储所有记忆的二次幂，其中每个索引都表示 `this.number * 2^index` 。
   *
   */
  private readonly powerOfTwos: BigInteger[];

  constructor(value: BigInteger) {
    this.powerOfTwos = [value];
  }

  /**
   * Returns the big integer itself.
   *
   * 返回大整数本身。
   *
   */
  getValue(): BigInteger {
    return this.powerOfTwos[0];
  }

  /**
   * Computes the value for `num * b`, where `num` is a JS number and `b` is a big integer. The
   * value for `b` is represented by a storage model that is optimized for this computation.
   *
   * 计算 `num * b` 的值，其中 `num` 是 JS 数字， `b` 是一个大整数。 `b`
   * 的值由为此计算优化的存储模型表示。
   *
   * This operation is implemented in N(log2(num)) by continuous halving of the number, where the
   * least-significant bit (LSB) is tested in each iteration. If the bit is set, the bit's index is
   * used as exponent into the power-of-two multiplication of `b`.
   *
   * 此操作是通过将数字连续减半在 N(log2(num)) 中实现的，其中每次迭代都会测试最低有效位
   * (LSB)。如果该位已设置，则该位的索引将作为 `b` 的二次幂乘法的指数。
   *
   * As an example, consider the multiplication num=42, b=1337. In binary 42 is 0b00101010 and the
   * algorithm unrolls into the following iterations:
   *
   * 例如，考虑乘法 num=42, b=1337 。在二进制 42 中是 0b00101010 ，算法会展开为以下迭代：
   *
   * | Iteration | num | LSB | b \* 2^iter | Add? | product |
   * | --------- | --- | --- | ----------- | ---- | ------- |
   * | 迭代 | 数字 | 最低有效位 | b \* 2^iter | 添加？ | 产品 |
   * | 0 | 0b00101010 | 0 | 1337 | No | 0 |
   * | 0 | 0b00101010 | 0 | 1337 | 否 | 0 |
   * | 1 | 0b00010101 | 1 | 2674 | Yes | 2674 |
   * | 1 | 0b00010101 | 1 | 2674 | 是 | 2674 |
   * | 2 | 0b00001010 | 0 | 5348 | No | 2674 |
   * | 2 | 0b00001010 | 0 | 5348 | 否 | 2674 |
   * | 3 | 0b00000101 | 1 | 10696 | Yes | 13370 |
   * | 3 | 0b00000101 | 1 | 10696 | 是 | 13370 |
   * | 4 | 0b00000010 | 0 | 21392 | No | 13370 |
   * | 4 | 0b00000010 | 0 | 21392 | 否 | 13370 |
   * | 5 | 0b00000001 | 1 | 42784 | Yes | 56154 |
   * | 5 | 0b00000001 | 1 | 42784 | 是 | 56154 |
   * | 6 | 0b00000000 | 0 | 85568 | No | 56154 |
   * | 6 | 0b00000000 | 0 | 85568 | 否 | 56154 |
   *
   * The computed product of 56154 is indeed the correct result.
   *
   * 56154 的计算产物确实是正确的结果。
   *
   * The `BigIntForMultiplication` representation for a big integer provides memoized access to the
   * power-of-two values to reduce the workload in computing those values.
   *
   * 大整数的 `BigIntForMultiplication` 表示提供对二次幂值的记忆化访问，以减少计算这些值的工作量。
   *
   */
  multiplyBy(num: number): BigInteger {
    const product = BigInteger.zero();
    this.multiplyByAndAddTo(num, product);
    return product;
  }

  /**
   * See `multiplyBy()` for details. This function allows for the computed product to be added
   * directly to the provided result big integer.
   *
   * 有关详细信息，请参阅 `multiplyBy()` 。此函数允许将计算出的积直接添加到提供的结果大整数。
   *
   */
  multiplyByAndAddTo(num: number, result: BigInteger): void {
    for (let exponent = 0; num !== 0; num = num >>> 1, exponent++) {
      if (num & 1) {
        const value = this.getMultipliedByPowerOfTwo(exponent);
        result.addToSelf(value);
      }
    }
  }

  /**
   * Computes and memoizes the big integer value for `this.number * 2^exponent`.
   *
   * 计算并记住 `this.number * 2^exponent` 的大整数值。
   *
   */
  private getMultipliedByPowerOfTwo(exponent: number): BigInteger {
    // Compute the powers up until the requested exponent, where each value is computed from its
    // predecessor. This is simple as `this.number * 2^(exponent - 1)` only has to be doubled (i.e.
    // added to itself) to reach `this.number * 2^exponent`.
    for (let i = this.powerOfTwos.length; i <= exponent; i++) {
      const previousPower = this.powerOfTwos[i - 1];
      this.powerOfTwos[i] = previousPower.add(previousPower);
    }
    return this.powerOfTwos[exponent];
  }
}

/**
 * Represents an exponentiation operation for the provided base, of which exponents are computed and
 * memoized. The results are represented by a `BigIntForMultiplication` which is tailored for
 * multiplication operations by memoizing the power-of-twos. This effectively results in a matrix
 * representation that is lazily computed upon request.
 *
 * 表示对所提供的基数的幂运算，其中的指数被计算和记忆。结果由 `BigIntForMultiplication`
 * 表示，它通过记住二次幂来为乘法运算量身定制。这有效地导致了一个根据请求延迟计算的矩阵表示。
 *
 */
export class BigIntExponentiation {
  private readonly exponents = [new BigIntForMultiplication(BigInteger.one())];

  constructor(private readonly base: number) {}

  /**
   * Compute the value for `this.base^exponent`, resulting in a big integer that is optimized for
   * further multiplication operations.
   *
   * 计算 `this.base^exponent` 的值，得到一个针对进一步乘法运算进行优化的大整数。
   *
   */
  toThePowerOf(exponent: number): BigIntForMultiplication {
    // Compute the results up until the requested exponent, where every value is computed from its
    // predecessor. This is because `this.base^(exponent - 1)` only has to be multiplied by `base`
    // to reach `this.base^exponent`.
    for (let i = this.exponents.length; i <= exponent; i++) {
      const value = this.exponents[i - 1].multiplyBy(this.base);
      this.exponents[i] = new BigIntForMultiplication(value);
    }
    return this.exponents[exponent];
  }
}
