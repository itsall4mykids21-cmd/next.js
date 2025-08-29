import { connection } from 'next/server'
import { Suspense } from 'react'

async function ForceDynamic({ children }) {
  await connection()
  return children
}

export default function Layout({ children }) {
  return (
    <Suspense>
      <ForceDynamic>
        <html>
          <head></head>
          <body>{children}</body>
        </html>
      </ForceDynamic>
    </Suspense>
  )
}
