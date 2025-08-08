import type { Timestamp } from '../cache-handlers/types'

export interface TagManifestEntry {
  /** Timestamp when the tag was marked as stale */
  stale?: number
  /** Timestamp when the tag should expire (for revalidateTag) */
  expire?: number
}

// We share the tags manifest between the "use cache" handlers and the previous
// file-system cache.
export const tagsManifest = new Map<string, number | TagManifestEntry>()

export const isStaleOrExpired = (
  tags: string[],
  timestamp: Timestamp
): {
  state: 'FRESH' | 'STALE' | 'EXPIRED'
} => {
  for (const tag of tags) {
    const entry = tagsManifest.get(tag)

    // Handle legacy number format (revalidatedAt timestamp)
    if (typeof entry === 'number') {
      if (entry >= timestamp) {
        return { state: 'EXPIRED' }
      }
    }
    // Handle new object format with stale/expire
    else if (entry && typeof entry === 'object') {
      const expireTimestamp = entry.expire || 0

      if (typeof expireTimestamp === 'number' && expireTimestamp >= timestamp) {
        return { state: 'EXPIRED' }
      }

      const staleTimestamp = entry.stale || 0
      if (typeof staleTimestamp === 'number' && staleTimestamp >= timestamp) {
        return { state: 'STALE' }
      }
    }
  }

  return { state: 'FRESH' }
}
