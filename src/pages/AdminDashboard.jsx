import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [subscribers, setSubscribers] = useState([])
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadMode, setUploadMode] = useState('append')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) {
      navigate('/admin')
      return
    }
    fetchSubscribers()
  }, [])

  async function fetchSubscribers() {
    try {
      const res = await fetch('/.netlify/functions/admin-subscribers')
      const data = await res.json()
      setSubscribers(data.subscribers || [])
    } catch (_) {
      setSubscribers([])
    }
    setLoading(false)
  }

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploadStatus('uploading')
    try {
      const text = await file.text()
      const readings = parseCSV(text)
      if (!readings) { setUploadStatus('error'); return }
      const res = await fetch('/.netlify/functions/admin-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readings, mode: uploadMode }),
      })
      const data = await res.json()
      setUploadStatus({ count: data.count, from: data.from, to: data.to })
    } catch (_) {
      setUploadStatus('error')
    }
  }

  function parseCSV(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const headerIdx = lines.findIndex(l => l.includes('Date (Local)'))
    if (headerIdx === -1) return null

    const headers = splitCSVLine(lines[headerIdx])
    const dateCol = headers.indexOf('Date (Local)')
    const timeCol = headers.indexOf('Time (Local)')
    const no2Col  = headers.indexOf('NO2 Concentration')
    if (dateCol === -1 || timeCol === -1 || no2Col === -1) return null

    const byDate = {}
    for (const line of lines.slice(headerIdx + 1)) {
      const vals = splitCSVLine(line)
      const dateStr = vals[dateCol]?.trim()
      const time    = vals[timeCol]?.trim().substring(0, 5)
      const no2     = parseFloat(vals[no2Col])
      if (!dateStr || !time || isNaN(no2)) continue
      const [y, m, d] = dateStr.split('/').map(Number)
      const dow = new Date(y, m - 1, d).getDay()
      if (dow === 0 || dow === 6) continue
      if (!byDate[dateStr]) byDate[dateStr] = { dropoff: [], pickup: [] }
      if (time >= '08:15' && time <= '09:15') byDate[dateStr].dropoff.push(no2)
      if (time >= '14:45' && time <= '15:45') byDate[dateStr].pickup.push(no2)
    }

    const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10 : null

    return Object.entries(byDate)
      .map(([date, { dropoff, pickup }]) => ({ date, dropoff: avg(dropoff), pickup: avg(pickup) }))
      .filter(r => r.dropoff !== null || r.pickup !== null)
  }

  function splitCSVLine(line) {
    const result = []
    let current = '', inQuotes = false
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes }
      else if (ch === ',' && !inQuotes) { result.push(current); current = '' }
      else { current += ch }
    }
    result.push(current)
    return result
  }

  async function handleDelete(phone) {
    await fetch('/.netlify/functions/admin-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    setSubscribers(s => s.filter(sub => sub.phone !== phone))
  }

  function handleExport() {
    const header = 'phone,timing,level,date\n'
    const rows = subscribers.map(s => `${s.phone},${s.timing},${s.level},${s.date}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'elmgrove-subscribers.csv'
    a.click()
  }

  function handleSignOut() {
    sessionStorage.removeItem('admin_auth')
    navigate('/admin')
  }

  return (
    <div className="max-w-[390px] mx-auto min-h-screen bg-gray-50">
      {/* Admin nav */}
      <div className="flex items-center justify-between px-5 py-4 bg-ink">
        <div>
          <p className="text-[15px] font-bold text-white leading-tight">Elm Grove · Admin</p>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">Air quality dashboard</p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-[13px] text-gray-500 font-medium bg-transparent border-none cursor-pointer"
        >
          Sign out
        </button>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        {/* CSV Upload */}
        <div className="bg-white rounded-[12px] overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-bold text-ink">Data upload</h2>
          </div>

          {/* Drop zone */}
          <label className="mx-4 mt-4 border-2 border-dashed border-gray-200 rounded-[10px] py-7 flex flex-col items-center gap-2 bg-gray-50 cursor-pointer block">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 18V10M14 10l-4 4M14 10l4 4" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 20a5 5 0 01.5-9.95A7 7 0 0120 12a4 4 0 010 8H6z" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-[14px] font-semibold text-gray-300">Upload EarthSense CSV export</span>
            <span className="text-[12px] text-gray-200">Tap to select file</span>
            <input type="file" accept=".csv" onChange={handleUpload} className="hidden" />
          </label>

          {/* Mode toggle */}
          <div className="flex gap-2 mx-4 mt-3 mb-4">
            {[['append', 'Append'], ['replace', 'Replace all']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setUploadMode(val)}
                className={`flex-1 py-2.5 rounded-[8px] text-[13px] font-semibold border-none cursor-pointer transition-all ${
                  uploadMode === val ? 'bg-ink text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Upload status */}
          {uploadStatus && uploadStatus !== 'uploading' && uploadStatus !== 'error' && (
            <div className="mx-4 mb-4 bg-[#F0FDF8] rounded-[8px] px-3.5 py-3 flex items-start gap-2.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="8" cy="8" r="7" stroke="#059669" strokeWidth="1.4" />
                <path d="M5 8.5l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="text-[13px] font-semibold text-ink">{uploadStatus.count} new readings imported</p>
                <p className="text-[12px] text-gray-400">Covering {uploadStatus.from} – {uploadStatus.to}</p>
              </div>
            </div>
          )}
          {uploadStatus === 'error' && (
            <p className="mx-4 mb-4 text-[13px] text-[#EF476F]">Upload failed. Please try again.</p>
          )}
        </div>

        {/* Subscribers */}
        <div className="bg-white rounded-[12px] overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-[15px] font-bold text-ink">Subscribers</h2>
              <span className="text-[13px] text-gray-300">{subscribers.length}</span>
            </div>
            <div className="flex gap-4">
              <button onClick={handleExport} className="text-[13px] font-semibold text-teal bg-transparent border-none cursor-pointer">
                Export CSV
              </button>
            </div>
          </div>

          {/* Column headers */}
          <div className="flex px-4 py-2 bg-gray-50 border-b border-gray-100">
            <span className="flex-1 text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Number</span>
            <span className="w-[80px] text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Timing</span>
            <span className="w-[55px] text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Level</span>
            <span className="w-[40px]" />
          </div>

          {loading ? (
            <p className="px-4 py-6 text-[13px] text-gray-300">Loading…</p>
          ) : subscribers.length === 0 ? (
            <p className="px-4 py-6 text-[13px] text-gray-300">No subscribers yet.</p>
          ) : (
            subscribers.map(sub => (
              <div key={sub.phone} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0">
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[13px] font-semibold text-ink">{sub.phone}</span>
                  <span className="text-[11px] text-gray-300">{sub.date}</span>
                </div>
                <span className="w-[80px] text-[12px] text-gray-500">
                  {sub.timing === 'evening' ? 'Evening' : 'Eve + Morn'}
                </span>
                <span className="w-[55px] text-[12px] text-gray-500">
                  {sub.level === 'all' ? 'All' : 'Severe'}
                </span>
                <button
                  onClick={() => handleDelete(sub.phone)}
                  className="w-[40px] flex justify-end bg-transparent border-none cursor-pointer"
                  aria-label="Delete subscriber"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.5 7.5h7L11 4" stroke="#EF476F" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
