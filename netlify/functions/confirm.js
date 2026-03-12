import { getStore } from '@netlify/blobs'

// Twilio webhook for inbound SMS replies (YES / STOP)
export default async (req) => {
  const text = await req.text()
  const params = new URLSearchParams(text)
  const from = params.get('From') // e.g. +441234567890
  const body = (params.get('Body') || '').trim().toUpperCase()

  const store = getStore('subscribers')

  if (body === 'YES') {
    const existing = await store.get(from, { type: 'json' })
    if (existing) {
      await store.setJSON(from, { ...existing, confirmed: true })
    }
    return twiml('You\'re confirmed for Elm Grove air quality alerts. Reply STOP at any time to unsubscribe.')
  }

  if (body === 'STOP') {
    await store.delete(from)
    return twiml('You\'ve been unsubscribed from Elm Grove air quality alerts.')
  }

  // Any other reply — no response needed (Twilio still expects 200)
  return twiml('')
}

function twiml(message) {
  const xml = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`
  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

export const config = { path: '/.netlify/functions/confirm' }
