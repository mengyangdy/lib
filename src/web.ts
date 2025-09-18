/**
 * 重新加载当前页面
 * @returns
 */
export function reloadPage() {
  return location.reload();
}

/**
 * 跳转至页面顶部
 * @returns
 */
export function goToTop() {
  return window.scrollTo(0, 0);
}

/**
 * 平滑滚动到元素的顶部
 * @param element
 */
export function scrollToTop(element: HTMLElement) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/**
 * 平滑滚动到元素的底部
 * @param element
 */
export function scrollToBottom(element: HTMLElement) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}

/**
 * 从文本中移除html标签
 * @param html
 * @returns
 */
export function stripHtml(html: string) {
  // 过滤掉文本中的所有标签
  return (
    new DOMParser().parseFromString(html, "text/html").body.textContent || ""
  );
}

/**
 * 跳转至指定页面
 * @param url
 * @returns
 */
export function goTo(url: string) {
  return (location.href = url);
}

/**
 * 复制文本
 * @param text
 * @returns
 */
export function copy(text: string) {
  return navigator.clipboard?.writeText && navigator.clipboard.writeText(text);
}

/**
 * 获取随机的ip地址
 * @returns
 */
export function randomIp() {
  Array(4)
    .fill(0)
    .map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0))
    .join(".");
}

/**
 * 强制等待
 * @param t 毫秒数
 * @returns
 */
export async function sleep(t: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}
