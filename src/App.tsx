import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { AlertsPage } from "./pages/AlertsPage"
import { AlertDetailPage } from "./pages/AlertDetailPage"
import { ForecastPage } from "./pages/ForecastPage"
import { ReportPage } from "./pages/ReportPage"
// import { HistoryPage } from "./pages/HistoryPage"
// import { LoginPage } from "./pages/LoginPage"
// import { RegisterPage } from "./pages/RegisterPage"
// import { ProfilePage } from "./pages/ProfilePage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/alerts/:id" element={<AlertDetailPage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/report" element={<ReportPage />} />
        {/* <Route path="/history" element={<HistoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}