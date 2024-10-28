function getCreatedTimeText(created: string) {
  const relatedRealiseTime = Math.abs(Date.now() - Date.parse(created));

  const timeUnits = [
    { unit: 1000 * 60 * 60 * 24 * 30 * 12, label: "лет" },
    { unit: 1000 * 60 * 60 * 24 * 30, label: "месяцев" },
    { unit: 1000 * 60 * 60 * 24, label: "дней" },
    { unit: 1000 * 60 * 60, label: "часов" },
    { unit: 1000 * 60, label: "минут" },
    { unit: 1000, label: "секунд" },
  ];

  for (const { unit, label } of timeUnits) {
    const value = Math.round(relatedRealiseTime / unit);
    if (value > 0) {
      return `${value} ${label} назад`;
    }
  }

  return "только что";
}

export default getCreatedTimeText;
