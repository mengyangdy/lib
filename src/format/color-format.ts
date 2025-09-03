/**
 * 获取随机颜色
 * @returns
 */
export function getRandomColor() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
}

/**
 * 将RGB颜色值转换为十六进制颜色值
 * @param r 红色分量 (0-255)
 * @param g 绿色分量 (0-255)
 * @param b 蓝色分量 (0-255)
 * @returns 十六进制颜色字符串，格式为 #RRGGBB
 */
export function rgbToHex(r: number, g: number, b: number): string {
  // 确保RGB值在有效范围内
  const clamp = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)));

  const clampedR = clamp(r);
  const clampedG = clamp(g);
  const clampedB = clamp(b);

  // 使用位运算将RGB值组合成32位整数，然后转换为十六进制
  // (1 << 24) 确保结果总是7位十六进制数
  // (r << 16) 红色分量左移16位
  // (g << 8) 绿色分量左移8位
  // b 蓝色分量
  const hex = ((1 << 24) + (clampedR << 16) + (clampedG << 8) + clampedB)
    .toString(16)
    .slice(1); // 移除开头的1，得到6位十六进制数

  return `#${hex}`;
}
