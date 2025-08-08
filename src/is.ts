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
export function isFunction(value: unknown): value is (...args: any) => any {
  return typeof value === "function";
}

export const isBrowser = Boolean(
  typeof window !== "undefined" &&
    window.document &&
    window.document.createElement
);
