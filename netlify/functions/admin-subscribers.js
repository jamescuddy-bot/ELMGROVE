import { getStore } from '@netlify/blobs'

export default async () => {
  const store = getStore('subscribers')
  const { blobs } = await store.list()

  const subscribers = await Promise.all(
    blobs.map(async ({ key }) => {
      const data = await store.get(key, { type: 'json' })
      return data
    })
  )

  return new Response(JSON.stringify({ subscribers: subscribers.filter(Boolean) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/.netlify/functions/admin-subscribers' }
