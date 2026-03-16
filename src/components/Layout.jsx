import Nav from './Nav'

export default function Layout({ children }) {
  return (
    <div className="w-full max-w-[1440px] mx-auto min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col pt-[72px]">
        {children}
      </main>
    </div>
  )
}
