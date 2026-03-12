import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'elmgrove2026'

export default function AdminGate() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1')
      navigate('/admin/dashboard')
    } else {
      setError(true)
    }
  }

  return (
    <div className="max-w-[390px] mx-auto min-h-screen flex flex-col items-start justify-center px-8">
      {/* Lock icon */}
      <div className="w-12 h-12 rounded-[12px] bg-ink flex items-center justify-center mb-6">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="9" width="12" height="9" rx="2" stroke="white" strokeWidth="1.6" />
          <path d="M7 9V6a3 3 0 016 0v3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-[24px] font-bold text-ink mb-1">Admin access</h1>
      <p className="text-[14px] text-gray-400 mb-8">Elm Grove Air Quality · restricted area</p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <label className="text-[13px] font-semibold text-ink">Password</label>
        <div className={`flex items-center justify-between border-2 rounded-[10px] px-4 py-3.5 bg-white ${error ? 'border-[#EF476F]' : 'border-teal'}`}>
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            className="flex-1 text-[16px] tracking-widest border-none outline-none bg-transparent text-ink"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="bg-transparent border-none cursor-pointer p-0 ml-2"
            aria-label="Toggle password visibility"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#bbb" strokeWidth="1.5" />
              <circle cx="9" cy="9" r="2.5" stroke="#bbb" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {error && <p className="text-[13px] text-[#EF476F]">Incorrect password. Try again.</p>}

        <button
          type="submit"
          className="bg-ink text-white text-[16px] font-bold py-4 rounded-[10px] border-none cursor-pointer mt-1"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
