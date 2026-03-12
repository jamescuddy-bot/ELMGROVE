import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <div className="px-5 pt-6 pb-10 flex flex-col gap-0">
        <h1 className="text-[26px] font-bold text-ink mb-7">About</h1>

        {/* The data */}
        <section className="flex flex-col gap-2.5 mb-6">
          <span className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider">The data</span>
          <p className="text-[15px] text-gray-500 leading-relaxed">
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
          <p className="text-[15px] text-gray-500 leading-relaxed">
            This site was put together by James Cuddy, a parent at Elm Grove Primary. The aim is
            to make the air quality data accessible, reduce children's exposure to harmful NO₂,
            and build the evidence case for physical intervention at the school gate.
          </p>
        </section>

        <div className="h-px bg-gray-100 mb-6" />

        {/* Questions */}
        <section className="flex flex-col gap-2.5 mb-10">
          <span className="text-[13px] font-semibold text-gray-300 uppercase tracking-wider">Questions</span>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            If you have questions about the data, the project, or want to get involved, get in touch.
          </p>
          <a
            href="mailto:placeholder@email.com"
            className="flex items-center gap-2.5 bg-gray-50 rounded-[10px] px-4 py-3.5 no-underline"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="10" rx="2" stroke="#1B9AAA" strokeWidth="1.5" />
              <path d="M1 5l7 5 7-5" stroke="#1B9AAA" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[15px] font-medium text-teal">placeholder@email.com</span>
          </a>
        </section>

        <div className="h-px bg-gray-100 mb-4" />
        <p className="text-[12px] text-gray-300">
          Data from EarthSense Zephyr Device 392 · Elm Grove Primary, Brighton
        </p>
      </div>
    </Layout>
  )
}
