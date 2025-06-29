
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
export function maxChatNumTime(str: string) {
  const obj = {};
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    if (obj[char]) {
      obj[char]++;
    } else {
      obj[char] = 1;
    }
  }
  //统计出来最大值
  let max = 0;
  for (let key in obj) {
    if (max < obj[key]) {
      max = obj[key];
    }
  }
  //拿最大值去对比
  for (let key in obj) {
    if (obj[key] === max) {
      console.log("最多的字符是" + key);
      console.log("出现的次数是" + max);
    }
  }
}
