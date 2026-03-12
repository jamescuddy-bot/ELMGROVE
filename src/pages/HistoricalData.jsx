import { useState } from 'react'
import Layout from '../components/Layout'

const days = [
  { day: 'Mon', date: '2 Mar', dropoff: 34, pickup: 31 },
  { day: 'Tue', date: '3 Mar', dropoff: 28, pickup: 26 },
  { day: 'Wed', date: '4 Mar', dropoff: 22, pickup: 19 },
  { day: 'Thu', date: '5 Mar', dropoff: 38, pickup: 35 },
  { day: 'Fri', date: '6 Mar', dropoff: 41, pickup: 33 },
]

function severity(val) {
  if (val <= 25) return { bg: 'bg-[#F0FDF8]', text: 'text-[#059669]' }
  if (val <= 30) return { bg: 'bg-[#FFF8E6]', text: 'text-[#d4900a]' }
  if (val <= 39) return { bg: 'bg-[#fff0f3]', text: 'text-[#EF476F]' }
  return { bg: 'bg-[#B5173A]', text: 'text-white' }
}

function Reading({ val }) {
  const { bg, text } = severity(val)
  return (
    <div className={`${bg} rounded-lg px-3 py-2 flex flex-col items-center gap-0.5 w-[90px]`}>
      <span className={`text-[16px] font-bold leading-none ${text}`}>{val}</span>
      <span className={`text-[10px] ${text} opacity-80`}>μg/m³</span>
    </div>
  )
}

export default function HistoricalData() {
  const [tab, setTab] = useState('week')

  return (
    <Layout>
      <div className="px-5 pt-6 pb-8">
        <h1 className="text-[26px] font-bold text-ink mb-2">Historical data</h1>
        <p className="text-[14px] text-gray-500 mb-5">
          This data is from{' '}
          <a
            href="https://portal.earthsense.co.uk/BrightonHoveandSussexPublic/analysis"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal no-underline"
          >
            Brighton &amp; Hove's Air Quality Portal
          </a>
          {' '}– based on a sensor at Elm Grove
        </p>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-[10px] p-1 gap-1 mb-5">
          {[['week', 'Last week'], ['trends', 'Historical trends']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              className={`flex-1 py-2.5 rounded-[7px] text-[14px] border-none cursor-pointer transition-all ${
                tab === val
                  ? 'bg-white font-bold text-ink shadow-sm'
                  : 'bg-transparent text-gray-400 font-normal'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'week' ? (
          <>
            {/* Summary */}
            <div className="border-l-4 border-[#EF476F] bg-[#fff5f7] rounded-r-[10px] px-4 py-4 mb-5">
              <p className="text-[18px] font-bold text-ink leading-snug mb-1">
                4 of 5 school days exceeded the WHO guideline
              </p>
              <p className="text-[13px] text-gray-400">Mon 2 – Fri 6 Mar · Safe limit: 25 μg/m³</p>
            </div>

            {/* Column headers */}
            <div className="flex items-center px-1 mb-2">
              <span className="flex-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Day</span>
              <span className="w-[90px] text-center text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Drop-off</span>
              <span className="w-[90px] text-center text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Pick-up</span>
            </div>

            {/* Rows */}
            {days.map(({ day, date, dropoff, pickup }) => (
              <div key={day} className="flex items-center py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-ink">{day}</span>
                  <span className="text-[11px] text-gray-300">{date}</span>
                </div>
                <div className="w-[90px] flex justify-center">
                  <Reading val={dropoff} />
                </div>
                <div className="w-[90px] flex justify-center">
                  <Reading val={pickup} />
                </div>
              </div>
            ))}

            {/* Colour key */}
            <div className="flex flex-col gap-1.5 mt-5">
              {[
                { color: '#059669', label: 'Within limit (≤25 μg/m³)' },
                { color: '#d4900a', label: 'Approaching (26–30 μg/m³)' },
                { color: '#EF476F', label: 'Exceeded (31–39 μg/m³)' },
                { color: '#B5173A', label: 'Severe (40+ μg/m³)' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
                  <span className="text-[11px] text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-[12px] px-5 py-10 flex flex-col items-center gap-2">
            <span className="text-[14px] font-semibold text-gray-300">Historical trends</span>
            <span className="text-[13px] text-gray-200 text-center leading-relaxed">
              Longer-term trend data coming in a future update.
            </span>
          </div>
        )}
      </div>
    </Layout>
  )
}
