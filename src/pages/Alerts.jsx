import { useState } from 'react'
import Layout from '../components/Layout'

export default function Alerts() {
  const [phone, setPhone] = useState('')
  const [timing, setTiming] = useState('evening')
  const [level, setLevel] = useState('all')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [unsubPhone, setUnsubPhone] = useState('')
  const [unsubDone, setUnsubDone] = useState(false)

  const showPrefs = phone.replace(/\s/g, '').length >= 10

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, timing, level }),
      })
    } catch (_) {}
    setSubmitting(false)
    setSubmitted(true)
  }

  async function handleUnsub(e) {
    e.preventDefault()
    try {
      await fetch('/.netlify/functions/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: unsubPhone }),
      })
    } catch (_) {}
    setUnsubDone(true)
  }

  if (submitted) {
    return (
      <Layout>
        <div className="px-5 pt-16 pb-8 flex flex-col gap-6">
          <div className="w-14 h-14 rounded-full bg-[#F0FDF8] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-[28px] font-bold text-ink leading-snug">You're almost signed up.</h1>

          <p className="text-[16px] text-gray-500 leading-relaxed">
            We've sent a confirmation text to <strong className="text-ink">{phone}</strong>.
            Reply <strong className="text-ink">YES</strong> to complete your sign-up.
          </p>

          <div className="bg-mint-tint rounded-[10px] p-4 flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-ink">Your preferences</span>
            <span className="text-[13px] text-gray-500">
              Alert timing: {timing === 'evening' ? 'Evening before (approx. 21:00)' : 'Evening + morning confirmation (07:00)'}
            </span>
            <span className="text-[13px] text-gray-500">
              Alert level: {level === 'all' ? 'All exceedances (25+ μg/m³)' : 'Severe spikes only (40+ μg/m³)'}
            </span>
          </div>

          <p className="text-[13px] text-gray-300 leading-relaxed">
            To stop receiving alerts at any time, reply <strong>STOP</strong> to any message.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="px-5 pt-6 pb-8 flex flex-col gap-6">
        {/* Intro */}
        <div className="flex flex-col gap-2">
          <h1 className="text-[26px] font-bold text-ink">Early NO₂ alerts</h1>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            Get a free text message when NO₂ levels at Elm Grove are forecast to be high. Alerts are
            sent before drop-off so you have time to act. Reply STOP to any message to unsubscribe,
            or use the link at the bottom of this page.
          </p>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-ink">Mobile number</label>
          <div className={`flex items-center gap-3 border-2 rounded-[10px] px-4 py-3.5 bg-white transition-colors ${phone ? 'border-teal' : 'border-gray-200'}`}>
            <span className="text-[16px] text-gray-300">+44</span>
            <div className="w-px h-5 bg-gray-200" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="7700 900 000"
              className="flex-1 text-[16px] font-medium text-ink border-none outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Preferences — revealed once number entered */}
        {showPrefs && (
          <>
            {/* Timing */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[13px] font-semibold text-ink">When would you like to be alerted?</span>
              {[
                { val: 'evening', label: 'Evening before (approx. 21:00)', sub: 'More time to plan but slightly lower accuracy' },
                { val: 'both', label: 'Evening + morning confirmation (07:00)', sub: 'Most accurate, less lead time' },
              ].map(({ val, label, sub }) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setTiming(val)}
                  className={`flex items-start gap-3 rounded-[10px] px-4 py-3.5 text-left border-2 transition-all ${
                    timing === val ? 'border-teal bg-[#f0fbfc]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${timing === val ? 'border-teal bg-teal' : 'border-gray-300 bg-white'}`}>
                    {timing === val && <div className="w-[7px] h-[7px] rounded-full bg-white" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-ink">{label}</span>
                    <span className="text-[13px] text-gray-400">{sub}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Level */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[13px] font-semibold text-ink">Which alerts would you like?</span>
              {[
                { val: 'all', label: 'All exceedances', sub: 'NO₂ exceeds the WHO guideline of 25 μg/m³' },
                { val: 'severe', label: 'Severe spikes only', sub: 'NO₂ exceeds 40 μg/m³' },
              ].map(({ val, label, sub }) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setLevel(val)}
                  className={`flex items-start gap-3 rounded-[10px] px-4 py-3.5 text-left border-2 transition-all ${
                    level === val ? 'border-teal bg-[#f0fbfc]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${level === val ? 'border-teal bg-teal' : 'border-gray-300 bg-white'}`}>
                    {level === val && <div className="w-[7px] h-[7px] rounded-full bg-white" />}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-ink">{label}</span>
                    <span className="text-[13px] text-gray-400">{sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Privacy */}
        <div className="bg-gray-50 rounded-[10px] px-4 py-3.5">
          <p className="text-[12px] text-gray-400 leading-relaxed">
            Your mobile number will only be used to send air quality alerts. It will never be shared.
            You can unsubscribe at any time by replying STOP.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!showPrefs || submitting}
          className="bg-teal text-white text-[16px] font-bold py-4 rounded-[10px] border-none cursor-pointer disabled:opacity-40"
        >
          {submitting ? 'Signing you up…' : 'Sign me up'}
        </button>

        {/* Unsubscribe */}
        <div className="border-t border-gray-100 pt-5">
          {unsubDone ? (
            <p className="text-[13px] text-gray-400">You've been unsubscribed.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-gray-400">Already signed up and want to stop?</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={unsubPhone}
                  onChange={e => setUnsubPhone(e.target.value)}
                  placeholder="Your mobile number"
                  className="flex-1 border border-gray-200 rounded-[8px] px-3 py-2.5 text-[14px] outline-none"
                />
                <button
                  type="button"
                  onClick={handleUnsub}
                  disabled={!unsubPhone}
                  className="text-[13px] font-semibold text-teal bg-transparent border-none cursor-pointer disabled:opacity-40"
                >
                  Unsubscribe
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </Layout>
  )
}
