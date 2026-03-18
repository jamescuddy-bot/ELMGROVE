import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import illoData from '../assets/illo-data.svg'
import illoAlerts from '../assets/illo-alerts.svg'
import illoNo2 from '../assets/illo-no2.svg'

const CHIP_INTERVAL = 60
const HOLD_DURATION = 2500

const WHO_LIMIT = 25

function buildStatements(data) {
  const { label, dropoffAvg, pickupAvg, daysExceeded, totalDays, dropoffPctOver, pickupPctOver } = data
  const statements = []

  if (dropoffPctOver > 0) {
    statements.push({
      label: `Drop-off · ${label}`,
      segments: [
        { text: 'Last week during drop-off, NO₂ levels reached', highlight: false },
        { text: `${dropoffPctOver}% over`, highlight: true },
        { text: 'the safe threshold.', highlight: false },
      ],
      stat: `${dropoffAvg} μg/m³`,
      sub: `WHO safe limit: ${WHO_LIMIT} μg/m³`,
    })
  }

  if (daysExceeded > 0) {
    statements.push({
      label: `School mornings · ${label}`,
      segments: [
        { text: 'Last week NO₂ exceeded safe limits', highlight: false },
        { text: `${daysExceeded} out of ${totalDays}`, highlight: true },
        { text: 'days.', highlight: false },
      ],
      stat: `${daysExceeded} of ${totalDays} days`,
      sub: `WHO safe limit: ${WHO_LIMIT} μg/m³`,
    })
  }

  if (pickupPctOver > 0) {
    statements.push({
      label: `Pick-up · ${label}`,
      segments: [
        { text: 'Last week during pick-up, NO₂ levels reached', highlight: false },
        { text: `${pickupPctOver}% over`, highlight: true },
        { text: 'the safe threshold.', highlight: false },
      ],
      stat: `${pickupAvg} μg/m³`,
      sub: `WHO safe limit: ${WHO_LIMIT} μg/m³`,
    })
  }

  return statements
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
  const [hoveredChip, setHoveredChip] = useState(null)

  useEffect(() => {
    fetch('/.netlify/functions/latest-stats')
      .then(r => r.json())
      .then(data => {
        if (data.dropoffAvg !== null || data.pickupAvg !== null) {
          const built = buildStatements(data)
          if (built.length > 0) setStatements(built)
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
      <div className="flex flex-col flex-1 bg-[#F1E5E5]">
        <div className="w-full max-w-[1168px] mx-auto flex-1 flex flex-col px-5 desktop:px-16 pt-10 pb-2 min-h-[calc((100vh-72px)*0.8)] max-h-[60vh] desktop:justify-center">
          <span className="text-[12px] font-semibold tracking-widest uppercase mb-5" style={{color:'#5A5A5A'}}>
            {s.label}
          </span>

          <Link to="/data" className="word-chip-wrap flex flex-wrap gap-[5px] mb-8 no-underline">
            {chips.map((chip, i) => (
              <span
                key={`${stmtIndex}-${i}`}
                className={`word-chip text-ink desktop:cursor-pointer ${chip.highlight ? 'bg-[#FF9C9C]' : 'bg-[#E8D1D1]'}`}
                onMouseEnter={() => setHoveredChip(i)}
                onMouseLeave={() => setHoveredChip(null)}
                style={{
                  opacity: isVisible(i) ? 1 : 0,
                  transform: `${isVisible(i) ? 'scale(1)' : 'scale(0.88)'} ${hoveredChip === i ? 'rotate(-10deg)' : 'rotate(0deg)'}`,
                  background: hoveredChip === i ? '#DAC0C1' : (chip.highlight ? '#FF9C9C' : '#E8D1D1'),
                  transition: 'opacity 100ms ease, transform 200ms ease, background-color 150ms ease',
                  display: 'inline-block',
                }}
              >
                {chip.text === 'NO₂' ? <>NO<span style={{fontSize:'0.6em',position:'relative',top:'0.1em'}}>2</span></> : chip.text}
              </span>
            ))}
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-[3px] h-8 bg-[#EF476F] rounded-sm flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[22px] font-bold text-[#EF476F] leading-none tracking-tight">
                {s.stat}
              </span>
              <span className="text-[12px] text-gray-400">{s.sub}</span>
            </div>
          </div>

          <Link to="/data" className="group text-[14px] font-medium text-teal no-underline inline-flex items-center gap-1">
            See the historical data
            <span className="inline-block transition-transform desktop:group-hover:translate-x-1">→</span>
          </Link>
        </div>


        <div className="bg-white rounded-[40px] max-w-[1168px] mx-5 tablet:mx-auto flex flex-col desktop:flex-row gap-6 desktop:gap-10 p-5 desktop:px-16 desktop:pt-16 desktop:pb-16 mb-[100px]">
          <Link to="/data" className="group no-underline block p-7 rounded-tl-3xl rounded-tr-[32px] rounded-bl-[30px] rounded-br-[32px] flex-1 bg-[#FFE9D2] hover:bg-[#FFEBA9] transition-colors min-h-[360px] flex flex-col relative overflow-hidden">
            <h2 className="text-[28px] font-semibold text-[#EC4612] leading-tight mb-2">Data and trends</h2>
            <p className="text-[20px] font-medium text-[#EC4612] opacity-80 leading-[1.3]">What NO₂ levels look like at the school gate</p>
            <img src={illoData} alt="" className="absolute bottom-[calc(28px+24px)] -right-[10px] w-4/5 object-contain object-bottom" />
            <div className="mt-auto relative z-10 rounded-full bg-[#EC4612] group-hover:bg-[#D43F10] transition-colors text-white text-[15px] font-bold text-center py-3.5">See data and trends</div>
          </Link>

          <Link to="/alerts" className="group no-underline block p-7 rounded-tl-3xl rounded-tr-[32px] rounded-bl-[30px] rounded-br-[32px] flex-1 bg-[#8BF0F8]/35 hover:bg-[#CEDEFA] transition-colors min-h-[360px] flex flex-col relative overflow-hidden">
            <h2 className="text-[28px] font-semibold text-[#1F8A92] leading-tight mb-2">NO₂ alerts</h2>
            <p className="text-[20px] font-medium text-[#1F8A92] opacity-80 leading-[1.3]">Set an alert for when levels are forecast to be very high at drop off.</p>
            <img src={illoAlerts} alt="" className="absolute bottom-[calc(28px+24px)] -right-[10px] w-4/5 object-contain object-bottom" />
            <div className="mt-auto relative z-10 rounded-full bg-[#1F8A92] group-hover:bg-[#1C7C83] transition-colors text-white text-[15px] font-bold text-center py-3.5">Get an early alert</div>
          </Link>

          <Link to="/no2" className="group no-underline block p-7 rounded-tl-3xl rounded-tr-[32px] rounded-bl-[30px] rounded-br-[32px] flex-1 bg-[#FDD0CF] hover:bg-[#FBB6AC] transition-colors min-h-[360px] flex flex-col relative overflow-hidden">
            <h2 className="text-[28px] font-semibold text-[#EA3457] leading-tight mb-2">What is NO₂?</h2>
            <p className="text-[20px] font-medium text-[#EA3457] opacity-80 leading-[1.3]">What is it and what we can do about it.</p>
            <img src={illoNo2} alt="" className="absolute bottom-[91px] -right-[10px] w-1/2 object-contain object-bottom" />
            <div className="mt-auto relative z-10 rounded-full bg-[#EA3457] group-hover:bg-[#D32F4E] transition-colors text-white text-[15px] font-bold text-center py-3.5">Find out more</div>
          </Link>
        </div>

      </div>
    </Layout>
  )
}
