import Nav from './Nav'

export default function Layout({ children, bgColor }) {
  return (
    <div className="w-full max-w-[960px] mx-auto min-h-screen flex flex-col" style={bgColor ? { background: bgColor } : undefined}>
      <Nav />
      <main className="flex-1 flex flex-col pt-[72px]">
        {children}
      </main>
    </div>
  )
}
