/**
 * 找出字符串出现最多次数的字符以及次数
 * 思路：
 * 1. 先遍历字符串，将每个字符作为key，出现的次数作为value存入对象中
 * 2. 遍历对象，找到最大值
 * 3. 遍历对象，找到最大值对应的key
 * 4. 返回最大值对应的key和最大值
 * 5. 时间复杂度：O(n)
 * @param str 字符串
 */
/**
 * 找出字符串中出现最多次数的字符及次数
 * @param str 要分析的字符串
 * @returns 返回包含最多字符和次数的对象数组
 */
export function maxChatNumTime(
  str: string
): Array<{ char: string; count: number }> {
  const charCount: Record<string, number> = {};

  // 统计每个字符的出现次数
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // 找出最大出现次数
  const maxCount = Math.max(...Object.values(charCount));

  // 找出所有出现次数最多的字符
  const maxChars = Object.entries(charCount)
    .filter(([, count]) => count === maxCount)
    .map(([char, count]) => ({ char, count }));

  return maxChars;
}

/**
 * 将字符串首字母大写
 * @param str 字符串
 * @returns 首字母大写后的字符串
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 反转字符串
 * @param str 字符串
 * @returns 反转后的字符串
 */
export function reverseString(str: string) {
  return str.split("").reverse().join("");
}

/**
 * 判断字符串是否是回文
 * @param str 字符串
 * @returns 是否是回文
 */
export function isPalindrome(str: string) {
  return str === str.split("").reverse().join("");
}
