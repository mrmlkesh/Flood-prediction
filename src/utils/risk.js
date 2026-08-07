export const RISK_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export function getRiskLevel(probability) {
  if (probability >= 0.7) return RISK_LEVELS.HIGH;
  if (probability >= 0.4) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
}

export function formatProbability(probability) {
  return `${Math.round(probability * 100)}%`;
}

export function getSeverity(riskScore) {
  return getRiskLevel(riskScore);
}

export function getRiskColor(level) {
  switch (level) {
    case RISK_LEVELS.HIGH:
      return '#e0433d';
    case RISK_LEVELS.MEDIUM:
      return '#e0a13d';
    case RISK_LEVELS.LOW:
      return '#2fa96b';
    default:
      return '#4a7fc9';
  }
}