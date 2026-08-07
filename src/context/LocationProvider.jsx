import { useMemo, useState } from 'react';
import { getLocationById, locations } from '../data/mockData';
import { LocationContext } from './LocationContext';

export function LocationProvider({ children }) {
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0].id);
  const value = useMemo(() => ({ locations, selectedLocationId, selectedLocation: getLocationById(selectedLocationId), setSelectedLocationId }), [selectedLocationId]);
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}
