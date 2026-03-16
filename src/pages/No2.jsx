import { useState } from 'react'
import Layout from '../components/Layout'

const EMAIL_SUBJECT = 'Air quality outside Elm Grove Primary School — request for action'
const EMAIL_BODY = `Dear [Councillor name],

I'm a parent at Elm Grove Primary School in Brighton. I'm writing to ask for your support in addressing dangerous levels of nitrogen dioxide (NO₂) outside the school gate during drop-off and pick-up times.

Data from the EarthSense Zephyr air quality sensor at Elm Grove shows that NO₂ levels regularly exceed the WHO 24-hour guideline of 25 μg/m³ during school run periods. On some mornings, levels are more than double this limit. The primary cause is vehicles idling on the kerb outside the school.

I'm asking the council to consider installing physical planters or barriers along the kerb outside Elm Grove Primary to prevent engine idling and pavement parking. This is a low-cost, proven intervention that other councils have used to protect children at school gates.

The data underpinning this is collected by EarthSense Zephyr sensors already operated by Brighton & Hove Council. I'd welcome the chance to discuss what it shows and what action might be possible.

Thank you for your time.

[Your name]`

export default function No2() {
  const [emailText, setEmailText] = useState(EMAIL_BODY)
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const full = `Subject: ${EMAIL_SUBJECT}\n\n${emailText}`
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <Layout>
      <div className="flex flex-col flex-1 bg-[#F1E5E5]">
        <div className="px-5 pt-10 pb-8">
          <h1 className="text-[26px] font-bold text-ink leading-snug">
            What is NO₂ and what you can do
          </h1>
        </div>

        <div className="flex flex-col gap-8 px-5 pt-8 pb-10 bg-white rounded-t-[40px]">

        {/* Section 1 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 bg-[#EF476F] rounded-sm flex-shrink-0" />
            <h2 className="text-[18px] font-bold text-ink">What are the impacts of NO₂?</h2>
          </div>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Nitrogen dioxide (NO₂) is a gas produced when fuel is burned — primarily by vehicle
            engines. At school gates, the main source is cars and vans idling at the kerb during
            drop-off and pick-up.
          </p>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Even at low levels, NO₂ irritates the airways. For children, whose lungs are still
            developing, regular exposure can affect long-term lung health and worsen conditions
            like asthma.
          </p>

          <div className="flex flex-col gap-3 mt-1">
            {[
              {
                title: 'Lungs don\'t recover',
                body: 'NO₂ causes permanent deficits in lung development in children aged 10–18 that carry into adulthood.',
                source: 'NEJM, Children\'s Health Study',
                href: 'https://www.nejm.org/doi/full/10.1056/NEJMoa040610',
              },
              {
                title: 'It likely causes asthma',
                body: 'Scientific evidence suggests NO₂ exposure doesn\'t just worsen asthma in children — it can cause it.',
                source: 'American Lung Association, 2022',
                href: 'https://www.lung.org/clean-air/outdoors/what-makes-air-unhealthy/nitrogen-dioxide',
              },
              {
                title: 'Children get a bigger dose',
                body: 'Children breathe faster, are more active, and are shorter — meaning they inhale more traffic exhaust, at higher concentrations, than adults standing next to them.',
                source: 'European Environment Agency',
                href: 'https://www.eea.europa.eu/publications/air-pollution-and-childrens-health',
              },
            ].map(({ title, body, source, href }) => (
              <div key={title} className="bg-gray-50 rounded-[10px] px-4 py-4 flex flex-col gap-1.5">
                <span className="text-[14px] font-bold text-ink">{title}</span>
                <p className="text-[14px] text-[#333333] leading-[1.5] m-0">{body}</p>
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[12px] text-teal no-underline font-medium">
                  {source} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 bg-[#FFC43D] rounded-sm flex-shrink-0" />
            <h2 className="text-[18px] font-bold text-ink">A shared problem</h2>
          </div>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Driving to school isn't anything unusual. The problem is that there's nowhere safe
            to stop, so engines idle on the kerb. The effective solutions like kerbside planters
            require council action. It's worked at other schools, it can work here too.
          </p>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 bg-teal rounded-sm flex-shrink-0" />
            <h2 className="text-[18px] font-bold text-ink">What can you do?</h2>
          </div>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Write to your local councillor asking them to fund kerb-side planters or barriers
            outside Elm Grove Primary. We've drafted a letter — edit it to make it your own,
            then copy and send.
          </p>

          {/* Email tool */}
          <div className="flex flex-col rounded-[10px] overflow-hidden border border-gray-100">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Subject</span>
              <span className="text-[13px] text-[#333333]">{EMAIL_SUBJECT}</span>
            </div>
            <textarea
              value={emailText}
              onChange={e => setEmailText(e.target.value)}
              rows={16}
              className="bg-gray-50 px-4 py-4 text-[13px] text-[#333333] leading-[1.5] resize-none border-none outline-none font-sans"
            />
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2.5 bg-teal text-white text-[16px] font-bold py-4 rounded-[10px] border-none cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="9" height="9" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>

          <p className="text-[12px] text-gray-300 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2l1.5 1.5L3 10H1.5V8.5L8 2z" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tap the letter to personalise it before copying
          </p>
        </section>
        </div>
      </div>
    </Layout>
  )
}
