import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import HistoricalData from './pages/HistoricalData'
import Alerts from './pages/Alerts'
import No2 from './pages/No2'
import About from './pages/About'
import AdminGate from './pages/AdminGate'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<HistoricalData />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/no2" element={<No2 />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminGate />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
