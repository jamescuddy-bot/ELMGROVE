import { getStore } from '@netlify/blobs'

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

function formatDate(d) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]}`
}

function getMondayOf(dateStr) {
  const [y, m, d] = dateStr.split('/').map(Number)
  const date = new Date(y, m - 1, d)
  const dow = date.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  date.setDate(date.getDate() + diff)
  return date
}

export default async (req) => {
  const store = getStore('readings')

  let blobs
  try {
    const result = await store.list({ prefix: 'day:' })
    blobs = result.blobs
  } catch {
    return new Response(JSON.stringify({ weeks: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fetch all daily readings in parallel
  const readings = (
    await Promise.all(
      blobs.map(async ({ key }) => {
        try {
          return await store.get(key, { type: 'json' })
        } catch {
          return null
        }
      })
    )
  ).filter(Boolean)

  // Group by week (keyed by Monday's ISO date)
  const weekMap = {}
  for (const reading of readings) {
    const monday = getMondayOf(reading.date)
    const weekKey = monday.toISOString().split('T')[0]
    if (!weekMap[weekKey]) weekMap[weekKey] = { monday, days: {} }

    const [y, m, d] = reading.date.split('/').map(Number)
    const dow = new Date(y, m - 1, d).getDay() // 1=Mon … 5=Fri
    weekMap[weekKey].days[dow] = reading
  }

  // Build sorted weeks array (most recent first), complete weeks only (must have Friday data)
  const weeks = Object.entries(weekMap)
    .filter(([, { days }]) => !!days[5])
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, { monday, days }]) => {
      const friday = new Date(monday)
      friday.setDate(friday.getDate() + 4)

      const daysList = [1, 2, 3, 4, 5].map(dow => {
        const date = new Date(monday)
        date.setDate(date.getDate() + (dow - 1))
        const reading = days[dow]
        return {
          day: DAY_NAMES[dow - 1],
          date: formatDate(date),
          dropoff: reading?.dropoff ?? null,
          pickup: reading?.pickup ?? null,
        }
      })

      const daysWithData = daysList.filter(d => d.dropoff !== null)
      const exceededDays = daysWithData.filter(d => d.dropoff > 25 || d.pickup > 25).length
      const summary = daysWithData.length > 0
        ? `${exceededDays} of ${daysWithData.length} school days exceeded the WHO guideline`
        : null

      return {
        label: `Mon ${formatDate(monday)} – Fri ${formatDate(friday)}`,
        weekStart: monday.toISOString().split('T')[0],
        summary,
        days: daysList,
      }
    })

  return new Response(JSON.stringify({ weeks }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/.netlify/functions/readings' }
