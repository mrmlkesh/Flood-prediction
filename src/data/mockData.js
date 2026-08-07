// Mock data for monitored locations. All probabilities/risk scores are decimals (0–1).
// These values are illustrative UI data, not real-time warnings or measurements.

const dataStatus = {
  sar: { available: true, source: 'Sentinel-1 SAR' },
  gis: { available: true, source: 'SRTM DEM + Land Cover' },
  weather: { available: true, source: 'IMD Rainfall Feed' },
  mlModel: { active: true, version: 'Ensemble v0.3 (RF + XGBoost + Bagging-kNN)' },
  lastUpdate: '2026-07-30T08:00:00+05:30',
};

export const aboutModel = {
  summary: 'This system combines satellite imagery, terrain and elevation data, rainfall data, and historical flood records. An ensemble model generates the flood-risk prediction, and Explainable AI highlights the relative contribution of model features.',
};

const descriptions = {
  rainfall: 'Recent rainfall is an input to the model. Higher rainfall can increase the model’s estimated flood risk for this monitored location.',
  elevation: 'Lower-lying terrain is an input to the model because water may collect more easily in such areas.',
  water: 'A growing water-extent signal in the input data contributed to this model output.',
  history: 'Past flood-event records are included as a historical context feature for the model.',
};

const makeFactors = (rain, elevation, water, history) => [
  { name: 'Heavy rainfall', impact: rain >= 0.3 ? 'High' : 'Medium', contribution: rain, description: descriptions.rainfall },
  { name: 'Low elevation', impact: elevation >= 0.3 ? 'High' : 'Medium', contribution: elevation, description: descriptions.elevation },
  { name: 'Increasing water extent', impact: water >= 0.25 ? 'High' : 'Medium', contribution: water, description: descriptions.water },
  { name: 'Previous flood events', impact: history >= 0.2 ? 'Medium' : 'Low', contribution: history, description: descriptions.history },
];

const makeMapData = (location, zoneRiskScores) => ({
  selectedLocation: { name: location.name, lat: location.lat, lng: location.lng },
  zones: zoneRiskScores.map((riskScore, index) => {
    const offsets = [[0.012, -0.015], [0.006, 0.014], [-0.012, 0.008]][index];
    const [latOffset, lngOffset] = offsets;
    return { id: `${location.id}-zone-${index + 1}`, name: `${location.shortName} monitored zone ${index + 1}`, riskScore, coordinates: [[location.lat + latOffset, location.lng + lngOffset], [location.lat + latOffset + 0.008, location.lng + lngOffset + 0.01], [location.lat + latOffset - 0.003, location.lng + lngOffset + 0.017], [location.lat + latOffset - 0.009, location.lng + lngOffset + 0.007]] };
  }),
  floodExtent: { label: 'Estimated flood extent (mock overlay)', coordinates: [[location.lat + 0.008, location.lng - 0.01], [location.lat + 0.011, location.lng + 0.006], [location.lat - 0.003, location.lng + 0.014], [location.lat - 0.01, location.lng + 0.001], [location.lat - 0.003, location.lng - 0.012]] },
  markers: [
    { id: `${location.id}-school`, name: `${location.shortName} public school`, type: 'school', riskScore: zoneRiskScores[0], position: [location.lat + 0.004, location.lng - 0.006] },
    { id: `${location.id}-hospital`, name: `${location.shortName} civil hospital`, type: 'hospital', riskScore: zoneRiskScores[1], position: [location.lat - 0.003, location.lng + 0.007] },
    { id: `${location.id}-road`, name: `${location.shortName} road access point`, type: 'road', riskScore: zoneRiskScores[2], position: [location.lat - 0.007, location.lng + 0.012] },
  ],
});

// Dates are spaced through the three weeks leading up to the current mock prediction.
const historical = (values) => values.map((probability, index) => ({ date: `2026-07-${String(10 + (index * 2)).padStart(2, '0')}`, probability }));

