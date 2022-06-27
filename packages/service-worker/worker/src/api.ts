/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export enum UpdateCacheStatus {
  NOT_CACHED,
  CACHED_BUT_UNUSED,
  CACHED,
}

/**
 * A `string` representing a URL that has been normalized relative to an origin (usually that of the
 * ServiceWorker).
 *
 * 一个 `string` ，表示已相对于源（通常是 ServiceWorker 的）规范化的 URL。
 *
 * If the URL is relative to the origin, then it is representated by the path part only. Otherwise,
 * the full URL is used.
 *
 * 如果 URL 是相对于原点的，则它仅由路径部分表示。否则，使用完整的 URL。
 *
 * NOTE: A `string` is not assignable to a `NormalizedUrl`, but a `NormalizedUrl` is assignable to a
 *       `string`.
 *
 * 注意： `string` 不能分配给 `NormalizedUrl` ，但 `NormalizedUrl` 可以分配给 `string` 。
 *
 */
export type NormalizedUrl = string&{_brand: 'normalizedUrl'};

/**
 * A source for old versions of URL contents and other resources.
 *
 * 旧版本的 URL 内容和其他资源的来源。
 *
 * Used to abstract away the fetching of old contents, to avoid a
 * circular dependency between the `Driver` and `AppVersion`. Without
 * this interface, `AppVersion` would need a reference to the `Driver`
 * to access information from other versions.
 *
 * 用于抽象化旧内容的获取，以避免 `Driver` 和 `AppVersion` 之间的循环依赖。如果没有此接口，
 * `AppVersion` 将需要对 `Driver` 的引用来访问来自其他版本的信息。
 *
 */
export interface UpdateSource {
  /**
   * Lookup an older version of a resource for which the hash is known.
   *
   * 查找已知哈希值的旧版本资源。
   *
   * If an old version of the resource doesn't exist, or exists but does
   * not match the hash given, this returns null.
   *
   * 如果资源的旧版本不存在，或者存在但与给定的哈希不匹配，则返回 null 。
   *
   */
  lookupResourceWithHash(url: NormalizedUrl, hash: string): Promise<Response|null>;

  /**
   * Lookup an older version of a resource for which the hash is not known.
   *
   * 查找哈希值未知的旧版本资源。
   *
   * This will return the most recent previous version of the resource, if
   * it exists. It returns a `CacheState` object which encodes not only the
   * `Response`, but the cache metadata needed to re-cache the resource in
   * a newer `AppVersion`.
   *
   * 这将返回资源的最新版本（如果存在）。它返回一个 `CacheState` 对象，该对象不仅编码 `Response`
   * ，还编码在较新的 `AppVersion` 中重新缓存资源所需的缓存元数据。
   *
   */
  lookupResourceWithoutHash(url: NormalizedUrl): Promise<CacheState|null>;

  /**
   * List the URLs of all of the resources which were previously cached.
   *
   * 列出以前缓存的所有资源的 URL。
   *
   * This allows for the discovery of resources which are not listed in the
   * manifest but which were picked up because they matched URL patterns.
   *
   * 这允许发现清单中未列出但因为匹配 URL 模式而被提取的资源。
   *
   */
  previouslyCachedResources(): Promise<NormalizedUrl[]>;

  /**
   * Check whether a particular resource exists in the most recent cache.
   *
   * 检查最新的缓存中是否存在特定资源。
   *
   * This returns a state value which indicates whether the resource was
   * cached at all and whether that cache was utilized.
   *
   * 这会返回一个状态值，该值表明资源是否已被缓存以及该缓存是否被利用。
   *
   */
  recentCacheStatus(url: string): Promise<UpdateCacheStatus>;
}

/**
 * Metadata cached along with a URL.
 *
 * 与 URL 一起缓存的元数据。
 *
 */
export interface UrlMetadata {
  /**
   * The timestamp, in UNIX time in milliseconds, of when this URL was stored
   * in the cache.
   *
   * 此 URL 存储在缓存中的时间戳（以 UNIX 时间为单位）。
   *
   */
  ts: number;

  /**
   * Whether the resource was requested before for this particular cached
   * instance.
   *
   * 之前是否曾为此特定的缓存实例请求过资源。
   *
   */
  used: boolean;
}

/**
 * The fully cached state of a resource, including both the `Response` itself
 * and the cache metadata.
 *
 * 资源的完全缓存状态，包括 `Response` 本身和缓存元数据。
 *
 */
export interface CacheState {
  response: Response;
  metadata?: UrlMetadata;
}

export interface DebugLogger {
  log(value: string|Error, context?: string): void;
}

export interface DebugState {
  state: string;
  why: string;
  latestHash: string|null;
  lastUpdateCheck: number|null;
}

export interface DebugVersion {
  hash: string;
  manifest: Object;
  clients: string[];
  status: string;
}

export interface DebugIdleState {
  queue: string[];
  lastTrigger: number|null;
  lastRun: number|null;
}

export interface Debuggable {
  debugState(): Promise<DebugState>;
  debugVersions(): Promise<DebugVersion[]>;
  debugIdleState(): Promise<DebugIdleState>;
}
