import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

const EMAIL_SUBJECT = 'Air quality outside Elm Grove Primary School — request for action'
const EMAIL_BODY = `Dear Tim,

I'm a parent at Elm Grove Primary and I'm writing to ask for your support on air quality outside the school.

EarthSense Zephyr data shows NO₂ during drop-off averaging 36.8 µg/m³ — above the 36 µg/m³ threshold your council's own Annual Status Report identifies as the level needed to be confident the legal limit is being met. This is a road problem, not a school gate problem. Elm Grove carries through-traffic, and the pedestrian crossing creates a daily queue while children arrive.

I'd ask the council to consider two actions: kerbside planters to separate the pavement from moving traffic, and extending the Air Quality Management Area to include Elm Grove, which would place a legal obligation on the council to act.

The data comes from sensors already operated by Brighton & Hove Council. I'd welcome the chance to discuss it.

Thank you for your time.

[Your name]`

const HEADER_CHIPS = ['What', 'is', 'NO₂', 'and', 'what', 'you', 'can', 'do']

export default function No2() {
  const [emailText, setEmailText] = useState(EMAIL_BODY)
  const [chipIndex, setChipIndex] = useState(-1)

  useEffect(() => {
    if (chipIndex < HEADER_CHIPS.length - 1) {
      const t = setTimeout(() => setChipIndex(i => i + 1), 60)
      return () => clearTimeout(t)
    }
  }, [chipIndex])
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    const full = `To: Tim.Rowkins@brighton-hove.gov.uk\nSubject: ${EMAIL_SUBJECT}\n\n${emailText}`
    navigator.clipboard.writeText(full).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <Layout bgColor="#FDD0CF">
      <div className="flex flex-col flex-1 bg-[#FDD0CF]">
        <div className="w-full max-w-[1168px] mx-auto px-5 desktop:px-20 pt-10 pb-8 desktop:pt-20 desktop:pb-20 flex flex-col gap-4 desktop:gap-8">
          <div className="flex flex-wrap gap-2">
            {HEADER_CHIPS.map((word, i) => (
              <span key={word} className="inline-block bg-[#EA3457] rounded-[7px] py-[3px] px-[9px] text-[26px] desktop:text-[52px] font-semibold text-white leading-[1.25]" style={{opacity: i <= chipIndex ? 1 : 0, transform: i <= chipIndex ? 'scale(1)' : 'scale(0.88)', transition: 'opacity 100ms ease, transform 100ms ease'}}>
                {word === 'NO₂' ? <>NO<span style={{fontSize:'0.6em',position:'relative',top:'0.1em'}}>2</span></> : word}
              </span>
            ))}
          </div>
          <p className="text-[20px] desktop:text-[28px] font-semibold text-[#EA3457] leading-[1.2] m-0">Although it's invisible, its impact is real.</p>
        </div>

        <div className="flex flex-col gap-12 bg-white rounded-t-[40px] w-full max-w-[1168px] mx-auto px-5 desktop:px-16 pt-8 pb-10">

        {/* Section 1 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[24px] font-semibold text-[#333333] pt-5">What are the impacts of NO₂?</h2>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Nitrogen dioxide (NO₂) is a gas produced when fuel is burned, primarily by vehicle
            engines. At school gates, the main source is cars and vans idling at the kerb during
            drop-off and pick-up.
          </p>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Even at low levels, NO₂ irritates the airways. For children, whose lungs are still
            developing, regular exposure can affect long-term lung health and worsen conditions
            like asthma.
          </p>

          <div className="flex flex-col desktop:flex-row gap-3 mt-8">
            {[
              {
                title: 'Lungs don\'t recover',
                body: 'NO₂ causes permanent deficits in lung development in children aged 10–18 that carry into adulthood.',
                source: 'NEJM, Children\'s Health Study',
                href: 'https://www.nejm.org/doi/full/10.1056/NEJMoa040610',
              },
              {
                title: 'Damages Growing Lungs',
                body: 'Exposure during childhood is linked to reduced lung development and a higher risk of asthma in children who live near busy roads. The damage can be gradual and may not become fully apparent for years.',
                source: 'Public Health England',
                href: 'https://www.gov.uk/government/publications/health-matters-air-pollution/health-matters-air-pollution',
              },
              {
                title: 'Children get a bigger dose',
                body: 'Children breathe faster, are more active, and are shorter, meaning they inhale more traffic exhaust, at higher concentrations, than adults standing next to them.',
                source: 'European Environment Agency',
                href: 'https://www.eea.europa.eu/publications/air-pollution-and-childrens-health',
              },
            ].map(({ title, body, source, href }) => (
              <div key={title} className="bg-gray-50 rounded-[8px] p-4 flex flex-col gap-1.5 desktop:flex-1">
                <span className="text-[20px] font-semibold text-ink">{title}</span>
                <p className="text-[14px] text-[#333333] leading-[1.5] m-0 max-w-none">{body}</p>
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[12px] text-teal no-underline font-medium">
                  {source} →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[24px] font-semibold text-[#333333]">A shared problem</h2>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            The school sits on one of Brighton's main routes in and out of the city. Traffic queues at the pedestrian crossing every morning while children arrive. The pollution is a product of the road. That requires a council solution, not an individual one.
          </p>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Kerbside planters create physical separation between the pavement and moving traffic, reducing both exposure and the opportunity to idle at the kerb. They've worked at other schools - but this needs the council to act.
          </p>
        </section>

        {/* Section 3 */}
        <section className="flex flex-col gap-3">
          <h2 className="text-[24px] font-semibold text-[#333333]">What can you do?</h2>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Four months of NO₂ readings show levels exceeding WHO guidelines on nearly three in four school mornings. That's not an edge case it's the norm.
          </p>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Kerbside planters create physical separation between the pavement and moving traffic, reducing both exposure and the opportunity to idle at the kerb. They've worked at other schools. They need the council to act.
          </p>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            A longer-term option is extending Brighton &amp; Hove's Air Quality Management Area to include Elm Grove. An AQMA is a legally declared zone where pollution exceeds, or is likely to exceed, national limits. Once declared, the council has a legal obligation to publish an action plan and work toward improvement. Currently the AQMA covers Lewes Road at the bottom of the hill, not the school. Our data suggests the school itself warrants the same level of attention.
          </p>
          <p className="text-[15px] text-[#333333] leading-[1.5]">
            Both require council action. The evidence to support it is already here.
          </p>

          <p className="text-[12px] text-gray-400 flex items-center gap-1.5 mt-8">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2l1.5 1.5L3 10H1.5V8.5L8 2z" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Tap the letter to personalise it before copying
          </p>

          {/* Email tool */}
          <div className="flex flex-col rounded-[10px] overflow-hidden border border-gray-100">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">To</span>
              <span className="text-[13px] text-[#333333]">Tim.Rowkins@brighton-hove.gov.uk</span>
            </div>
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
            className="flex items-center justify-center gap-2.5 bg-teal text-white text-[16px] font-bold py-4 rounded-full border-none cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="9" height="9" rx="2" stroke="white" strokeWidth="1.5" />
              <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>

          <div className="h-[100px]" />
        </section>
        </div>
      </div>
    </Layout>
  )
}
