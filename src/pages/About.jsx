import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const HEADER_CHIPS = ['About']

export default function About() {
  const [chipIndex, setChipIndex] = useState(-1)

  useEffect(() => {
    if (chipIndex < HEADER_CHIPS.length - 1) {
      const t = setTimeout(() => setChipIndex(i => i + 1), 60)
      return () => clearTimeout(t)
    }
  }, [chipIndex])

  return (
    <Layout>
      <div className="flex flex-col flex-1 bg-[#F1E5E5]">
        <div className="w-full max-w-[1168px] mx-auto px-5 desktop:px-20 pt-10 pb-8 desktop:pt-20 desktop:pb-20 flex flex-col gap-4 desktop:gap-8">
          <div className="flex flex-wrap gap-2">
            {HEADER_CHIPS.map((word, i) => (
              <span key={word} className="inline-block bg-[#E8D1D1] rounded-[7px] py-[3px] px-[9px] text-[26px] desktop:text-[52px] font-semibold text-ink leading-[1.25]" style={{opacity: i <= chipIndex ? 1 : 0, transform: i <= chipIndex ? 'scale(1)' : 'scale(0.88)', transition: 'opacity 100ms ease, transform 100ms ease'}}>
                {word}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white rounded-t-[40px] w-full max-w-[1168px] mx-auto px-5 desktop:px-16 pt-8 pb-10">

        {/* The data */}
        <section className="flex flex-col gap-2.5 mb-6">
          <span className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider">The data</span>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            NO₂ readings are collected by an EarthSense Zephyr sensor (Device 392) located at
            Elm Grove Primary School, Brighton. The sensor is operated by Brighton &amp; Hove
            Council as part of their air quality monitoring network.
          </p>
          <a
            href="https://www.earthsense.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] font-medium text-teal no-underline"
          >
            View sensor data on the EarthSense platform →
          </a>
        </section>

        <div className="h-px bg-gray-100 mb-6" />

        {/* Who made this */}
        <section className="flex flex-col gap-2.5 mb-6">
          <span className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider">Who made this</span>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            This site was put together by James Cuddy, a parent at Elm Grove Primary. The aim is
            to make the air quality data accessible, reduce children's exposure to harmful NO₂,
            and build the evidence case for physical intervention at the school gate.
          </p>
        </section>

        <div className="h-px bg-gray-100 mb-6" />

        {/* Questions */}
        <section className="flex flex-col gap-2.5 mb-10">
          <span className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider">Questions</span>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            If you have questions about the data, the project, or want to get involved, get in touch.
          </p>
          <a
            href="mailto:jamescuddy@gmail.com"
            className="flex items-center gap-2.5 bg-gray-50 rounded-[10px] px-4 py-3.5 no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="#1B9AAA" strokeWidth="1.5" />
              <path d="M1 5l7 5 7-5" stroke="#1B9AAA" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[15px] font-medium text-teal">jamescuddy@gmail.com</span>
          </a>
        </section>

        <div className="h-px bg-gray-100 mb-4" />
        <p className="text-[12px] text-gray-300">
          Data from EarthSense Zephyr Device 392 · Elm Grove Primary, Brighton
        </p>
        </div>
      </div>
    </Layout>
  )
}
