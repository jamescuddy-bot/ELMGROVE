import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

const statements = [
  {
    label: 'Drop-off · Mon 2 – Fri 6 Mar',
    text: 'Last week during drop-off, NO₂ levels reached 36% over the safe threshold.',
    stat: '34 μg/m³',
    sub: 'WHO safe limit: 25 μg/m³',
  },
  {
    label: 'School mornings · Mon 2 – Fri 6 Mar',
    text: 'Last week during school mornings, NO₂ levels exceeded the safe threshold on 4 out of 5 days.',
    stat: '4 of 5 days',
    sub: 'WHO safe limit: 25 μg/m³',
  },
  {
    label: 'Pick-up · Mon 2 – Fri 6 Mar',
    text: 'Last week during pick-up, NO₂ levels reached 24% over the safe threshold.',
    stat: '31 μg/m³',
    sub: 'WHO safe limit: 25 μg/m³',
  },
]

export default function Home() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % statements.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const s = statements[index]

  return (
    <Layout>
      <div className="flex flex-col flex-1 px-5 pt-10 pb-8">
        <div className="flex-1 flex flex-col">
          <span className="text-[12px] font-medium text-gray-300 tracking-widest uppercase mb-5">
            {s.label}
          </span>

          <p className="text-[32px] font-bold text-ink leading-[1.2] mb-8">
            {s.text}
          </p>

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
              onClick={() => setIndex(i)}
              className={`h-[5px] rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
                i === index ? 'w-5 bg-ink' : 'w-[5px] bg-gray-200'
              }`}
              aria-label={`Statement ${i + 1}`}
            />
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <Link
            to="/alerts"
            className="block bg-teal text-white text-[16px] font-bold text-center py-4 rounded-[10px] no-underline"
          >
            Sign up for early NO₂ alerts
          </Link>
        </div>
      </div>
    </Layout>
  )
}
