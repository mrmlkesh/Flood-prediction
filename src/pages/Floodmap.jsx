import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hospital, MapPin, RefreshCw, Route, School } from 'lucide-react';
import { getFloodMapData } from '../services/api';
import { formatProbability, getRiskColor, getRiskLevel } from '../utils/risk';
import { useLocation } from '../context/LocationContext';

const markerSymbols = { school: 'S', hospital: 'H', road: 'R' };
const markerLabels = { school: 'School', hospital: 'Hospital', road: 'Road' };

function createMarkerIcon(type, riskLevel) {
  const color = getRiskColor(riskLevel);
  return L.divIcon({
    className: 'map-marker-icon',
    html: `<span style="background:${color}">${markerSymbols[type]}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapRecenter({ position }) {
  const map = useMap();
  useEffect(() => { map.setView(position, 13); }, [map, position]);
  return null;
}

function FloodMap() {
  const { selectedLocationId } = useLocation();
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [visibleLayers, setVisibleLayers] = useState({ zones: true, extent: true, school: true, hospital: true, road: true });

  const loadMapData = async () => {
    setIsLoading(true);
    const result = await getFloodMapData(selectedLocationId);
    setMapData(result);
    setLastRefreshed(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    getFloodMapData(selectedLocationId).then((result) => {
      setMapData(result);
      setLastRefreshed(new Date());
      setIsLoading(false);
    });
  }, [selectedLocationId]);

  if (isLoading || !mapData) {
    return <div className="page"><h2>Flood Map</h2><p>Loading mock map data…</p></div>;
  }

  return (
    <div className="page flood-map-page">
      <div className="page-heading-row">
        <div>
          <h2>Flood Map</h2>
          <p className="page-subtitle">Interactive mock map for {mapData.selectedLocation.name}</p>
        </div>
        <button className="secondary-button" onClick={loadMapData} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> Refresh data
        </button>
      </div>

      <div className="map-layout">
        <section className="panel map-panel">
          <MapContainer center={[mapData.selectedLocation.lat, mapData.selectedLocation.lng]} zoom={13} scrollWheelZoom className="flood-map">
            <MapRecenter position={[mapData.selectedLocation.lat, mapData.selectedLocation.lng]} />
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker center={[mapData.selectedLocation.lat, mapData.selectedLocation.lng]} radius={9} pathOptions={{ color: '#174a7c', fillColor: '#ffffff', fillOpacity: 1, weight: 3 }}>
              <Popup><strong>Selected location</strong><br />{mapData.selectedLocation.name}</Popup>
            </CircleMarker>
            {visibleLayers.extent && <Polygon positions={mapData.floodExtent.coordinates} pathOptions={{ color: '#287fd6', fillColor: '#51a8ef', fillOpacity: 0.25, dashArray: '6 6', weight: 2 }}>
              <Popup><strong>{mapData.floodExtent.label}</strong><br />Illustrative mock data only.</Popup>
            </Polygon>}
            {visibleLayers.zones && mapData.zones.map((zone) => {
              const riskLevel = getRiskLevel(zone.riskScore);
              const color = getRiskColor(riskLevel);
              return <Polygon key={zone.id} positions={zone.coordinates} pathOptions={{ color, fillColor: color, fillOpacity: 0.32, weight: 2 }}>
                <Popup><strong>{zone.name}</strong><br />Risk: <b style={{ color }}>{riskLevel}</b> ({formatProbability(zone.riskScore)})</Popup>
              </Polygon>;
            })}
            {mapData.markers.filter((marker) => visibleLayers[marker.type]).map((marker) => {
              const riskLevel = getRiskLevel(marker.riskScore);
              return <Marker key={marker.id} position={marker.position} icon={createMarkerIcon(marker.type, riskLevel)}>
                <Popup><strong>{marker.name}</strong><br />Type: {markerLabels[marker.type]}<br />Risk: <b style={{ color: getRiskColor(riskLevel) }}>{riskLevel}</b> ({formatProbability(marker.riskScore)})</Popup>
              </Marker>;
            })}
          </MapContainer>
          <p className="map-disclaimer">Map layers and risk values are mock data for interface testing only; they are not live satellite or warning information.</p>
        </section>

        <aside className="map-sidebar">
          <div className="panel">
            <h3 className="panel-title">Map legend</h3>
            {['High', 'Medium', 'Low'].map((level) => <div className="legend-row" key={level}><span className="legend-swatch" style={{ background: getRiskColor(level) }} />{level} risk zone</div>)}
            <div className="legend-row"><span className="extent-swatch" /> Estimated flood extent</div>
          </div>
          <div className="panel layer-panel">
            <h3 className="panel-title">Layers</h3>
            {[{ key: 'zones', label: 'Risk zones' }, { key: 'extent', label: 'Flood extent' }, { key: 'school', label: 'Schools' }, { key: 'hospital', label: 'Hospitals' }, { key: 'road', label: 'Roads' }].map((layer) => <label className="layer-toggle" key={layer.key}><input type="checkbox" checked={visibleLayers[layer.key]} onChange={(event) => setVisibleLayers((current) => ({ ...current, [layer.key]: event.target.checked }))} /><span>{layer.label}</span></label>)}
          </div>
          <div className="panel">
            <h3 className="panel-title">Important locations</h3>
            <div className="location-type"><School size={17} /> Schools</div>
            <div className="location-type"><Hospital size={17} /> Hospitals</div>
            <div className="location-type"><Route size={17} /> Roads</div>
            <p className="map-help"><MapPin size={15} /> Select any zone or marker on the map to view its details.</p>
          </div>
          <div className="panel map-status-panel"><span>Mock data refreshed</span><strong>{lastRefreshed?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</strong></div>
        </aside>
      </div>
    </div>
  );
}

export default FloodMap;
