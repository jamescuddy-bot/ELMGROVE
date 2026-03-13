import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine, ReferenceArea, Area, AreaChart,
} from 'recharts'

// ── DATA ──────────────────────────────────────────────────────────────────────

const exceedanceData = [
  {label:'Jun 24', exc:1,   season:'summer'},
  {label:'Jul 24', exc:9,   season:'summer'},
  {label:'Aug 24', exc:27,  season:'summer'},
  {label:'Sep 24', exc:38,  season:'autumn'},
  {label:'Oct 24', exc:97,  season:'autumn'},
  {label:'Nov 24', exc:228, season:'winter'},
  {label:'Dec 24', exc:143, season:'winter'},
  {label:'Jan 25', exc:501, season:'winter'},
  {label:'Feb 25', exc:215, season:'winter'},
  {label:'Mar 25', exc:290, season:'spring'},
  {label:'Apr 25', exc:57,  season:'spring'},
  {label:'May 25', exc:63,  season:'spring'},
  {label:'Jun 25', exc:30,  season:'summer'},
  {label:'Jul 25', exc:21,  season:'summer'},
  {label:'Aug 25', exc:27,  season:'summer'},
  {label:'Sep 25', exc:60,  season:'autumn'},
  {label:'Oct 25', exc:100, season:'autumn'},
  {label:'Nov 25', exc:252, season:'winter'},
  {label:'Dec 25', exc:273, season:'winter'},
  {label:'Jan 26', exc:412, season:'winter'},
  {label:'Feb 26', exc:204, season:'winter'},
  {label:'Mar 26', exc:10,  season:'spring'},
]

const yoyData = [
  {label:'Jun', no2_2024:11.24, no2_2025:14.93, change:+32.8},
  {label:'Jul', no2_2024:12.42, no2_2025:14.18, change:+14.1},
  {label:'Aug', no2_2024:13.17, no2_2025:13.71, change:+4.1},
  {label:'Sep', no2_2024:13.95, no2_2025:16.21, change:+16.2},
  {label:'Oct', no2_2024:17.85, no2_2025:17.49, change:-2.0},
  {label:'Nov', no2_2024:20.35, no2_2025:22.78, change:+11.9},
  {label:'Dec', no2_2024:17.02, no2_2025:24.77, change:+45.5},
]

const hourlyData = [
  {hour:'00:00', all:17.9, winter:20.6, summer:16.1},
  {hour:'01:00', all:15.6, winter:18.2, summer:13.7},
  {hour:'02:00', all:14.3, winter:16.6, summer:12.5},
  {hour:'03:00', all:13.6, winter:16.1, summer:11.9},
  {hour:'04:00', all:13.4, winter:15.9, summer:12.0},
  {hour:'05:00', all:14.0, winter:16.4, summer:12.8},
  {hour:'06:00', all:17.0, winter:21.0, summer:13.9},
  {hour:'07:00', all:19.6, winter:26.2, summer:12.0},
  {hour:'08:00', all:20.6, winter:31.1, summer:7.6},
  {hour:'09:00', all:17.5, winter:30.9, summer:5.3},
  {hour:'10:00', all:14.2, winter:26.7, summer:5.2},
  {hour:'11:00', all:12.6, winter:21.6, summer:6.4},
  {hour:'12:00', all:12.8, winter:19.6, summer:7.4},
  {hour:'13:00', all:15.7, winter:21.9, summer:9.6},
  {hour:'14:00', all:17.5, winter:22.8, summer:11.4},
  {hour:'15:00', all:20.7, winter:25.5, summer:15.9},
  {hour:'16:00', all:23.4, winter:29.1, summer:18.7},
  {hour:'17:00', all:24.5, winter:32.8, summer:17.4},
  {hour:'18:00', all:25.3, winter:33.0, summer:17.7},
  {hour:'19:00', all:25.4, winter:31.1, summer:18.7},
  {hour:'20:00', all:24.6, winter:29.0, summer:19.6},
  {hour:'21:00', all:23.1, winter:26.6, summer:19.8},
  {hour:'22:00', all:21.6, winter:25.2, summer:18.8},
  {hour:'23:00', all:20.0, winter:22.8, summer:17.9},
]

