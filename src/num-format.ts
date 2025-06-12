/** 
 * 数字千分位分割
 * 格式化数字，每三位数字用逗号分隔，保留两位小数
 * @param num 要格式化的数字
 * @returns 格式化后的字符串
 */
export function numThousandthFormat(num: number) {
  const number = num.toString();
  let decimals = "";
  // 更精确地分割整数和小数部分
  const parts = number.split(".");
  const integerPart = parts[0];
  decimals = parts.length > 1 ? "." + parts[1] : "";
  let len = integerPart.length;
  if (len < 3) {
    return integerPart + decimals;
  } else {
    let temp = decimals; // 直接使用decimals，因为它可能为空或包含小数部分
    let remainder = len % 3;

    let formattedInteger = "";

    if (remainder > 0) {
      formattedInteger =
        integerPart.slice(0, remainder) +
        "," +
        integerPart.slice(remainder).match(/\d{3}/g)!.join(",");
    } else {
      formattedInteger = integerPart.match(/\d{3}/g)!.join(",");
    }

    return formattedInteger + temp;
  }
}
