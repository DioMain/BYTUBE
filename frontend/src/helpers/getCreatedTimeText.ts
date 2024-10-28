interface timeDefine {
  unit: number;
  manylabel: string;
  onelabel: string;
  twofourlable: string;
}

function getCreatedTimeText(created: string) {
  const relatedRealiseTime = Math.abs(Date.now() - Date.parse(created));

  const timeUnits = [
    {
      unit: 1000 * 60 * 60 * 24 * 30 * 12,
      manylabel: "лет",
      onelabel: "год",
      twofourlable: "года",
    },
    { unit: 1000 * 60 * 60 * 24 * 30, manylabel: "месяцев", onelabel: "месяц", twofourlable: "месяца" },
    { unit: 1000 * 60 * 60 * 24, manylabel: "дней", onelabel: "день", twofourlable: "дня" },
    { unit: 1000 * 60 * 60, manylabel: "часов", onelabel: "час", twofourlable: "часа" },
    { unit: 1000 * 60, manylabel: "минут", onelabel: "минута", twofourlable: "минуты" },
    { unit: 1000, manylabel: "секунд", onelabel: "секунду", twofourlable: "секунды" },
  ] as Array<timeDefine>;

  for (const timeDefine of timeUnits) {
    const value = Math.round(relatedRealiseTime / timeDefine.unit);
    if (value > 4) {
      return `${value} ${timeDefine.manylabel} назад`;
    } else if (value > 1) {
      return `${value} ${timeDefine.twofourlable} назад`;
    } else if (value > 0) {
      return `${value} ${timeDefine.onelabel} назад`;
    }
  }

  return "только что";
}

export default getCreatedTimeText;
