import { useEffect, useMemo, useState } from 'react';
import { BellRing, BellOff, RefreshCw } from 'lucide-react';
import AlertCard from '../components/dashboard/AlertCard';
import { getAlerts } from '../services/api';
import { getRiskLevel } from '../utils/risk';
import { useLocation } from '../context/LocationContext';

const filters = ['All', 'High', 'Medium', 'Low'];

function Alerts() {
  const { selectedLocationId, selectedLocation } = useLocation();
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState({});

  const loadAlerts = async () => {
    setIsLoading(true);
    const result = await getAlerts(selectedLocationId);
    setAlerts(result);
    setIsLoading(false);
  };

  useEffect(() => {
    getAlerts(selectedLocationId).then((result) => {
      setAlerts(result);
      setIsLoading(false);
    });
  }, [selectedLocationId]);

  const visibleAlerts = useMemo(() => [...alerts]
    .sort((first, second) => new Date(second.time) - new Date(first.time))
    .filter((alert) => activeFilter === 'All' || getRiskLevel(alert.riskScore) === activeFilter), [alerts, activeFilter]);
  const isSubscribed = Boolean(subscriptions[selectedLocationId]);
  const toggleSubscription = () => setSubscriptions((current) => ({ ...current, [selectedLocationId]: !current[selectedLocationId] }));

  return (
    <div className="page alerts-page">
      <div className="page-heading-row">
        <div>
          <h2>Flood Alerts</h2>
          <p className="page-subtitle">All mock alerts for {selectedLocation.name}, newest first</p>
        </div>
        <button className="secondary-button" onClick={loadAlerts} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'spin' : ''} /> Refresh data
        </button>
      </div>

      <section className="panel alerts-panel">
        <div className="alerts-toolbar">
          <div className="alerts-toolbar-main"><div className="alert-summary"><BellRing size={19} /><span><strong>{visibleAlerts.length}</strong> {activeFilter === 'All' ? 'alerts' : `${activeFilter.toLowerCase()}-risk alerts`}</span></div><div className="subscription-control"><div><strong>Notify me for {selectedLocation.shortName}</strong><span>Demo only — no real notifications are sent.</span></div><button className={`subscription-switch ${isSubscribed ? 'is-on' : ''}`} role="switch" aria-checked={isSubscribed} onClick={toggleSubscription}><span className="switch-knob" />{isSubscribed ? <BellRing size={15} /> : <BellOff size={15} />}</button></div></div>
          <div className="alert-filters" aria-label="Filter alerts by severity">
            {filters.map((filter) => <button key={filter} className={activeFilter === filter ? 'filter-button active' : 'filter-button'} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
          </div>
        </div>

        {isLoading ? <p className="alerts-loading">Loading mock alerts…</p> : (
          <div className="full-alert-list">
            {visibleAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} expandable />)}
            {visibleAlerts.length === 0 && <p className="no-alerts">No alerts match this filter.</p>}
          </div>
        )}
      </section>
    </div>
  );
}

export default Alerts;
