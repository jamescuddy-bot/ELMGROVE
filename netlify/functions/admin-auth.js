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

  const { password } = body
  const adminPassword = process.env.ADMIN_PASSWORD || 'elmgrove2026'

  if (password === adminPassword) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: false }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/.netlify/functions/admin-auth' }
