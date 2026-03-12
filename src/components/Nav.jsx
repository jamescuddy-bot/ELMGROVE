import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/data', label: 'Data' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/no2', label: 'NO₂' },
  { to: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <nav className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
        <Link to="/" className="text-[15px] font-bold text-ink no-underline">
          Elm Grove · Air quality
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col gap-[5px] w-[22px] cursor-pointer bg-transparent border-none p-0"
          aria-label="Open menu"
        >
          <span className="h-[2px] bg-ink rounded-sm block" />
          <span className="h-[2px] bg-ink rounded-sm block" />
          <span className="h-[2px] bg-ink rounded-sm block" />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col px-5 py-4">
          <div className="flex items-center justify-between mb-10">
            <span className="text-[15px] font-bold text-ink">Elm Grove · Air quality</span>
            <button
              onClick={() => setOpen(false)}
              className="text-2xl text-gray-400 bg-transparent border-none cursor-pointer leading-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {links.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`block text-[22px] font-bold py-3 no-underline border-b border-gray-100 ${
                    pathname === to ? 'text-teal' : 'text-ink'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
