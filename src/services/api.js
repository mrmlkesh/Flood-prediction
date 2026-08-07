// Replace only these function bodies with fetch() calls when FastAPI is ready.
import { dataStatus, getLocationById } from '../data/mockData';

const mockDelay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 180));
export const getFloodPrediction = (locationId) => mockDelay(getLocationById(locationId).prediction);
export const getFloodMapData = (locationId) => mockDelay(getLocationById(locationId).mapData);
export const getGISData = (locationId) => mockDelay(getLocationById(locationId).gisData);
export const getAlerts = (locationId) => mockDelay(getLocationById(locationId).alerts);
export const getHistoricalData = (locationId) => mockDelay(getLocationById(locationId).historicalData);
export const getDataStatus = () => mockDelay(dataStatus);
