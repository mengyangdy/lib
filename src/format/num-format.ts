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

/**
 * 大数相乘，转化为字符串进行处理
 * @param num1 需要乘的数字
 * @param num2 需要乘的数字
 * @returns 相乘后的结果 类型为字符串
 */
export function bigNumMult(num1: number, num2: number) {
  let stringNum1 = num1.toString();
  let stringNum2 = num2.toString();
  let result = "0";
  let i = stringNum1.length - 1;
  while (i >= 0) {
    let subfixZero = new Array(stringNum1.length - 1 - i).fill("0").join("");
    let sumCount = +stringNum1[i];
    let tempSum = "0";
    while (sumCount > 0) {
      tempSum = bigSum(tempSum, stringNum2);
      sumCount--;
    }
    tempSum = `${tempSum}${subfixZero}`;
    result = bigSum(result, tempSum);
    i--;
  }
  // 处理⼀下开头的零
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== "0") {
      return result.slice(i);
    }
  }
  return "0";

  function bigSum(n1: string, n2: string) {
    let result = "";
    let i = n1.length - 1,
      j = n2.length - 1,
      curry = 0;
    while (i >= 0 || j >= 0) {
      let l1 = i >= 0 ? +n1[i] : 0;
      let l2 = j >= 0 ? +n2[j] : 0;
      let sum = l1 + l2 + curry;
      curry = (sum / 10) | 0;
      result = `${sum % 10}${result}`;
      i--;
      j--;
    }
    if (curry === 1) result = `1${result}`;
    return result;
  }
}

/**
 * 大数相加，转化为字符串进行处理
 * @param num1 需要相加的数字
 * @param num2 需要相加的数字
 * @returns 相加后的结果 类型为字符串
 */
export function bigNumAdd(num1: number, num2: number) {
  let stringNum1 = num1.toString();
  let stringNum2 = num2.toString();
  let result = "";
  let i = stringNum1.length - 1,
    j = stringNum2.length - 1,
    carry = 0;
  while (i >= 0 || j >= 0) {
    let n1 = i >= 0 ? +stringNum1[i] : 0;
    let n2 = j >= 0 ? +stringNum2[j] : 0;
    const temp = n1 + n2 + carry;
    carry = (temp / 10) | 0;
    result = `${temp % 10}${result}`;
    i--;
    j--;
  }
  if (carry === 1) result = `1${result}`;
  return result;
}

/**
 * 截取小数点后的数字，不进行四舍五入
 * @param n
 * @param fixed
 * @returns
 */
/**
 * 将数字格式化为指定小数位数的字符串
 * @param n 要格式化的数字
 * @param fixed 保留的小数位数
 * @returns 格式化后的字符串
 */
export function numToFixed(n: number, fixed: number): string {
  const match = `${n}`.match(new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed}})?`));
  return match ? match[0] : `${n}`;
}

/**
 * 将数字四舍五入到指定小数位数
 * @param n 要四舍五入的数字
 * @param decimals 保留的小数位数
 * @returns 四舍五入后的数字
 */
export function numToRound(n: number, decimals: number = 0): number {
  return Number(`${Math.round(Number(`${n}e${decimals}`))}e-${decimals}`);
}

/**
 * 在数字前面补零 使其位数达到指定长度
 * @param num 要补零的数字
 * @param len 目标长度
 * @param zero 用于填充的字符，默认为 "0"
 * @returns 补零后的字符串
 */
export function replenishZero(
  num: number,
  len: number,
  zero: string = "0"
): string {
  return num.toString().padStart(len, zero);
}
