import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import FloodMap from './pages/Floodmap';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import HistoricalAnalysis from './pages/HistoricalAnalysis';
import { LocationProvider } from './context/LocationProvider';
import './index.css';

function App() {
  return (
    <LocationProvider>
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Navbar />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/flood-map" element={<FloodMap />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/historical" element={<HistoricalAnalysis />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
    </LocationProvider>
  );
}

export default App;
