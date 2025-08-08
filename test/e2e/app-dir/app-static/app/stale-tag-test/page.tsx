export const revalidate = 60

export default async function StaleTagTestPage() {
  // Fetch with a specific tag for testing
  const data = await fetch(
    'https://next-data-api-endpoint.vercel.app/api/random?stale-check-3',
    {
      next: { tags: ['stale-test'] },
    }
  ).then((res) => res.text())

  const randomData = Math.random()

  return (
    <div>
      <h1>Stale Tag Test</h1>
      <p id="random">{randomData}</p>
      <p id="data">{data}</p>
      <p id="now">{Date.now()}</p>
    </div>
  )
}
