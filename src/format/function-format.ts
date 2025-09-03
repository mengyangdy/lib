/**
 * 判断函数是否是异步函数
 * @param v 要检查的值
 * @returns 如果是异步函数返回 true，否则返回 false
 */
export function isAsyncFunction(v: unknown): boolean {
  return Object.prototype.toString.call(v) === "[object AsyncFunction]";
}