const seasonColor = {summer:'#f6c94e', autumn:'#e09a55', winter:'#6b9fd9', spring:'#6dbf9e'}

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:6, padding:'9px 13px', fontSize:12.5, color:'#1a1a1a', boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
      <div style={{fontWeight:700, color:'#374151', marginBottom:4}}>{label}</div>
      {payload.map((p, i) => p.value != null && (
        <div key={i} style={{display:'flex', gap:6, alignItems:'center'}}>
          <span style={{width:8, height:8, borderRadius:'50%', background:p.color, display:'inline-block'}} />
          <span style={{color:'#6b7280'}}>{p.name}:</span>
          <span style={{fontWeight:600}}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            {(p.name === 'All year' || p.name === 'Winter' || p.name === 'Summer') ? ' μg/m³' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function SectionLabel({ number, text }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:14}}>
      <div style={{
        width:28, height:28, borderRadius:'50%',
        background:'#EF476F', display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:800, color:'#fff', flexShrink:0,
      }}>{number}</div>
      <h2 style={{margin:0, fontSize:20, fontWeight:700, color:'#1a1a1a', letterSpacing:'-0.02em'}}>{text}</h2>
    </div>
  )
}

function Divider() {
  return <div style={{height:1, background:'#f3f4f6', margin:'36px 0'}} />
}

function StatCallout({ value, label, accent }) {
  return (
    <div style={{
      display:'inline-flex', flexDirection:'column', alignItems:'center',
      background:'#fff', border:`1.5px solid ${accent || '#EF476F'}`,
      borderRadius:10, padding:'14px 20px', minWidth:130,
    }}>
      <span style={{fontSize:32, fontWeight:800, color:accent || '#EF476F', lineHeight:1}}>{value}</span>
      <span style={{fontSize:12, color:'#6b7280', marginTop:6, textAlign:'center', maxWidth:160}}>{label}</span>
    </div>
  )
}

function Panel({ children }) {
  return (
    <div style={{background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:10, padding:'20px 18px'}}>
      {children}
    </div>
  )
}

function ChartTitle({ title, sub }) {
  return (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:12, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:2, fontWeight:600}}>{title}</div>
      {sub && <div style={{fontSize:12, color:'#9ca3af'}}>{sub}</div>}
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function No2Trends() {
  const [hourlyView, setHourlyView] = useState('all')

  return (
    <div style={{fontFamily:"'Inclusive Sans', sans-serif", color:'#1a1a1a'}}>

      {/* Intro */}
      <p style={{fontSize:14, lineHeight:1.8, color:'#6b7280', margin:'0 0 28px'}}>
        Analysis of 59,242 sensor readings from June 2024 to March 2026.
        The WHO safe limit for NO₂ is 25 μg/m³ as a 24-hour average.
      </p>

      {/* ── SECTION 1 ── */}
      <SectionLabel number="1" text="How bad is it really?" />

      <p style={{fontSize:14, lineHeight:1.8, color:'#6b7280', margin:'0 0 20px'}}>
        The WHO set its 25 μg/m³ daily limit because prolonged exposure above this level is linked to
        respiratory harm in children — reduced lung development, increased asthma risk, and higher susceptibility
        to infection. At Elm Grove, this is not an occasional breach. It is the winter norm. In January 2026 alone,
        the daily average exceeded the WHO limit on 27 out of 31 days.
      </p>

      <div style={{display:'flex', gap:12, flexWrap:'wrap', marginBottom:8}}>
        <StatCallout value="23/33" label="school days in 2026 above WHO 25 μg/m³ daily limit" accent="#EF476F" />
        <StatCallout value="35/53" label="all days in 2026 with available data above WHO limit" accent="#e09a55" />
        <StatCallout value="19.1" label="μg/m³ annual mean — nearly double the WHO annual guideline of 10" accent="#d4900a" />
      </div>

      <Divider />

      {/* ── SECTION 2 ── */}
      <SectionLabel number="2" text="Are things getting better or worse?" />

      <p style={{fontSize:14, lineHeight:1.8, color:'#6b7280', margin:'0 0 24px'}}>
        Worse. After accounting for seasonal variation, NO₂ is rising at an estimated
        <strong style={{color:'#EF476F'}}> +2.75 μg/m³ per year</strong>. Each successive winter season
        has produced more readings above 40 μg/m³ than the last. The problem is not staying the same — it is compounding.
      </p>

      <Panel>
        <ChartTitle title="Monthly readings exceeding 40 μg/m³" sub="UK limit value threshold · Jun 2024 – Mar 2026" />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={exceedanceData} margin={{top:4, right:8, left:0, bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="label" tick={{fill:'#9ca3af', fontSize:10}} interval={1} />
            <YAxis tick={{fill:'#9ca3af', fontSize:11}}
              label={{value:'Readings', angle:-90, position:'insideLeft', fill:'#9ca3af', fontSize:11}} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="exc" name="Exceedances" radius={[3,3,0,0]}>
              {exceedanceData.map((d, i) => (
                <Cell key={i} fill={seasonColor[d.season]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:'flex', gap:14, marginTop:10, fontSize:11, flexWrap:'wrap'}}>
          {Object.entries(seasonColor).map(([s, c]) => (
            <span key={s} style={{color:c, fontWeight:600}}>■ {s.charAt(0).toUpperCase() + s.slice(1)}</span>
          ))}
        </div>
      </Panel>

      <p style={{fontSize:14, lineHeight:1.8, color:'#6b7280', margin:'24px 0'}}>
        <strong style={{color:'#1a1a1a'}}>Winter peaks are getting longer.</strong> In 2024,
        only November averaged above 20 μg/m³. In 2025, five months crossed that threshold.
        The high-pollution season is spreading into both autumn and spring.
      </p>

      {/* Winter season visual */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:24}}>
        {[
          {year:'2024 (Jun–Dec only)', months:['Nov'], note:'1 month above 20 μg/m³'},
          {year:'2025 (full year)',    months:['Jan','Feb','Mar','Nov','Dec'], note:'5 months above 20 μg/m³'},
        ].map((yr, i) => (
          <Panel key={i}>
            <div style={{fontSize:11, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10, fontWeight:600}}>
              {yr.year}
            </div>
            <div style={{display:'flex', gap:4, flexWrap:'wrap', marginBottom:10}}>
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => {
                const active = yr.months.includes(m)
                const greyedOut = i === 0 && ['Jan','Feb','Mar','Apr','May'].includes(m)
                return (
                  <div key={m} style={{
                    padding:'3px 7px', borderRadius:4, fontSize:11, fontWeight: active ? 700 : 400,
                    background: active ? '#EF476F' : '#f3f4f6',
                    color: active ? '#fff' : '#9ca3af',
                    opacity: greyedOut ? 0.3 : 1,
                  }}>{m}</div>
                )
              })}
            </div>
            <div style={{fontSize:13, color: i === 1 ? '#EF476F' : '#9ca3af', fontWeight: i === 1 ? 600 : 400}}>
              {yr.note}
            </div>
          </Panel>
        ))}
      </div>

      <p style={{fontSize:14, lineHeight:1.8, color:'#6b7280', margin:'0 0 20px'}}>
        <strong style={{color:'#1a1a1a'}}>7 out of 8 comparable months are worse year-on-year.</strong> Only
        October showed any improvement at −2%. The most alarming shift was December, where average concentrations
        rose 45.5%, from 17.0 to 24.8 μg/m³.
      </p>

      <Panel>
        <ChartTitle title="Mean monthly NO₂ — 2024 vs 2025" sub="Jun–Dec (months with data in both years)" />
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={yoyData} margin={{top:4, right:8, left:0, bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="label" tick={{fill:'#9ca3af', fontSize:12}} />
            <YAxis tick={{fill:'#9ca3af', fontSize:11}} domain={[0,32]}
              label={{value:'μg/m³', angle:-90, position:'insideLeft', fill:'#9ca3af', fontSize:11}} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="no2_2024" name="2024" fill="#6dbf9e" fillOpacity={0.8} radius={[3,3,0,0]} />
            <Bar dataKey="no2_2025" name="2025" fill="#EF476F" fillOpacity={0.85} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:'flex', gap:8, marginTop:14, flexWrap:'wrap'}}>
          {yoyData.map((d, i) => (
            <div key={i} style={{
              background: d.change > 0 ? 'rgba(239,71,111,0.08)' : 'rgba(109,191,158,0.1)',
              border: `1px solid ${d.change > 0 ? '#EF476F' : '#6dbf9e'}`,
              borderRadius:5, padding:'4px 10px', fontSize:11,
            }}>
              <span style={{color:'#9ca3af'}}>{d.label} </span>
              <span style={{color: d.change > 0 ? '#EF476F' : '#059669', fontWeight:700}}>
                {d.change > 0 ? '+' : ''}{d.change}%
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <Divider />

      {/* ── SECTION 3 ── */}
      <SectionLabel number="3" text="When's it worst?" />

      <p style={{fontSize:14, lineHeight:1.8, color:'#6b7280', margin:'0 0 24px'}}>
        NO₂ spikes twice a day — and both peaks fall directly on school opening and closing times.
        The morning school run (<strong style={{color:'#d4900a'}}>08:30–09:04</strong>) sits inside the
        daily morning peak. The afternoon pick-up window (<strong style={{color:'#d4900a'}}>15:10–15:45</strong>) lands
        at the start of the day's worst sustained stretch, running through to 19:00.
        In winter, concentrations during these windows regularly exceed 30 μg/m³.
      </p>

      <Panel>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:10}}>
          <ChartTitle title="Average NO₂ by hour of day" sub="Mean across all readings in dataset" />
          <div style={{display:'flex', gap:4}}>
            {[['all','All year'],['winter','Winter'],['summer','Summer']].map(([v,l]) => (
              <button key={v} onClick={() => setHourlyView(v)} style={{
                padding:'5px 12px', borderRadius:5, border:'1px solid #e5e7eb', cursor:'pointer',
                fontSize:11, fontWeight:600,
                background: hourlyView === v ? '#1B9AAA' : '#fff',
                color: hourlyView === v ? '#fff' : '#6b7280',
              }}>{l}</button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={hourlyData} margin={{top:4, right:8, left:0, bottom:0}}>
            <defs>
              <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e09a55" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#e09a55" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="winterGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF476F" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#EF476F" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="summerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6dbf9e" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6dbf9e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="hour" tick={{fill:'#9ca3af', fontSize:10}} interval={2} />
            <YAxis tick={{fill:'#9ca3af', fontSize:11}} domain={[0,38]}
              label={{value:'μg/m³', angle:-90, position:'insideLeft', fill:'#9ca3af', fontSize:11}} />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceArea x1="08:00" x2="09:00" fill="#FFC43D" fillOpacity={0.12}
              label={{value:'Drop-off', position:'insideTopLeft', fill:'#d4900a', fontSize:10}} />
            <ReferenceArea x1="15:00" x2="16:00" fill="#FFC43D" fillOpacity={0.12}
              label={{value:'Pick-up', position:'insideTopLeft', fill:'#d4900a', fontSize:10}} />
            <ReferenceLine y={25} stroke="#d4900a" strokeDasharray="4 2" strokeOpacity={0.7}
              label={{value:'WHO 25', fill:'#d4900a', fontSize:10, position:'right'}} />
            {hourlyView === 'all' && (
              <Area type="monotone" dataKey="all" name="All year" stroke="#e09a55" strokeWidth={2.5}
                fill="url(#hourGrad)" dot={false} />
            )}
            {hourlyView === 'winter' && (
              <Area type="monotone" dataKey="winter" name="Winter" stroke="#EF476F" strokeWidth={2.5}
                fill="url(#winterGrad)" dot={false} />
            )}
            {hourlyView === 'summer' && (
              <Area type="monotone" dataKey="summer" name="Summer" stroke="#6dbf9e" strokeWidth={2.5}
                fill="url(#summerGrad)" dot={false} />
            )}
          </AreaChart>
        </ResponsiveContainer>

        <div style={{display:'flex', gap:16, marginTop:12, fontSize:11, flexWrap:'wrap'}}>
          <span style={{color:'#d4900a', fontWeight:600}}>▓ Drop-off 08:30–09:04 · Pick-up 15:10–15:45</span>
          <span style={{color:'#d4900a'}}>— WHO 25 μg/m³ daily limit</span>
        </div>
      </Panel>

      {/* Footer */}
      <div style={{marginTop:32, paddingTop:16, borderTop:'1px solid #f3f4f6', fontSize:11, color:'#9ca3af', lineHeight:1.8}}>
        <div>Data: EarthSense Zephyr 392 · 15-minute averages · Jun 2024 – 13 Mar 2026 · 59,242 valid observations</div>
        <div>WHO AQG 2021: NO₂ annual mean 10 μg/m³ · 24-hour mean 25 μg/m³ · UK limit value: 40 μg/m³ annual mean</div>
      </div>
    </div>
  )
}
