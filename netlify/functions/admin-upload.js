import { getStore } from '@netlify/blobs'

// Parses an EarthSense CSV export and stores readings in Netlify Blobs.
// Expected CSV columns (flexible): datetime, no2 (or similar)
export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const { csv, mode } = body
  if (!csv) {
    return new Response(JSON.stringify({ error: 'No CSV data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean)
  if (lines.length < 2) {
    return new Response(JSON.stringify({ error: 'Empty CSV' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',')
    return Object.fromEntries(headers.map((h, i) => [h, (vals[i] || '').trim()]))
  })

  // Find datetime and NO2 columns flexibly
  const dtCol = headers.find(h => h.includes('time') || h.includes('date')) || headers[0]
  const no2Col = headers.find(h => h.includes('no2') || h.includes('nitrogen'))

  if (!no2Col) {
    return new Response(JSON.stringify({ error: 'Could not find NO2 column in CSV' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('readings')

  if (mode === 'replace') {
    // Delete all existing readings
    const { blobs } = await store.list()
    await Promise.all(blobs.map(({ key }) => store.delete(key)))
  }

  let count = 0
  const dates = []

  for (const row of rows) {
    const dt = row[dtCol]
    const no2 = parseFloat(row[no2Col])
    if (!dt || isNaN(no2)) continue

    const key = dt.replace(/[^0-9T\-:]/g, '_')
    await store.setJSON(key, { datetime: dt, no2 })
    dates.push(dt)
    count++
  }

  dates.sort()

  return new Response(
    JSON.stringify({
      ok: true,
      count,
      from: dates[0] || '',
      to: dates[dates.length - 1] || '',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

export const config = { path: '/.netlify/functions/admin-upload' }
