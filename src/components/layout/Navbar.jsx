import { Wifi } from 'lucide-react';
import LocationSelector from './LocationSelector';

function Navbar() {
  const lastUpdate = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="navbar">
      <div>
        <h1>AI Flood Prediction & Early Warning System</h1>
        <p className="navbar-subtitle">
          Sentinel-1 SAR · GIS · Machine Learning
        </p>
      </div>

      <div className="navbar-status">
        <LocationSelector />
        <div className="status-pill">
          <Wifi size={14} />
          <span>System Active</span>
        </div>
        <p className="last-update">Last update: {lastUpdate}</p>
      </div>
    </header>
  );
}

export default Navbar;
