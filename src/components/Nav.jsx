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
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-[14px] shadow-[0_2px_16px_rgba(0,0,0,0.08)] w-[calc(100%-32px)] max-w-[1408px]">
      {/* Header row */}
      <div className="flex items-center justify-between px-5 py-3">
        <Link to="/" className="text-[15px] font-bold text-ink no-underline">
          Elm Grove air quality
        </Link>

        {/* Desktop inline links */}
        <ul className="hidden desktop:flex list-none p-0 m-0 gap-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`text-[14px] font-medium no-underline ${
                  pathname === to ? 'text-teal' : 'text-gray-400 hover:text-ink'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile/tablet hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="desktop:hidden flex flex-col gap-[5px] w-[22px] cursor-pointer bg-transparent border-none p-0"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <span className="text-[18px] text-gray-400 leading-none">✕</span>
          ) : (
            <>
              <span className="h-[2px] bg-ink rounded-sm block" />
              <span className="h-[2px] bg-ink rounded-sm block" />
              <span className="h-[2px] bg-ink rounded-sm block" />
            </>
          )}
        </button>
      </div>

      {/* Expanded menu */}
      {open && (
        <ul className="desktop:hidden list-none p-0 m-0 px-5 pb-3 flex flex-col border-t border-gray-100">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={() => setOpen(false)}
                className={`block text-[17px] font-semibold py-3 no-underline border-b border-gray-100 last:border-0 ${
                  pathname === to ? 'text-teal' : 'text-ink'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
