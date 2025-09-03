import { nanoid } from "nanoid";

export { nanoid };

/**
 * 生成UUID v4格式的唯一标识符
 * @param a 可选的参数，用于递归调用
 * @returns UUID字符串
 */
export function generateUuid(a?: any): string {
  return a
    ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
    : (1e7 + -1e3 + 4e3 + -8e3 + -1e11)
        .toString()
        .replace(/[018]/g, generateUuid);
}
