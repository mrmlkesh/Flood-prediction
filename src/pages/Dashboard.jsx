import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, FileDown, GitCompareArrows, Maximize, Percent, Satellite, TrendingUp } from 'lucide-react';
import RiskCard from '../components/dashboard/RiskCard';
import LocationDetails from '../components/dashboard/LocationDetails';
import DataStatus from '../components/dashboard/DataStatus';
import AlertCard from '../components/dashboard/AlertCard';
import LocationComparisonModal from '../components/dashboard/LocationComparisonModal';
import { dataStatus, aboutModel } from '../data/mockData';
import { formatProbability, getRiskLevel } from '../utils/risk';
import { useLocation } from '../context/LocationContext';

function Dashboard() {
  const { selectedLocation } = useLocation();
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const { dashboard: floodRiskSummary, prediction, gisData, alerts } = selectedLocation;
  const riskLevel = getRiskLevel(prediction.probability);
  const lastUpdate = new Date(floodRiskSummary.lastSatelliteUpdate).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  return <div className="page dashboard-page">
    <div className="dashboard-top"><div><h2>Dashboard</h2><p className="page-subtitle">{selectedLocation.name}</p></div><div className="dashboard-actions"><button className="secondary-button" onClick={() => setIsComparisonOpen(true)}><GitCompareArrows size={16} /> Compare locations</button><button className="secondary-button" onClick={() => window.print()}><FileDown size={16} /> Export / Print Summary</button></div></div>
    <div className="risk-card-grid"><RiskCard title="Current Flood Risk" value={riskLevel.toUpperCase()} icon={AlertTriangle} tone={riskLevel} to="/predictions" /><RiskCard title="Flood Probability" value={formatProbability(prediction.probability)} icon={Percent} tone={riskLevel} to="/predictions" /><RiskCard title="Affected Area" value={`${floodRiskSummary.affectedAreaKm2} km²`} icon={Maximize} tone="neutral" to="/flood-map" /><RiskCard title="Flood Area Change" value={`+${floodRiskSummary.floodAreaChangePercent}%`} icon={TrendingUp} tone="Medium" to="/flood-map" /><RiskCard title="Last Satellite Update" value={lastUpdate} icon={Satellite} tone="neutral" /></div>
    <div className="panel prediction-banner"><p>{prediction.statement}</p></div>
    <div className="two-col-grid"><LocationDetails gis={gisData} locationName={selectedLocation.name} to="/flood-map" /><DataStatus status={dataStatus} /></div>
    <div className="panel"><div className="panel-header"><h3 className="panel-title">Recent Alerts</h3><Link className="view-all-link" to="/alerts">View all alerts →</Link></div><div className="alert-list">{alerts.slice(0, 3).map((alert) => <AlertCard key={alert.id} alert={alert} />)}</div></div>
    <div className="panel about-panel"><h3 className="panel-title">About This Model</h3><p>{aboutModel.summary}</p></div>
    <LocationComparisonModal key={`${isComparisonOpen}-${selectedLocation.id}`} isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} />
    <section className="print-summary"><p className="print-eyebrow">AI Flood Prediction &amp; Early Warning System</p><h1>Risk Summary</h1><h2>{selectedLocation.name}</h2><p className="print-generated">Prepared from mock monitored-location data • {lastUpdate}</p><div className="print-summary-grid"><div><span>Flood risk</span><strong>{riskLevel}</strong></div><div><span>Probability</span><strong>{formatProbability(prediction.probability)}</strong></div><div><span>Affected area</span><strong>{floodRiskSummary.affectedAreaKm2} km²</strong></div><div><span>Rainfall (24h)</span><strong>{gisData.rainfallMm24h} mm</strong></div></div><h3>GIS and terrain</h3><ul><li>Elevation: {gisData.elevationMeters} m</li><li>Slope: {gisData.slopeDegrees}°</li><li>Terrain: {gisData.terrainCondition}</li><li>Distance from river: {gisData.distanceFromRiverKm} km</li></ul><h3>Top alerts</h3><ol>{alerts.slice(0, 3).map((alert) => <li key={alert.id}><strong>{alert.title}</strong> — {alert.location} ({getRiskLevel(alert.riskScore)}): {alert.recommendedAction}</li>)}</ol><p className="print-disclaimer">This summary uses mock data for student-project interface testing only. It is not a real-time flood warning.</p></section>
  </div>;
}

export default Dashboard;
