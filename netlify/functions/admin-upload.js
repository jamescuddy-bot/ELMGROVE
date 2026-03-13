import { getStore } from '@netlify/blobs'

const DROPOFF_START = '08:15'
const DROPOFF_END = '09:15'
const PICKUP_START = '14:45'
const PICKUP_END = '15:45'

function parseCSVLine(line) {
  const result = []
  let current = ''
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

function timeInRange(time, start, end) {
  return time >= start && time <= end
}

function avg(arr) {
  if (!arr.length) return null
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

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

  // Find the actual data header row (contains "Date (Local)")
  const headerIdx = lines.findIndex(l => l.includes('Date (Local)'))
  if (headerIdx === -1) {
    return new Response(JSON.stringify({ error: 'Could not find data headers in CSV' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const headers = parseCSVLine(lines[headerIdx]).map(h => h.trim())
  const dataLines = lines.slice(headerIdx + 1)

  const dateCol = headers.indexOf('Date (Local)')
  const timeCol = headers.indexOf('Time (Local)')
  const no2Col = headers.indexOf('NO2 Concentration')

  if (dateCol === -1 || timeCol === -1 || no2Col === -1) {
    return new Response(JSON.stringify({ error: 'Required columns not found' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Group readings by date, Mon–Fri only
  const byDate = {}
  for (const line of dataLines) {
    const vals = parseCSVLine(line)
    const dateStr = vals[dateCol]?.trim()
    const time = vals[timeCol]?.trim().substring(0, 5) // HH:MM
    const no2 = parseFloat(vals[no2Col])
    if (!dateStr || !time || isNaN(no2)) continue

    // Only store weekdays (Mon=1 … Fri=5)
    const [y, m, d] = dateStr.split('/').map(Number)
    const dow = new Date(y, m - 1, d).getDay()
    if (dow === 0 || dow === 6) continue

    if (!byDate[dateStr]) byDate[dateStr] = { dropoff: [], pickup: [] }
    if (timeInRange(time, DROPOFF_START, DROPOFF_END)) byDate[dateStr].dropoff.push(no2)
    if (timeInRange(time, PICKUP_START, PICKUP_END)) byDate[dateStr].pickup.push(no2)
  }

  const store = getStore('readings')

  if (mode === 'replace') {
    const { blobs } = await store.list()
    await Promise.all(blobs.map(({ key }) => store.delete(key)))
  }

  const dates = Object.keys(byDate).sort()
  let count = 0

  for (const dateStr of dates) {
    const { dropoff, pickup } = byDate[dateStr]
    const dropoffAvg = avg(dropoff)
    const pickupAvg = avg(pickup)
    if (dropoffAvg === null && pickupAvg === null) continue

    const key = `day:${dateStr.replace(/\//g, '-')}`
    await store.setJSON(key, { date: dateStr, dropoff: dropoffAvg, pickup: pickupAvg })
    count++
  }

  return new Response(
    JSON.stringify({ ok: true, count, from: dates[0] || '', to: dates[dates.length - 1] || '' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

export const config = { path: '/.netlify/functions/admin-upload' }
