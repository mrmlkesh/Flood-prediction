import { useState } from 'react';
import { AlertTriangle, ChevronDown, MapPin, ShieldCheck } from 'lucide-react';
import { getRiskColor, getRiskLevel } from '../../utils/risk';

function AlertCard({ alert, expandable = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const severity = getRiskLevel(alert.riskScore);
  const severityColor = getRiskColor(severity);
  const time = new Date(alert.time).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  if (!expandable) {
    return (
      <div className={`alert-card severity-${severity.toLowerCase()}`} style={{ '--alert-color': severityColor }}>
        <AlertTriangle size={16} />
        <div className="alert-body"><div className="alert-header"><span className="alert-title">{alert.title}</span><span className="alert-severity" style={{ color: severityColor }}>{severity}</span></div><div className="alert-location">{alert.location}</div><div className="alert-time">{time}</div></div>
      </div>
    );
  }

  return (
    <article className={`full-alert-card ${isExpanded ? 'is-expanded' : ''}`} style={{ '--alert-color': severityColor }}>
      <button className="full-alert-main" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <span className="alert-icon-wrap" style={{ backgroundColor: `${severityColor}18`, color: severityColor }}><AlertTriangle size={20} /></span>
        <span className="full-alert-content">
          <span className="full-alert-topline"><span className="full-alert-title">{alert.title}</span><span className="full-alert-severity" style={{ backgroundColor: `${severityColor}18`, color: severityColor }}>{severity}</span></span>
          <span className="full-alert-meta"><span><MapPin size={14} /> {alert.location}</span><span>{time}</span></span>
        </span>
        <ChevronDown size={19} className={isExpanded ? 'chevron-open' : ''} />
      </button>
      {isExpanded && <div className="recommended-action"><ShieldCheck size={18} /><div><strong>Recommended action</strong><p>{alert.recommendedAction}</p></div></div>}
    </article>
  );
}

export default AlertCard;
