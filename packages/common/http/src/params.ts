/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A codec for encoding and decoding parameters in URLs.
 *
 * 一个用来在 URL 中编码和解码参数的编解码器。
 *
 * Used by `HttpParams`.
 *
 * 由 `HttpParams` 使用。
 *
 * @publicApi
 **/
export interface HttpParameterCodec {
  encodeKey(key: string): string;
  encodeValue(value: string): string;

  decodeKey(key: string): string;
  decodeValue(value: string): string;
}

/**
 * Provides encoding and decoding of URL parameter and query-string values.
 *
 * Serializes and parses URL parameter keys and values to encode and decode them.
 * If you pass URL query parameters without encoding,
 * the query parameters can be misinterpreted at the receiving end.
 *
 *
 * 一个 `HttpParameterCodec`，它使用 `encodeURIComponent` 和 `decodeURIComponent` 来序列化和解析 URL 参数的 key 和 value。
 * 如果你传入未编码的查询参数，那么接收端可能会对这些参数进行错误解析。请使用 `HttpParameterCodec` 类对查询字符串的值进行编码和解码。
 *
 * @publicApi
 */
export class HttpUrlEncodingCodec implements HttpParameterCodec {
  /**
   * Encodes a key name for a URL parameter or query-string.
   * @param key The key name.
   * @returns The encoded key name.
   */
  encodeKey(key: string): string {
    return standardEncoding(key);
  }

  /**
   * Encodes the value of a URL parameter or query-string.
   * @param value The value.
   * @returns The encoded value.
   */
  encodeValue(value: string): string {
    return standardEncoding(value);
  }

  /**
   * Decodes an encoded URL parameter or query-string key.
   * @param key The encoded key name.
   * @returns The decoded key name.
   */
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  /**
   * Decodes an encoded URL parameter or query-string value.
   * @param value The encoded value.
   * @returns The decoded value.
   */
  decodeValue(value: string) {
    return decodeURIComponent(value);
  }
}


function paramParser(rawParams: string, codec: HttpParameterCodec): Map<string, string[]> {
  const map = new Map<string, string[]>();
  if (rawParams.length > 0) {
    const params: string[] = rawParams.split('&');
    params.forEach((param: string) => {
      const eqIdx = param.indexOf('=');
      const [key, val]: string[] = eqIdx == -1 ?
          [codec.decodeKey(param), ''] :
          [codec.decodeKey(param.slice(0, eqIdx)), codec.decodeValue(param.slice(eqIdx + 1))];
      const list = map.get(key) || [];
      list.push(val);
      map.set(key, list);
    });
  }
  return map;
}
function standardEncoding(v: string): string {
  return encodeURIComponent(v)
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/gi, '$')
      .replace(/%2C/gi, ',')
      .replace(/%3B/gi, ';')
      .replace(/%2B/gi, '+')
      .replace(/%3D/gi, '=')
      .replace(/%3F/gi, '?')
      .replace(/%2F/gi, '/');
}

interface Update {
  param: string;
  value?: string;
  op: 'a'|'d'|'s';
}

/**
 * Options used to construct an `HttpParams` instance.
 *
 * 用于构造 `HttpParams` 实例的选项。
 *
 * @publicApi
 */
export interface HttpParamsOptions {
  /**
   * String representation of the HTTP parameters in URL-query-string format.
   * Mutually exclusive with `fromObject`.
   *
   * HTTP 参数的 URL 查询字符串格式表示法。与 `fromObject` 互斥。
   */
  fromString?: string;

  /** Object map of the HTTP parameters. Mutually exclusive with `fromString`.
   *
   * HTTP 参数的对象映射表。与 `fromString` 互斥。
   */
  fromObject?: {[param: string]: string|ReadonlyArray<string>};

  /** Encoding codec used to parse and serialize the parameters.
   *
   * 用来解析和序列化参数的编解码器。
   */
  encoder?: HttpParameterCodec;
}

/**
 * An HTTP request/response body that represents serialized parameters,
 * per the MIME type `application/x-www-form-urlencoded`.
 *
 * HTTP 请求/响应体，用来表示序列化参数，它们的 MIME 类型都是 `application/x-www-form-urlencoded`。
 *
 * This class is immutable; all mutation operations return a new instance.
 *
 * 这个类是不可变的 - 每个修改类的操作都会返回一个新实例。
 *
 * @publicApi
 */
export class HttpParams {
  private map: Map<string, string[]>|null;
  private encoder: HttpParameterCodec;
  private updates: Update[]|null = null;
  private cloneFrom: HttpParams|null = null;

