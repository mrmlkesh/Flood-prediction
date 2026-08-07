import { useEffect, useState } from 'react';
import { BrainCircuit, ChevronDown, CloudRain, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';
import { getFloodPrediction } from '../services/api';
import { formatProbability, getRiskColor, getRiskLevel } from '../utils/risk';
import { useLocation } from '../context/LocationContext';

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);

function getImpact(weight) {
  if (weight >= 0.32) return 'High';
  if (weight >= 0.2) return 'Medium';
  return 'Low';
}

function createSimulation(rainfallMm, gisData, basePrediction) {
  const rainfallInput = clamp(rainfallMm / 300, 0, 1);
  const elevationVulnerability = clamp((100 - gisData.elevationMeters) / 100, 0, 1);
  const slopeVulnerability = clamp((6 - gisData.slopeDegrees) / 6, 0, 1);
  const historicalWeight = basePrediction.factors.find((factor) => factor.name === 'Previous flood events')?.contribution ?? 0.15;
  const probability = clamp(0.1 + (rainfallInput * 0.55) + (elevationVulnerability * 0.18) + (slopeVulnerability * 0.1) + (historicalWeight * 0.07), 0.02, 0.98);

  const rawFactors = [
    { name: 'Rainfall input', rawWeight: 0.15 + (rainfallInput * 0.8), description: 'This simulated contribution changes as you move the rainfall slider. It is not a live weather or ML-model result.' },
    { name: 'Low elevation', rawWeight: 0.1 + (elevationVulnerability * 0.45), description: 'This is based on the selected monitored location’s stored terrain information.' },
    { name: 'Low slope', rawWeight: 0.08 + (slopeVulnerability * 0.35), description: 'This is based on the selected monitored location’s stored slope value.' },
    { name: 'Previous flood events', rawWeight: 0.08 + (historicalWeight * 0.25), description: 'This carries a small fixed historical-context influence in the demonstration formula.' },
  ];
  const totalWeight = rawFactors.reduce((total, factor) => total + factor.rawWeight, 0);
  const factors = rawFactors.map((factor) => {
    const contribution = factor.rawWeight / totalWeight;
    return { ...factor, contribution, impact: getImpact(contribution) };
  });
  return { probability, factors };
}

