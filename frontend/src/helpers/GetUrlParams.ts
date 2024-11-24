function GetUrlParams(): Map<string, any> {
  const urlObj = URL.parse(window.location.href);
  const resultMap = new Map<string, any>();

  if (urlObj === null) return resultMap;

  urlObj.searchParams.forEach((val, key) => {
    resultMap.set(key, val);
  });

  return resultMap;
}

export default GetUrlParams;
