export function isObject(originValue: any) {
  return typeof originValue === "object" && originValue !== null;
}

export function isPC() {
  const agents = [
    "Android",
    "iPhone",
    "webOS",
    "BlackBerry",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  return !agents.includes(window.navigator.userAgent);
}
