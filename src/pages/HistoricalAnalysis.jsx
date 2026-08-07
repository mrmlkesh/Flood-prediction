import { useEffect, useState } from 'react';
import { Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { getHistoricalData } from '../services/api';
import { formatProbability, getRiskColor, getRiskLevel } from '../utils/risk';
import { useLocation } from '../context/LocationContext';

function HistoricalTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const riskLevel = getRiskLevel(point.probability);
  return <div className="history-tooltip"><strong>{new Date(`${point.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong><span>Flood probability: <b style={{ color: getRiskColor(riskLevel) }}>{formatProbability(point.probability)} ({riskLevel})</b></span>{point.isCurrent && <em>Current prediction</em>}</div>;
}

function HistoricalAnalysis() {
  const { selectedLocationId, selectedLocation } = useLocation();
  const [observations, setObservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => { setIsLoading(true); setObservations(await getHistoricalData(selectedLocationId)); setIsLoading(false); };
  useEffect(() => { getHistoricalData(selectedLocationId).then((result) => { setObservations(result); setIsLoading(false); }); }, [selectedLocationId]);

  const currentProbability = selectedLocation.prediction.probability;
  const chartData = observations.map((item, index) => ({ ...item, label: new Date(`${item.date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), isCurrent: index === observations.length - 1 }));
  const first = observations[0];
  const difference = first ? currentProbability - first.probability : 0;
  const hasIncreased = difference >= 0;
  const currentLevel = getRiskLevel(currentProbability);
  const currentColor = getRiskColor(currentLevel);

  return <div className="page historical-page">
    <div className="page-heading-row"><div><h2>Historical Analysis</h2><p className="page-subtitle">Mock flood-risk observations for {selectedLocation.name}</p></div><button className="secondary-button" onClick={loadHistory} disabled={isLoading}><RefreshCw size={isLoading ? 16 : 16} className={isLoading ? 'spin' : ''} /> Refresh data</button></div>
    <section className="panel historical-panel">
      <div className="historical-heading"><div><h3 className="panel-title">Flood risk trend</h3><p>Probability uses the same 0–1 model-output scale as the current prediction.</p></div><div className="latest-observation" style={{ color: currentColor }}>{hasIncreased ? <TrendingUp size={17} /> : <TrendingDown size={17} />} Current: {formatProbability(currentProbability)} ({currentLevel})</div></div>
      {!isLoading && first && <p className="trend-summary">Risk has <strong>{hasIncreased ? 'increased' : 'decreased'}</strong> by <strong>{formatProbability(Math.abs(difference))}</strong> over the observed period, from {formatProbability(first.probability)} to the current {formatProbability(currentProbability)} prediction.</p>}
      {isLoading ? <p className="chart-loading">Loading mock observations…</p> : <div className="historical-chart"><ResponsiveContainer width="100%" height={340}><LineChart data={chartData} margin={{ top: 16, right: 18, left: -12, bottom: 4 }}><ReferenceArea y1={0} y2={0.4} fill={getRiskColor('Low')} fillOpacity={0.06} /><ReferenceArea y1={0.4} y2={0.7} fill={getRiskColor('Medium')} fillOpacity={0.06} /><ReferenceArea y1={0.7} y2={1} fill={getRiskColor('High')} fillOpacity={0.06} /><XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6c7c8f' }} axisLine={false} tickLine={false} /><YAxis domain={[0, 1]} tickFormatter={(value) => formatProbability(value)} tick={{ fontSize: 12, fill: '#6c7c8f' }} axisLine={false} tickLine={false} /><Tooltip content={<HistoricalTooltip />} /><ReferenceLine y={currentProbability} stroke={currentColor} strokeDasharray="5 5" label={{ value: 'Current prediction', fill: currentColor, fontSize: 11, position: 'insideTopRight' }} /><Line type="monotone" dataKey="probability" stroke={currentColor} strokeWidth={3} dot={(props) => <circle key={props.index} cx={props.cx} cy={props.cy} r={props.payload.isCurrent ? 7 : 4} fill={props.payload.isCurrent ? '#ffffff' : currentColor} stroke={currentColor} strokeWidth={props.payload.isCurrent ? 3 : 0} />} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></div>}
      <div className="risk-band-key"><span><i style={{ background: getRiskColor('Low') }} /> Low: under 40%</span><span><i style={{ background: getRiskColor('Medium') }} /> Medium: 40–69%</span><span><i style={{ background: getRiskColor('High') }} /> High: 70%+</span></div>
      <p className="historical-note">This chart contains mock observations for interface testing and does not represent real historical measurements.</p>
    </section>
  </div>;
}

export default HistoricalAnalysis;
