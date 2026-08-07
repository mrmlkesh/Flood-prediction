import { Link } from 'react-router-dom';

function LocationDetails({ gis, locationName, to }) {
  const rows = [
    { label: 'Elevation', value: `${gis.elevationMeters} m` },
    { label: 'Slope', value: `${gis.slopeDegrees}°` },
    { label: 'Terrain Condition', value: gis.terrainCondition },
    { label: 'Rainfall (24h)', value: `${gis.rainfallMm24h} mm` },
    { label: 'Distance from River', value: `${gis.distanceFromRiverKm} km` },
  ];
  const content = <><h3 className="panel-title">GIS &amp; Terrain — {locationName}</h3><div className="detail-list">{rows.map((row) => <div className="detail-row" key={row.label}><span className="detail-label">{row.label}</span><span className="detail-value">{row.value}</span></div>)}</div></>;
  if (to) return <Link to={to} className="panel dashboard-panel-link" aria-label={`View ${locationName} flood map and terrain details`}>{content}</Link>;
  return <div className="panel">{content}</div>;
}

export default LocationDetails;
