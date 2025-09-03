/**
 * 将10进制数转换为n进制数
 * @param num
 * @param n
 * @returns
 */
export function toDecimal(num: number, n: number = 2): string {
  return num.toString(n);
}

/**
 * 将n进制数转换为10进制数
 * @param num 要转换的字符串
 * @param n 进制
 * @returns 转换后的数字
 */
export function toDecimalism(num: string, n: number = 10): number {
  return parseInt(num, n);
}


