const formatStat = (value, isPercent) => {
  if (isPercent) {
    return (isNaN(value) ? '-' : `${(Math.round(value * 1000) / 10).toFixed(1)} %`);
  }
  return value;
};

export default formatStat;
