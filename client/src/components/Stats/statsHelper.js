const formatStat = (value, isPercent) => (isPercent ? `${(Math.round(value * 1000) / 10).toFixed(1)} %` : value);

export default formatStat;
