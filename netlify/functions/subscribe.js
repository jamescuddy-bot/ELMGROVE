import { getStore } from '@netlify/blobs'
import twilio from 'twilio'

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

  const { phone, timing, level } = body
  if (!phone || !timing || !level) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Normalise phone: strip spaces/dashes, ensure +44 for UK numbers
  const normalised = normalisePhone(phone)
  if (!normalised) {
    return new Response(JSON.stringify({ error: 'Invalid phone number' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const store = getStore('subscribers')
  const subscriber = {
    phone: normalised,
    timing,
    level,
    date: new Date().toISOString().split('T')[0],
    confirmed: false,
  }
  await store.setJSON(normalised, subscriber)

  // Send confirmation SMS via Twilio
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
    await client.messages.create({
      body: 'Elm Grove air quality alerts: reply YES to confirm, STOP to cancel.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normalised,
    })
  } catch (err) {
    console.error('Twilio error:', err.message)
    // Don't fail the subscription — user is saved, SMS just didn't send
  }

  return new Response(JSON.stringify({ ok: true, phone: normalised }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

function normalisePhone(raw) {
  const digits = raw.replace(/[\s\-().+]/g, '')
  if (digits.startsWith('44') && digits.length === 12) return `+${digits}`
  if (digits.startsWith('07') && digits.length === 11) return `+44${digits.slice(1)}`
  if (digits.startsWith('7') && digits.length === 10) return `+44${digits}`
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}` // US
  if (digits.length >= 7) return `+${digits}` // fallback
  return null
}

export const config = { path: '/.netlify/functions/subscribe' }
