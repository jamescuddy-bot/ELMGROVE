import { useState, useEffect } from 'react'
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
          <span style={{color:'#333333'}}>{p.name}:</span>
          <span style={{fontWeight:600}}>
            {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            {(p.name === 'All year' || p.name === 'Winter' || p.name === 'Summer') ? ' μg/m³' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function SectionLabel({ text }) {
  return (
    <div style={{marginBottom:14}}>
      <h2 style={{margin:0, fontSize:24, fontWeight:600, color:'#333333'}}>{text}</h2>
    </div>
  )
}

function Divider() {
  return <div style={{height:1, background:'#f3f4f6', margin:'36px 0'}} />
}

function StatCallout({ value, label, accent }) {
  return (
    <div style={{display:'flex', flexDirection:'column', gap:10, marginBottom:8}}>
      <span style={{
        display:'inline-block', alignSelf:'flex-start',
        background: accent || '#EF476F', color:'#fff',
        fontSize:28, fontWeight:800, lineHeight:1,
        borderRadius:10, padding:'10px 16px',
      }}>{value}</span>
      <span style={{fontSize:15, color:'#333333', lineHeight:1.5}}>{label}</span>
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
      <div style={{fontSize:12, color:'#333333', letterSpacing:'0.02em', marginBottom:2, fontWeight:600}}>{title}</div>
      {sub && <div style={{fontSize:12, color:'#9ca3af'}}>{sub}</div>}
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

const WHO_ANNUAL = 10

function calcYearStats(weeks, year) {
  const yearWeeks = weeks.filter(w => w.weekStart && w.weekStart.startsWith(String(year)))
  const allDays = yearWeeks.flatMap(w => w.days).filter(d => d.dropoff !== null || d.pickup !== null)
  const exceeded = allDays.filter(d => (d.dropoff ?? 0) > 25 || (d.pickup ?? 0) > 25)
  return { exceeded: exceeded.length, total: allDays.length }
}

function calcAnnualPctOver(weeks, year) {
  const yearWeeks = weeks.filter(w => w.weekStart && w.weekStart.startsWith(String(year)))
  const vals = yearWeeks.flatMap(w => w.days).flatMap(d => [d.dropoff, d.pickup]).filter(v => v !== null)
  if (!vals.length) return null
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length
  return Math.round((mean - WHO_ANNUAL) / WHO_ANNUAL * 100)
}

export default function No2Trends() {
  const [hourlyView, setHourlyView] = useState('all')
  const [stats2026, setStats2026] = useState(null)
  const [annualPctOver, setAnnualPctOver] = useState(null)

  useEffect(() => {
    fetch('/.netlify/functions/readings')
      .then(r => r.json())
      .then(data => {
        const weeks = data.weeks || []
        setStats2026(calcYearStats(weeks, 2026))
        setAnnualPctOver(calcAnnualPctOver(weeks, 2025))
      })
      .catch(() => {})
  }, [])

  return (
    <div style={{fontFamily:"'Inclusive Sans', sans-serif", color:'#1a1a1a'}}>

      {/* Intro */}
      <h2 style={{fontSize:24, fontWeight:600, color:'#333333', margin:'0 0 10px 0', paddingTop:20}}>What's this based on?</h2>
      <p style={{fontSize:14, lineHeight:1.8, color:'#333333', margin:'0 0 28px'}}>
        Analysis of 59,242 sensor readings from June 2024 to March 2026.
        The WHO safe limit for NO₂ is 25 μg/m³ as a 24-hour average.
      </p>

      {/* ── SECTION 1 ── */}
      <SectionLabel text="How bad is it really?" />

      <p style={{fontSize:14, lineHeight:1.8, color:'#333333', margin:'0 0 20px'}}>
        The WHO set its 25 μg/m³ daily limit because prolonged exposure above this level is linked to
        respiratory harm in children — reduced lung development, increased asthma risk, and higher susceptibility
        to infection. At Elm Grove, this is not an occasional breach. It is the winter norm. In January 2026 alone,
        the daily average exceeded the WHO limit on 27 out of 31 days. In 2025, the levels were 117% above the annual NO₂ WHO guideline limit of 10 μg/m³.
      </p>

      <Divider />

      {/* ── SECTION 2 ── */}
      <SectionLabel text="Are things getting better or worse?" />

      <p style={{fontSize:14, lineHeight:1.8, color:'#333333', margin:'0 0 24px'}}>
        Worse. After accounting for seasonal variation, NO₂ is rising at an estimated
        <strong style={{color:'#EF476F'}}> +2.75 μg/m³ per year</strong>. Each successive winter season
        has produced more readings above 40 μg/m³ than the last.
      </p>

      <Panel>
        <ChartTitle title="Monthly Readings Exceeding 40 μg/m³" sub="UK limit value threshold · Jun 2024 – Mar 2026" />
        <div style={{overflowX:'auto', WebkitOverflowScrolling:'touch'}}>
          <div style={{minWidth:600}}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={exceedanceData} margin={{top:4, right:8, left:0, bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="label" tick={{fill:'#9ca3af', fontSize:10}} interval={0} angle={-90} textAnchor="end" height={45} />
                <YAxis tick={{fill:'#9ca3af', fontSize:11}} width={36} />
                <Tooltip content={<ChartTooltip />} />
                <ReferenceLine x="Jun 24" stroke="#ccc" strokeWidth={1} label={{value:'Summer', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <ReferenceLine x="Sep 24" stroke="#ccc" strokeWidth={1} label={{value:'Autumn', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <ReferenceLine x="Nov 24" stroke="#ccc" strokeWidth={1} label={{value:'Winter', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <ReferenceLine x="Mar 25" stroke="#ccc" strokeWidth={1} label={{value:'Spring', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <ReferenceLine x="Jun 25" stroke="#ccc" strokeWidth={1} label={{value:'Summer', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <ReferenceLine x="Sep 25" stroke="#ccc" strokeWidth={1} label={{value:'Autumn', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <ReferenceLine x="Nov 25" stroke="#ccc" strokeWidth={1} label={{value:'Winter', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <ReferenceLine x="Mar 26" stroke="#ccc" strokeWidth={1} label={{value:'Spring', position:'insideTopRight', fontSize:9, fill:'#999', angle:-90, dx:8}} />
                <Bar dataKey="exc" name="Exceedances" fill="#EF476F" fillOpacity={0.85} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Panel>


      <Divider />

      {/* ── SECTION 3 ── */}
      <SectionLabel text="When's it worst?" />

      <p style={{fontSize:14, lineHeight:1.8, color:'#333333', margin:'0 0 24px'}}>
        NO₂ spikes twice a day — and both peaks fall directly on school opening and closing times.
        The morning school run (<strong style={{color:'#333333'}}>08:30–09:05</strong>) sits inside the
        daily morning peak. The afternoon pick-up window (<strong style={{color:'#333333'}}>15:10–15:45</strong>) lands
        at the start of the day's worst sustained stretch, running through to 19:00.
        In winter, concentrations during these windows regularly exceed 30 μg/m³.
      </p>

      <Panel>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16, flexWrap:'wrap', gap:10}}>
          <ChartTitle title="Average NO₂ by Hour of Day" sub="Mean across all readings in dataset" />
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
          <span style={{color:'#d4900a', fontWeight:600}}>▓ Drop-off 08:30–09:05 · Pick-up 15:10–15:45</span>
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
