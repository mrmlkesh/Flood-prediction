import { Satellite, Map, CloudRain, Cpu } from 'lucide-react';

function DataStatus({ status }) {
  const items = [
    { label: 'SAR Data', icon: Satellite, ok: status.sar.available, note: status.sar.source },
    { label: 'GIS Data', icon: Map, ok: status.gis.available, note: status.gis.source },
    { label: 'Weather Data', icon: CloudRain, ok: status.weather.available, note: status.weather.source },
    { label: 'ML Model', icon: Cpu, ok: status.mlModel.active, note: status.mlModel.version },
  ];

  return (
    <div className="panel">
      <h3 className="panel-title">Data Sources &amp; System Status</h3>
      <div className="status-list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div className="status-row" key={item.label}>
              <Icon size={16} />
              <div className="status-text">
                <span className="status-label">{item.label}</span>
                <span className="status-note">{item.note}</span>
              </div>
              <span className={`status-dot ${item.ok ? 'ok' : 'down'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DataStatus;