import { getStore } from '@netlify/blobs'

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let body
  try { body = await req.json() } catch { return new Response('Bad request', { status: 400 }) }

  const { readings, mode } = body
  if (!readings?.length) {
    return new Response(JSON.stringify({ error: 'No readings' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('readings')

  if (mode === 'replace') {
    const { blobs } = await store.list()
    await Promise.all(blobs.map(({ key }) => store.delete(key)))
  }

  await Promise.all(
    readings.map(r => store.setJSON(`day:${r.date.replace(/\//g, '-')}`, r))
  )

  const dates = readings.map(r => r.date).sort()

  return new Response(
    JSON.stringify({ ok: true, count: readings.length, from: dates[0], to: dates[dates.length - 1] }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

export const config = { path: '/.netlify/functions/admin-upload' }