function Predictions() {
  const { selectedLocationId, selectedLocation } = useLocation();
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFactor, setExpandedFactor] = useState(null);
  const [scenarioState, setScenarioState] = useState(null);

  const loadPrediction = async () => { setIsLoading(true); setPrediction(await getFloodPrediction(selectedLocationId)); setIsLoading(false); };
  useEffect(() => { getFloodPrediction(selectedLocationId).then((result) => { setPrediction(result); setIsLoading(false); }); }, [selectedLocationId]);

  if (isLoading || !prediction) return <div className="page"><h2>Predictions</h2><p>Loading mock prediction data…</p></div>;

  const actualRainfall = selectedLocation.gisData.rainfallMm24h;
  const scenarioRainfall = scenarioState?.locationId === selectedLocationId ? scenarioState.rainfallMm : actualRainfall;
  const isScenarioActive = scenarioState?.locationId === selectedLocationId && scenarioRainfall !== actualRainfall;
  const simulation = createSimulation(scenarioRainfall, selectedLocation.gisData, prediction);
  const displayedPrediction = isScenarioActive ? simulation : prediction;
  const riskLevel = getRiskLevel(prediction.probability);
  const riskColor = getRiskColor(riskLevel);
  const displayRiskLevel = getRiskLevel(displayedPrediction.probability);
  const predictionTime = new Date(prediction.predictionTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return <div className="page predictions-page">
    <div className="page-heading-row"><div><h2>Flood Prediction</h2><p className="page-subtitle">Current model output for {selectedLocation.name}</p></div><button className="secondary-button" onClick={loadPrediction} disabled={isLoading}><RefreshCw size={16} className={isLoading ? 'spin' : ''} /> Refresh data</button></div>

    <section className="panel prediction-overview">
      <div className="prediction-overview-icon" style={{ backgroundColor: `${riskColor}18`, color: riskColor }}><Sparkles size={25} /></div>
      <div className="prediction-overview-main"><span className="prediction-label">Current predicted flood risk</span><div className="prediction-risk-row"><span className="risk-badge" style={{ backgroundColor: `${riskColor}18`, color: riskColor, borderColor: `${riskColor}55` }}>{riskLevel}</span><strong>{formatProbability(prediction.probability)}</strong></div></div>
      <div className="prediction-time"><span>Prediction time</span><strong>{predictionTime}</strong></div><p className="prediction-statement">{prediction.statement}</p>
    </section>

    <section className="panel simulation-panel">
      <div className="simulation-heading"><div className="explainability-title"><span className="simulation-icon"><CloudRain size={21} /></span><div><h3 className="panel-title">What-if rainfall simulation</h3><p>Explore a simplified local demonstration scenario</p></div></div>{isScenarioActive && <span className="mock-label simulation-active">Simulation active</span>}</div>
      <p className="simulation-note">Simulated using a simplified model for demonstration — not the live prediction or a replacement for the model output above.</p>
      <div className="simulation-controls"><label htmlFor="rainfall-slider"><span>Rainfall input</span><strong>{scenarioRainfall} mm</strong></label><input id="rainfall-slider" type="range" min="0" max="300" step="1" value={scenarioRainfall} onChange={(event) => setScenarioState({ locationId: selectedLocationId, rainfallMm: Number(event.target.value) })} /><div className="slider-scale"><span>0 mm</span><span>Current conditions: {actualRainfall} mm</span><span>300 mm</span></div></div>
      <div className="simulation-result"><div><span>Simulated flood risk</span><div className="prediction-risk-row"><span className="risk-badge" style={{ backgroundColor: `${getRiskColor(displayRiskLevel)}18`, color: getRiskColor(displayRiskLevel), borderColor: `${getRiskColor(displayRiskLevel)}55` }}>{displayRiskLevel}</span><strong>{formatProbability(simulation.probability)}</strong></div></div><button className="reset-simulation-button" onClick={() => setScenarioState(null)} disabled={!isScenarioActive}><RotateCcw size={15} /> Reset to current conditions</button></div>
    </section>

    <section className="panel explainability-panel">
      <div className="explainability-heading"><div className="explainability-title"><span className="brain-icon"><BrainCircuit size={21} /></span><div><h3 className="panel-title">Explainable AI</h3><p>{isScenarioActive ? 'Simulated model feature contributions' : 'Model feature contributions'}</p></div></div><span className="mock-label">{isScenarioActive ? 'Simulation view' : 'SHAP-style mock view'}</span></div>
      <p className="explainability-note">{isScenarioActive ? 'These bars are recalculated by the simplified demonstration formula as the slider changes; they are not live model explanations.' : 'These bars show relative feature contributions to this mock prediction. They are a model explanation, not a statement of proven cause.'}</p>
      <div className="factor-list">{displayedPrediction.factors.map((factor, index) => { const isExpanded = expandedFactor === index; const impactColor = getRiskColor(factor.impact); return <div className={`factor-item ${isExpanded ? 'is-expanded' : ''}`} key={factor.name}><button className="factor-button" onClick={() => setExpandedFactor(isExpanded ? null : index)} aria-expanded={isExpanded}><span className="factor-name">{factor.name}</span><span className="factor-impact" style={{ color: impactColor, backgroundColor: `${impactColor}18` }}>{factor.impact} impact</span><span className="factor-weight">{formatProbability(factor.contribution)}</span><ChevronDown size={18} className={isExpanded ? 'chevron-open' : ''} /></button><button className="contribution-bar" onClick={() => setExpandedFactor(isExpanded ? null : index)} aria-label={`Show explanation for ${factor.name}`}><span className="contribution-fill" style={{ width: formatProbability(factor.contribution), backgroundColor: impactColor }} /></button>{isExpanded && <p className="factor-description">{factor.description}</p>}</div>; })}</div>
    </section>
  </div>;
}

export default Predictions;
