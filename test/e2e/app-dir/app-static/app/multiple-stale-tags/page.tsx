export const revalidate = 60

export default async function MultipleStaleTagsPage() {
  // Fetch with multiple tags for testing
  const data1 = await fetch(
    'https://next-data-api-endpoint.vercel.app/api/random?stale-check-1',
    {
      next: { tags: ['tag1', 'shared'] },
    }
  ).then((res) => res.text())

  const data2 = await fetch(
    'https://next-data-api-endpoint.vercel.app/api/random?stale-check-2',
    {
      next: { tags: ['tag2', 'shared'] },
    }
  ).then((res) => res.text())

  const randomData = Math.random()

  return (
    <div>
      <h1>Multiple Stale Tags Test</h1>
      <p id="random">{randomData}</p>
      <p id="data1">{data1}</p>
      <p id="data2">{data2}</p>
      <p id="now">{Date.now()}</p>
    </div>
  )
}
