import { connection } from 'next/server'
import React from 'react'

export default async function Page() {
  // ensure this page is dynamically rendered so we always trigger a loading state
  await connection()
  return <div id="page-content">Content</div>
}

async function getTitle() {
  return await new Promise((resolve) =>
    setTimeout(() => resolve('Async Title'), 5000)
  )
}

export async function generateMetadata() {
  return { title: await getTitle() }
}
