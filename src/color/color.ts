/**
 * hex转rgb方法
 * @param hex 颜色值
 * @returns 对象格式rgb每个值 需要拼接
 */
export function hexToRgb(hex:string) {
  // 去除可能的井号 (#)
  hex = hex.replace('#', '')

  // 处理3位简写形式
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  // 分解Hex字符串并转换为RGB
  var bigint = parseInt(hex, 16)
  var r = (bigint >> 16) & 255
  var g = (bigint >> 8) & 255
  var b = bigint & 255

  return { r: r, g: g, b: b } // 返回对象形式，也可以返回数组或字符串形式，根据需要调整
}