import { Link } from 'react-router-dom';
import { getRiskColor } from '../../utils/risk';

function RiskCard({ title, value, subtitle, icon: Icon, tone = 'neutral', to }) {
  const accentColor = getRiskColor(tone);
  const content = <>
    <div className="risk-card-top"><span className="risk-card-title">{title}</span>{Icon && <Icon size={18} />}</div>
    <div className="risk-card-value">{value}</div>
    {subtitle && <div className="risk-card-subtitle">{subtitle}</div>}
  </>;

  if (to) return <Link to={to} className={`risk-card tone-${tone.toLowerCase()} is-clickable`} style={{ '--card-accent': accentColor }} aria-label={`${title}: view details`}>{content}</Link>;
  return <div className={`risk-card tone-${tone.toLowerCase()}`} style={{ '--card-accent': accentColor }}>{content}</div>;
}

export default RiskCard;
