// Old saved holdings can contain the buy price as a placeholder until their first refresh.
export function hasEstimate(holding) {
  return Boolean(holding.lastUpdated) && Number.isFinite(holding.currentPrice) && holding.currentPrice > 0;
}

export function summarizePortfolio(holdings) {
  if (!holdings.length || !holdings.every(hasEstimate)) return null;
  const rows = holdings.map(h => {
    const invested = h.quantity * h.buyPrice;
    const current = h.quantity * h.currentPrice;
    return {symbol: h.symbol, invested, current, pl: current - invested, plPercent: 100 * (current - invested) / invested};
  });
  const totalInvested = rows.reduce((sum, h) => sum + h.invested, 0);
  const totalCurrent = rows.reduce((sum, h) => sum + h.current, 0);
  const totalPL = totalCurrent - totalInvested;
  return {totalInvested, totalCurrent, totalPL, totalPLPercent: 100 * totalPL / totalInvested, holdings: rows};
}

export function evaluateAlert(rule, estimate, checkedAt) {
  if (rule.triggered || !Number.isFinite(estimate) || estimate <= 0) return rule;
  const baseline = rule.baselineEstimate ?? estimate;
  const change = 100 * (estimate - baseline) / baseline;
  const triggered = (rule.condition === 'above' && estimate >= rule.price) ||
    (rule.condition === 'below' && estimate <= rule.price) ||
    (rule.condition === 'change_up' && change >= rule.percentage) ||
    (rule.condition === 'change_down' && change <= -rule.percentage);
  if (triggered) return {...rule, baselineEstimate: baseline, triggered: true, triggeredPrice: estimate, triggeredAt: checkedAt, status: 'triggered'};
  return {...rule, baselineEstimate: baseline};
}
