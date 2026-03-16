import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import No2Trends from '../components/No2Trends'

function severity(val) {
  if (val === null) return { bg: 'bg-gray-100', text: 'text-gray-300' }
  if (val <= 25) return { bg: 'bg-[#F0FDF8]', text: 'text-[#059669]' }
  if (val <= 30) return { bg: 'bg-[#FFF8E6]', text: 'text-[#d4900a]' }
  if (val <= 39) return { bg: 'bg-[#fff0f3]', text: 'text-[#EF476F]' }
  return { bg: 'bg-[#B5173A]', text: 'text-white' }
}

function Reading({ val }) {
  const { bg, text } = severity(val)
  return (
    <div className={`${bg} rounded-lg px-3 py-2 flex flex-col items-center gap-0.5 w-[90px]`}>
      <span className={`text-[16px] font-bold leading-none ${text}`}>
        {val !== null ? val : '—'}
      </span>
      <span className={`text-[10px] ${text} opacity-80`}>μg/m³</span>
    </div>
  )
}

export default function HistoricalData() {
  const [tab, setTab] = useState('week')
  const [weeks, setWeeks] = useState([])
  const [weekIndex, setWeekIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/.netlify/functions/readings')
      .then(r => r.json())
      .then(data => {
        setWeeks(data.weeks || [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  const week = weeks[weekIndex]

  return (
    <Layout bgColor="#F1DBC4">
      <div className="flex flex-col flex-1 bg-[#F1DBC4]">
        <div className="px-5 pt-10 pb-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {['Data', 'and', 'trends'].map(word => (
              <span key={word} className="inline-block bg-[#EC4612] rounded-[7px] py-[3px] px-[9px] text-[26px] font-semibold text-white leading-[1.25]">
                {word}
              </span>
            ))}
          </div>
          <p className="text-[20px] font-semibold text-[#EC4612] leading-[1.2] m-0">
            Analysis of data from Brighton &amp; Hove's Air Quality Portal gives a detailed picture of what NO₂ levels look like at the school gate.
          </p>
        </div>

        <div className="flex flex-col flex-1 px-5 pt-8 pb-10 bg-white rounded-t-[40px]">

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 gap-1 mb-5">
          {[['week', 'Week by week'], ['trends', 'Historical trends']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              className={`flex-1 py-2.5 rounded-full text-[14px] border-none cursor-pointer transition-all ${
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
            {loading ? (
              <p className="text-[14px] text-gray-300 py-10 text-center">Loading…</p>
            ) : error || weeks.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-[12px] px-5 py-10 flex flex-col items-center gap-2">
                <span className="text-[14px] font-semibold text-gray-300">No data available</span>
                <span className="text-[13px] text-gray-200 text-center leading-[1.5]">
                  Upload a CSV from the admin dashboard to populate this page.
                </span>
              </div>
            ) : (
              <>
                {/* Week navigator */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setWeekIndex(i => i + 1)}
                    disabled={weekIndex >= weeks.length - 1}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-default p-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Previous
                  </button>
                  <span className="text-[13px] font-semibold text-ink">{week.label}</span>
                  <button
                    onClick={() => setWeekIndex(i => i - 1)}
                    disabled={weekIndex === 0}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-default p-0"
                  >
                    Next
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Summary */}
                {week.summary && (() => {
                  const isGood = week.summary.startsWith('0 of')
                  return (
                    <div className={`border-l-4 rounded-r-[10px] px-4 py-4 mb-5 ${isGood ? 'border-[#059669] bg-[#F0FDF8]' : 'border-[#EF476F] bg-[#fff5f7]'}`}>
                      <p className="text-[18px] font-bold text-ink leading-snug mb-1">
                        {week.summary}
                      </p>
                      <p className="text-[13px] text-gray-400">{week.label} · Safe limit: 25 μg/m³</p>
                    </div>
                  )
                })()}

                {/* Column headers */}
                <div className="flex items-center px-1 mb-2">
                  <span className="flex-1 text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Day</span>
                  <span className="w-[90px] text-center text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Drop-off</span>
                  <span className="w-2 flex-shrink-0" />
                  <span className="w-[90px] text-center text-[11px] font-semibold text-gray-300 uppercase tracking-wider">Pick-up</span>
                </div>

                {/* Rows */}
                {week.days.map(({ day, date, dropoff, pickup }) => (
                  <div key={day} className="flex items-center py-3 border-b border-gray-50 last:border-0">
                    <div className="flex-1 flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-ink">{day}</span>
                      <span className="text-[11px] text-gray-300">{date}</span>
                    </div>
                    <div className="w-[90px] flex justify-center">
                      <Reading val={dropoff} />
                    </div>
                    <div className="w-2 flex-shrink-0" />
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
            )}
          </>
        ) : (
          <No2Trends />
        )}
        </div>
      </div>
    </Layout>
  )
}
