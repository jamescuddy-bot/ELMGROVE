import { getStore } from '@netlify/blobs'

const WHO_LIMIT = 25

function getMondayOf(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dow = date.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  date.setDate(date.getDate() + diff)
  return date
}

function formatDateLabel(d) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]}`
}

function avg(arr) {
  if (!arr.length) return null
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
}

export default async (req) => {
  const store = getStore('readings')

  let blobs
  try {
    const result = await store.list({ prefix: 'day:' })
    blobs = result.blobs
  } catch {
    return new Response(JSON.stringify({ error: 'No data' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!blobs.length) {
    return new Response(JSON.stringify({ error: 'No data' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fetch all readings
  const readings = (
    await Promise.all(
      blobs.map(async ({ key }) => {
        try { return await store.get(key, { type: 'json' }) } catch { return null }
      })
    )
  ).filter(Boolean)

  // Sort descending
  readings.sort((a, b) => b.date.localeCompare(a.date))

  // Key from blob is day:YYYY-MM-DD but date in record is YYYY/MM/DD — normalise
  const normalise = d => d.replace(/\//g, '-')

  // Find the most recent Friday in the data — that marks a complete week
  const isFriday = dateStr => {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).getDay() === 5
  }

  const mostRecentFriday = readings.find(r => isFriday(normalise(r.date)))
  const referenceDate = mostRecentFriday ? normalise(mostRecentFriday.date) : normalise(readings[0].date)

  // Get the Mon–Fri week containing that date
  const monday = getMondayOf(referenceDate)
  const friday = new Date(monday)
  friday.setDate(friday.getDate() + 4)

  const weekDates = new Set()
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday)
    d.setDate(d.getDate() + i)
    weekDates.add(d.toISOString().split('T')[0])
  }

  const weekReadings = readings.filter(r => weekDates.has(normalise(r.date)))

  const dropoffVals = weekReadings.map(r => r.dropoff).filter(v => v !== null)
  const pickupVals  = weekReadings.map(r => r.pickup).filter(v => v !== null)

  const dropoffAvg = avg(dropoffVals)
  const pickupAvg  = avg(pickupVals)
  const totalDays  = weekReadings.length
  const daysExceeded = weekReadings.filter(r => r.dropoff > WHO_LIMIT || r.pickup > WHO_LIMIT).length

  const dropoffPctOver = dropoffAvg !== null && dropoffAvg > WHO_LIMIT
    ? Math.round((dropoffAvg - WHO_LIMIT) / WHO_LIMIT * 100)
    : null

  const pickupPctOver = pickupAvg !== null && pickupAvg > WHO_LIMIT
    ? Math.round((pickupAvg - WHO_LIMIT) / WHO_LIMIT * 100)
    : null

  const label = `Mon ${formatDateLabel(monday)} – Fri ${formatDateLabel(friday)}`

  return new Response(
    JSON.stringify({
      label,
      dropoffAvg,
      pickupAvg,
      daysExceeded,
      totalDays,
      dropoffPctOver,
      pickupPctOver,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}

export const config = { path: '/.netlify/functions/latest-stats' }
