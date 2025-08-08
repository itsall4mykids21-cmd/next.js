import { nextTestSetup } from 'e2e-utils'
import { retry } from 'next-test-utils'

describe('app-dir set-tag-stale', () => {
  const { next, skipped, isNextDev } = nextTestSetup({
    files: __dirname,
    skipDeployment: true,
  })

  if (skipped || isNextDev) {
    it('should skip test', () => {})
    return
  }

  it('should mark single tag as stale with setTagStale', async () => {
    // First, get the initial page
    const $ = await next.render$('/stale-tag-test')
    const initialRandom = $('#random').text()
    const initialNow = $('#now').text()

    // Mark tag as stale
    await next.fetch('/api/set-tag-stale-node?tag=stale-test')

    // The page should still show the same content initially (not immediately invalidated)
    const $2 = await next.render$('/stale-tag-test')
    const secondRandom = $2('#random').text()
    const secondNow = $2('#now').text()

    // Should be the same since it's marked stale but not invalidated yet
    expect(secondRandom).toBe(initialRandom)
    expect(secondNow).toBe(initialNow)

    // Should now show fresh content
    await retry(async () => {
      const $3 = await next.render$('/stale-tag-test')
      const thirdRandom = $3('#random').text()
      const thirdNow = $3('#now').text()

      expect(thirdRandom).not.toBe(initialRandom)
      expect(thirdNow).not.toBe(initialNow)
    })
  })

  it('should mark multiple tags as stale with setTagStale', async () => {
    // Get initial state
    const $ = await next.render$('/multiple-stale-tags')
    const initialRandom = $('#random').text()

    // Mark multiple tags as stale
    await next.fetch('/api/set-tag-stale-node?tags=tag1,tag2,shared')

    // Content should still be the same initially
    const $2 = await next.render$('/multiple-stale-tags')
    expect($2('#random').text()).toBe(initialRandom)

    // Should now show fresh content
    await retry(async () => {
      const $3 = await next.render$('/multiple-stale-tags')
      expect($3('#random').text()).not.toBe(initialRandom)
    })
  })

  it('should work with edge runtime for setTagStale', async () => {
    const $ = await next.render$('/stale-tag-test')
    const initialRandom = $('#random').text()

    // Mark tag as stale using edge runtime
    const response = await next.fetch('/api/set-tag-stale-edge?tag=stale-test')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.stale).toBe(true)

    // Content should initially remain the same
    const $2 = await next.render$('/stale-tag-test')
    const secondRandom = $2('#random').text()
    expect(secondRandom).toBe(initialRandom)

    // Revalidate to see the change
    await next.fetch('/api/revalidate-tag-edge?tag=stale-test')

    await retry(async () => {
      const $3 = await next.render$('/stale-tag-test')
      const thirdRandom = $3('#random').text()
      expect(thirdRandom).not.toBe(initialRandom)
    })
  })

  it('should handle empty tag gracefully', async () => {
    const response = await next.fetch('/api/set-tag-stale-node')
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.stale).toBe(true)
  })

  it('should preserve expire timestamp when using setTagStale then revalidateTag', async () => {
    const $ = await next.render$('/stale-tag-test')
    const initialRandom = $('#random').text()
    const initialData = $('#data').text()

    // First mark as stale
    await next.fetch('/api/set-tag-stale-node?tag=stale-test')

    // Should initially remain the same
    const $2 = await next.render$('/stale-tag-test')
    expect($2('#random').text()).toBe(initialRandom)
    expect($2('#data').text()).toBe(initialData)

    await retry(async () => {
      const $3 = await next.render$('/stale-tag-test')
      expect($3('#random').text()).not.toBe(initialRandom)
      expect($3('#data').text()).not.toBe(initialData)
    })
  })

  it('should work with array input for multiple tags', async () => {
    const $ = await next.render$('/multiple-stale-tags')
    const initialData1 = $('#data1').text()
    const initialData2 = $('#data2').text()

    // Test with comma-separated tags (simulating array)
    const response = await next.fetch('/api/set-tag-stale-node?tags=tag1,tag2')
    expect(response.status).toBe(200)

    // Should initially remain the same
    const $2 = await next.render$('/multiple-stale-tags')
    expect($2('#data1').text()).toBe(initialData1)
    expect($2('#data2').text()).toBe(initialData2)

    await retry(async () => {
      const $3 = await next.render$('/multiple-stale-tags')
      expect($3('#random').text()).not.toBe($('#random').text())
      expect($3('#data1').text()).not.toBe(initialData1)
      expect($3('#data2').text()).not.toBe(initialData2)
    })
  })
})
