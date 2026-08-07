import { useState } from 'react';
import { X } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { formatProbability, getRiskColor, getRiskLevel } from '../../utils/risk';

function LocationStats({ location }) {
  const riskLevel = getRiskLevel(location.prediction.probability);
  const rows = [
    { label: 'Flood risk', value: riskLevel, color: getRiskColor(riskLevel) },
    { label: 'Probability', value: formatProbability(location.prediction.probability) },
    { label: 'Affected area', value: `${location.dashboard.affectedAreaKm2} km²` },
    { label: 'Elevation', value: `${location.gisData.elevationMeters} m` },
    { label: 'Rainfall (24h)', value: `${location.gisData.rainfallMm24h} mm` },
  ];
  return <div className="comparison-location-card"><h3>{location.name}</h3>{rows.map((row) => <div className="comparison-stat" key={row.label}><span>{row.label}</span><strong style={{ color: row.color }}>{row.value}</strong></div>)}</div>;
}

function LocationComparisonModal({ isOpen, onClose }) {
  const { locations, selectedLocationId } = useLocation();
  const [firstId, setFirstId] = useState(selectedLocationId);
  const [secondId, setSecondId] = useState(locations.find((location) => location.id !== selectedLocationId)?.id ?? selectedLocationId);
  if (!isOpen) return null;
  const firstLocation = locations.find((location) => location.id === firstId);
  const secondLocation = locations.find((location) => location.id === secondId);
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="comparison-modal" role="dialog" aria-modal="true" aria-labelledby="comparison-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-header"><div><h2 id="comparison-title">Compare monitored locations</h2><p>Mock data comparison for the selected monitored locations.</p></div><button className="modal-close-button" onClick={onClose} aria-label="Close comparison"><X size={19} /></button></div><div className="comparison-selectors"><label>First location<select value={firstId} onChange={(event) => setFirstId(event.target.value)}>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label><label>Second location<select value={secondId} onChange={(event) => setSecondId(event.target.value)}>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label></div><div className="comparison-grid"><LocationStats location={firstLocation} /><LocationStats location={secondLocation} /></div></section></div>;
}

export default LocationComparisonModal;