export const locations = [
  {
    id: 'dombivli', name: 'Kalyan-Dombivli, Thane District', shortName: 'Dombivli', lat: 19.2403, lng: 73.1305,
    dashboard: { affectedAreaKm2: 14.6, floodAreaChangePercent: 32, lastSatelliteUpdate: '2026-07-29T06:15:00+05:30' },
    prediction: { probability: 0.87, predictionTime: '2026-07-30T08:00:00+05:30', statement: 'High flood risk predicted in the selected monitored region within the next prediction period.', factors: makeFactors(0.38, 0.27, 0.21, 0.14) },
    gisData: { elevationMeters: 12.4, slopeDegrees: 2.1, terrainCondition: 'Low-lying floodplain', rainfallMm24h: 145, distanceFromRiverKm: 0.8 },
    alerts: [{ id: 'dom-1', riskScore: 0.87, title: 'High flood risk near school', location: 'Zilla Parishad School, Dombivli East', time: '2026-07-30T07:40:00+05:30', recommendedAction: 'Initiate early dismissal and avoid low-lying access roads.' }, { id: 'dom-2', riskScore: 0.81, title: 'Hospital located in high-risk zone', location: 'Shastrinagar Civil Hospital', time: '2026-07-30T07:10:00+05:30', recommendedAction: 'Alert hospital administration and prepare emergency power backup.' }, { id: 'dom-3', riskScore: 0.58, title: 'Road potentially affected', location: 'Manpada Road, near Retibunder', time: '2026-07-30T06:50:00+05:30', recommendedAction: 'Notify traffic police and prepare a diversion route.' }],
    historicalData: historical([0.22, 0.26, 0.31, 0.38, 0.46, 0.55, 0.61, 0.68, 0.75, 0.81, 0.87]), mapData: null,
  },
  {
    id: 'kolhapur', name: 'Kolhapur, Panchganga Basin', shortName: 'Kolhapur', lat: 16.705, lng: 74.2433,
    dashboard: { affectedAreaKm2: 10.2, floodAreaChangePercent: 18, lastSatelliteUpdate: '2026-07-29T06:05:00+05:30' },
    prediction: { probability: 0.74, predictionTime: '2026-07-30T08:00:00+05:30', statement: 'High flood risk predicted around monitored areas near the Panchganga basin.', factors: makeFactors(0.34, 0.25, 0.23, 0.18) },
    gisData: { elevationMeters: 553, slopeDegrees: 1.8, terrainCondition: 'River floodplain', rainfallMm24h: 118, distanceFromRiverKm: 1.1 },
    alerts: [{ id: 'kol-1', riskScore: 0.74, title: 'High river-side flood risk', location: 'Kasaba Bawada, Kolhapur', time: '2026-07-30T07:35:00+05:30', recommendedAction: 'Prepare local evacuation support and monitor river-side access.' }, { id: 'kol-2', riskScore: 0.62, title: 'Low-lying road watch', location: 'Rankala Road', time: '2026-07-30T07:00:00+05:30', recommendedAction: 'Monitor road conditions and keep diversion signage ready.' }],
    historicalData: historical([0.21, 0.25, 0.29, 0.34, 0.4, 0.46, 0.52, 0.58, 0.65, 0.7, 0.74]), mapData: null,
  },
  {
    id: 'sangli', name: 'Sangli, Krishna River Basin', shortName: 'Sangli', lat: 16.8524, lng: 74.5815,
    dashboard: { affectedAreaKm2: 7.8, floodAreaChangePercent: 15, lastSatelliteUpdate: '2026-07-29T06:10:00+05:30' },
    prediction: { probability: 0.63, predictionTime: '2026-07-30T08:00:00+05:30', statement: 'Medium flood risk predicted for monitored areas along the Krishna river basin.', factors: makeFactors(0.3, 0.22, 0.25, 0.23) },
    gisData: { elevationMeters: 549, slopeDegrees: 2.7, terrainCondition: 'Flat river terrace', rainfallMm24h: 89, distanceFromRiverKm: 1.5 },
    alerts: [{ id: 'san-1', riskScore: 0.63, title: 'River level watch advised', location: 'Haripur riverside area', time: '2026-07-30T07:20:00+05:30', recommendedAction: 'Monitor local river gauges and share advisory updates.' }, { id: 'san-2', riskScore: 0.43, title: 'Drainage monitoring advisory', location: 'Vishrambag area', time: '2026-07-30T06:40:00+05:30', recommendedAction: 'Clear visible drainage obstructions where safely possible.' }],
    historicalData: historical([0.18, 0.21, 0.25, 0.29, 0.34, 0.4, 0.46, 0.52, 0.57, 0.6, 0.63]), mapData: null,
  },
  {
    id: 'chiplun', name: 'Chiplun, Vashishti River Basin', shortName: 'Chiplun', lat: 17.5333, lng: 73.5167,
    dashboard: { affectedAreaKm2: 12.4, floodAreaChangePercent: 27, lastSatelliteUpdate: '2026-07-29T06:20:00+05:30' },
    prediction: { probability: 0.82, predictionTime: '2026-07-30T08:00:00+05:30', statement: 'High flood risk predicted in monitored low-lying areas near the Vashishti river.', factors: makeFactors(0.36, 0.29, 0.23, 0.12) },
    gisData: { elevationMeters: 7.6, slopeDegrees: 2.4, terrainCondition: 'Coastal river floodplain', rainfallMm24h: 162, distanceFromRiverKm: 0.5 },
    alerts: [{ id: 'chi-1', riskScore: 0.82, title: 'High flood risk near market area', location: 'Chiplun market vicinity', time: '2026-07-30T07:45:00+05:30', recommendedAction: 'Prepare early warning messages and avoid riverside routes.' }, { id: 'chi-2', riskScore: 0.71, title: 'Hospital access route at risk', location: 'Kamathe road', time: '2026-07-30T07:05:00+05:30', recommendedAction: 'Keep an alternate hospital access route available.' }],
    historicalData: historical([0.29, 0.34, 0.4, 0.47, 0.54, 0.61, 0.68, 0.73, 0.77, 0.8, 0.82]), mapData: null,
  },
  {
    id: 'nashik', name: 'Nashik, Godavari River Corridor', shortName: 'Nashik', lat: 19.9975, lng: 73.7898,
    dashboard: { affectedAreaKm2: 4.1, floodAreaChangePercent: 9, lastSatelliteUpdate: '2026-07-29T06:25:00+05:30' },
    prediction: { probability: 0.39, predictionTime: '2026-07-30T08:00:00+05:30', statement: 'Low flood risk predicted for the monitored Godavari river corridor at this time.', factors: makeFactors(0.24, 0.21, 0.19, 0.36) },
    gisData: { elevationMeters: 560, slopeDegrees: 4.2, terrainCondition: 'Urban river corridor', rainfallMm24h: 41, distanceFromRiverKm: 1.8 },
    alerts: [{ id: 'nas-1', riskScore: 0.39, title: 'River corridor observation', location: 'Ramkund vicinity', time: '2026-07-30T06:55:00+05:30', recommendedAction: 'Continue routine observation of water levels.' }, { id: 'nas-2', riskScore: 0.24, title: 'Drainage status normal', location: 'Panchavati area', time: '2026-07-30T06:15:00+05:30', recommendedAction: 'Maintain routine drainage inspection schedule.' }],
    historicalData: historical([0.52, 0.49, 0.45, 0.42, 0.4, 0.38, 0.35, 0.34, 0.36, 0.38, 0.39]), mapData: null,
  },
  {
    id: 'kurla', name: 'Kurla, Mumbai Suburban District', shortName: 'Kurla', lat: 19.0726, lng: 72.8845,
    dashboard: { affectedAreaKm2: 8.9, floodAreaChangePercent: 21, lastSatelliteUpdate: '2026-07-29T06:30:00+05:30' },
    prediction: { probability: 0.69, predictionTime: '2026-07-30T08:00:00+05:30', statement: 'Medium flood risk predicted for monitored low-lying urban areas in Kurla.', factors: makeFactors(0.33, 0.26, 0.24, 0.17) },
    gisData: { elevationMeters: 5.2, slopeDegrees: 1.1, terrainCondition: 'Low-lying urban basin', rainfallMm24h: 109, distanceFromRiverKm: 2.2 },
    alerts: [{ id: 'kur-1', riskScore: 0.69, title: 'Urban waterlogging risk', location: 'LBS Marg, Kurla West', time: '2026-07-30T07:30:00+05:30', recommendedAction: 'Monitor underpasses and issue traffic diversions if required.' }, { id: 'kur-2', riskScore: 0.51, title: 'Rail access monitoring', location: 'Kurla station approach', time: '2026-07-30T06:50:00+05:30', recommendedAction: 'Coordinate with local authorities on access conditions.' }],
    historicalData: historical([0.28, 0.32, 0.37, 0.42, 0.48, 0.53, 0.57, 0.61, 0.64, 0.67, 0.69]), mapData: null,
  },
];

locations.forEach((location) => { location.mapData = makeMapData(location, [location.prediction.probability, Math.max(0.2, location.prediction.probability - 0.18), Math.max(0.15, location.prediction.probability - 0.42)]); });

export const getLocationById = (id) => locations.find((location) => location.id === id) || locations[0];
export { dataStatus };
