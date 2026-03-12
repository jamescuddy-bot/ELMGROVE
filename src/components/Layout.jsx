import Nav from './Nav'

export default function Layout({ children }) {
  return (
    <div className="max-w-[390px] mx-auto min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
