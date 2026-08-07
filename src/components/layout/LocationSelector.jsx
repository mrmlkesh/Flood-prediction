import { useState } from 'react';
import { Crosshair, MapPinned } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

const distanceInKm = (latitudeOne, longitudeOne, latitudeTwo, longitudeTwo) => {
  const toRadians = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDifference = toRadians(latitudeTwo - latitudeOne);
  const lngDifference = toRadians(longitudeTwo - longitudeOne);
  const formula = Math.sin(latDifference / 2) ** 2 + Math.cos(toRadians(latitudeOne)) * Math.cos(toRadians(latitudeTwo)) * Math.sin(lngDifference / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(formula), Math.sqrt(1 - formula));
};

function LocationSelector() {
  const { locations, selectedLocationId, setSelectedLocationId } = useLocation();
  const [message, setMessage] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage('GPS is not available in this browser. Please choose a monitored location.');
      return;
    }
    setIsLocating(true);
    setMessage('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = locations.map((location) => ({ location, distance: distanceInKm(coords.latitude, coords.longitude, location.lat, location.lng) }))
          .sort((first, second) => first.distance - second.distance)[0];
        setSelectedLocationId(nearest.location.id);
        setMessage(`Showing nearest monitored location: ${nearest.location.shortName} (~${Math.round(nearest.distance)} km away).`);
        setIsLocating(false);
      },
      () => {
        setMessage('Location permission was unavailable. Please choose a monitored location from the list.');
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <div className="location-selector">
      <div className="location-control">
        <MapPinned size={15} />
        <select value={selectedLocationId} onChange={(event) => { setSelectedLocationId(event.target.value); setMessage(''); }} aria-label="Select monitored location">
          {locations.map((location) => <option value={location.id} key={location.id}>{location.name}</option>)}
        </select>
        <button className="gps-button" onClick={useMyLocation} disabled={isLocating} title="Use my location to find the nearest monitored location"><Crosshair size={15} /> {isLocating ? 'Locating…' : 'Use my location'}</button>
      </div>
      {message && <p className="gps-message">{message}</p>}
    </div>
  );
}

export default LocationSelector;
