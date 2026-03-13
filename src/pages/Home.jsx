import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const CHIP_INTERVAL = 60
const HOLD_DURATION = 2500

const WHO_LIMIT = 25

function buildStatements(data) {
  const { label, dropoffAvg, pickupAvg, daysExceeded, totalDays, dropoffPctOver, pickupPctOver } = data
  return [
    {
      label: `Drop-off · ${label}`,
      segments: [
        { text: 'Last week during drop-off, NO₂ levels reached', highlight: false },
        { text: `${dropoffPctOver}% over`, highlight: true },
        { text: 'the safe threshold.', highlight: false },
      ],
      stat: `${dropoffAvg} μg/m³`,
      sub: `WHO safe limit: ${WHO_LIMIT} μg/m³`,
    },
    {
      label: `School mornings · ${label}`,
      segments: [
        { text: 'Last week NO₂ exceeded safe limits', highlight: false },
        { text: `${daysExceeded} out of ${totalDays}`, highlight: true },
        { text: 'days.', highlight: false },
      ],
      stat: `${daysExceeded} of ${totalDays} days`,
      sub: `WHO safe limit: ${WHO_LIMIT} μg/m³`,
    },
    {
      label: `Pick-up · ${label}`,
      segments: [
        { text: 'Last week during pick-up, NO₂ levels reached', highlight: false },
        { text: `${pickupPctOver}% over`, highlight: true },
        { text: 'the safe threshold.', highlight: false },
      ],
      stat: `${pickupAvg} μg/m³`,
      sub: `WHO safe limit: ${WHO_LIMIT} μg/m³`,
    },
  ]
}

const FALLBACK_STATEMENTS = buildStatements({
  label: 'Mon 2 – Fri 6 Mar',
  dropoffAvg: 34,
  pickupAvg: 31,
  daysExceeded: 4,
  totalDays: 5,
  dropoffPctOver: 36,
  pickupPctOver: 24,
})

function getChips(segments) {
  const chips = []
  for (const seg of segments) {
    if (seg.highlight) {
      chips.push({ text: seg.text, highlight: true })
    } else {
      for (const word of seg.text.split(' ').filter(Boolean)) {
        chips.push({ text: word, highlight: false })
      }
    }
  }
  return chips
}

export default function Home() {
  const [statements, setStatements] = useState(FALLBACK_STATEMENTS)
  const [stmtIndex, setStmtIndex] = useState(0)
  const [phase, setPhase] = useState('entering')
  const [animIndex, setAnimIndex] = useState(-1)

  useEffect(() => {
    fetch('/.netlify/functions/latest-stats')
      .then(r => r.json())
      .then(data => {
        if (data.dropoffPctOver !== null && data.pickupPctOver !== null) {
          setStatements(buildStatements(data))
        }
      })
      .catch(() => {})
  }, [])

  const s = statements[stmtIndex]
  const chips = getChips(s.segments)

  useEffect(() => {
    let timer
    const total = chips.length

    if (phase === 'entering') {
      if (animIndex < total - 1) {
        timer = setTimeout(() => setAnimIndex(i => i + 1), CHIP_INTERVAL)
      } else {
        timer = setTimeout(() => setPhase('holding'), CHIP_INTERVAL)
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => {
        setPhase('exiting')
        setAnimIndex(0)
      }, HOLD_DURATION)
    } else if (phase === 'exiting') {
      if (animIndex < total - 1) {
        timer = setTimeout(() => setAnimIndex(i => i + 1), CHIP_INTERVAL)
      } else {
        timer = setTimeout(() => {
          setStmtIndex(i => (i + 1) % statements.length)
          setPhase('entering')
          setAnimIndex(-1)
        }, CHIP_INTERVAL)
      }
    }

    return () => clearTimeout(timer)
  }, [phase, animIndex, stmtIndex])

  function isVisible(chipIdx) {
    if (phase === 'entering') return chipIdx <= animIndex
    if (phase === 'holding') return true
    if (phase === 'exiting') return chipIdx > animIndex
    return false
  }

  function jumpTo(i) {
    setStmtIndex(i)
    setPhase('entering')
    setAnimIndex(-1)
  }

  return (
    <Layout>
      <div className="flex flex-col flex-1 px-5 pt-10 pb-8 bg-[#F1E5E5]">
        <div className="flex-1 flex flex-col">
          <span className="text-[12px] font-semibold tracking-widest uppercase mb-5" style={{color:'#5A5A5A'}}>
            {s.label}
          </span>

          <div className="word-chip-wrap flex flex-wrap gap-[5px] mb-8">
            {chips.map((chip, i) => (
              <span
                key={`${stmtIndex}-${i}`}
                className="word-chip text-ink"
                style={{
                  opacity: isVisible(i) ? 1 : 0,
                  transform: isVisible(i) ? 'scale(1)' : 'scale(0.88)',
                  transition: 'opacity 100ms ease, transform 100ms ease',
                  display: 'inline-block',
                  background: chip.highlight ? '#FF9C9C' : '#E8D1D1',
                }}
              >
                {chip.text}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-[3px] h-8 bg-[#EF476F] rounded-sm flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[22px] font-bold text-[#EF476F] leading-none tracking-tight">
                {s.stat}
              </span>
              <span className="text-[12px] text-gray-400">{s.sub}</span>
            </div>
          </div>

          <Link to="/data" className="text-[14px] font-medium text-teal no-underline">
            See the historical data →
          </Link>
        </div>

        <div className="flex justify-center gap-1.5 my-8">
          {statements.map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              className={`h-[5px] rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
                i === stmtIndex ? 'w-5 bg-ink' : 'w-[5px] bg-gray-200'
              }`}
              aria-label={`Statement ${i + 1}`}
            />
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-5 pb-6 pt-8 bg-gradient-to-t from-[#F1E5E5] via-[#F1E5E5] to-transparent flex justify-center">
          <Link
            to="/alerts"
            className="block bg-teal text-white text-[16px] font-bold text-center py-4 rounded-[10px] no-underline w-full max-w-[425px]"
          >
            Get early air quality alerts
          </Link>
        </div>
      </div>
    </Layout>
  )
}