  constructor(options: HttpParamsOptions = {} as HttpParamsOptions) {
    this.encoder = options.encoder || new HttpUrlEncodingCodec();
    if (!!options.fromString) {
      if (!!options.fromObject) {
        throw new Error(`Cannot specify both fromString and fromObject.`);
      }
      this.map = paramParser(options.fromString, this.encoder);
    } else if (!!options.fromObject) {
      this.map = new Map<string, string[]>();
      Object.keys(options.fromObject).forEach(key => {
        const value = (options.fromObject as any)[key];
        this.map!.set(key, Array.isArray(value) ? value : [value]);
      });
    } else {
      this.map = null;
    }
  }

  /**
   * Reports whether the body includes one or more values for a given parameter.
   * @param param The parameter name.
   * @returns True if the parameter has one or more values,
   * false if it has no value or is not present.
   */
  has(param: string): boolean {
    this.init();
    return this.map!.has(param);
  }

  /**
   * Retrieves the first value for a parameter.
   * @param param The parameter name.
   * @returns The first value of the given parameter,
   * or `null` if the parameter is not present.
   *
   * 获取给定参数名对应的第一个值，如果没有则返回 `null`。
   */
  get(param: string): string|null {
    this.init();
    const res = this.map!.get(param);
    return !!res ? res[0] : null;
  }

  /**
   * Retrieves all values for a  parameter.
   * @param param The parameter name.
   * @returns All values in a string array,
   * or `null` if the parameter not present.
   *
   * 获取给定参数名对应的所有值，如果没有则返回 `null`。
   */
  getAll(param: string): string[]|null {
    this.init();
    return this.map!.get(param) || null;
  }

  /**
   * Retrieves all the parameters for this body.
   * @returns The parameter names in a string array.
   */
  keys(): string[] {
    this.init();
    return Array.from(this.map!.keys());
  }

  /**
   * Appends a new value to existing values for a parameter.
   * @param param The parameter name.
   * @param value The new value to add.
   * @return A new body with the appended value.
   *
   * 构造一个新的 `body`，添加一个具有给定参数名的值。
   */
  append(param: string, value: string): HttpParams {
    return this.clone({param, value, op: 'a'});
  }

  /**
   * Replaces the value for a parameter.
   * @param param The parameter name.
   * @param value The new value.
   * @return A new body with the new value.
   *
   * 构造一个新的 `body`，具有一个给定参数名的新值。
   */
  set(param: string, value: string): HttpParams {
    return this.clone({param, value, op: 's'});
  }

  /**
   * Removes a given value or all values from a parameter.
   * @param param The parameter name.
   * @param value The value to remove, if provided.
   * @return A new body with the given value removed, or with all values
   * removed if no value is specified.
   *
   * 构造一个新的 `body`，如果指定了 `value`，则移除具有指定 `value` 和指定 `param` 的条目；如果没有指定 `value`，则移除指定 `param` 对应的所有值。
   */
  delete(param: string, value?: string): HttpParams {
    return this.clone({param, value, op: 'd'});
  }

  /**
   * Serializes the body to an encoded string, where key-value pairs (separated by `=`) are
   * separated by `&`s.
   *
   * 把该 `body` 序列化为一个编码过的字符串，其中的 key-value 对（用 `=` 分隔）会以 `&` 分隔。
   */
  toString(): string {
    this.init();
    return this.keys()
        .map(key => {
          const eKey = this.encoder.encodeKey(key);
          // `a: ['1']` produces `'a=1'`
          // `b: []` produces `''`
          // `c: ['1', '2']` produces `'c=1&c=2'`
          return this.map!.get(key)!.map(value => eKey + '=' + this.encoder.encodeValue(value))
              .join('&');
        })
        // filter out empty values because `b: []` produces `''`
        // which results in `a=1&&c=1&c=2` instead of `a=1&c=1&c=2` if we don't
        .filter(param => param !== '')
        .join('&');
  }

  private clone(update: Update): HttpParams {
    const clone = new HttpParams({encoder: this.encoder} as HttpParamsOptions);
    clone.cloneFrom = this.cloneFrom || this;
    clone.updates = (this.updates || []).concat([update]);
    return clone;
  }

  private init() {
    if (this.map === null) {
      this.map = new Map<string, string[]>();
    }
    if (this.cloneFrom !== null) {
      this.cloneFrom.init();
      this.cloneFrom.keys().forEach(key => this.map!.set(key, this.cloneFrom!.map!.get(key)!));
      this.updates!.forEach(update => {
        switch (update.op) {
          case 'a':
          case 's':
            const base = (update.op === 'a' ? this.map!.get(update.param) : undefined) || [];
            base.push(update.value!);
            this.map!.set(update.param, base);
            break;
          case 'd':
            if (update.value !== undefined) {
              let base = this.map!.get(update.param) || [];
              const idx = base.indexOf(update.value);
              if (idx !== -1) {
                base.splice(idx, 1);
              }
              if (base.length > 0) {
                this.map!.set(update.param, base);
              } else {
                this.map!.delete(update.param);
              }
            } else {
              this.map!.delete(update.param);
              break;
            }
        }
      });
      this.cloneFrom = this.updates = null;
    }
  }
}
