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
export function bigNumMult(num1:number,num2:number){
  let stringNum1 = num1.toString();
  let stringNum2 = num2.toString();
  let result = '0';
	let i = stringNum1.length - 1;
	while (i >= 0) {
		let subfixZero = new Array(stringNum1.length - 1 - i).fill('0').join('');
		let sumCount = +stringNum1[i];
		let tempSum = '0';
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
		if (result[i] !== '0') {
			return result.slice(i);
		}
	}
	return '0';

	function bigSum(n1:string, n2:string) {
		let result = '';
		let i = n1.length - 1,
			j = n2.length - 1,
			curry = 0;
		while (i >= 0 || j >= 0) {
			let l1 = i >= 0 ? +n1[i] : 0;
			let l2 = j >= 0 ? +n2[j] : 0;
			let sum = l1 + l2 + curry;
			curry = sum / 10 | 0;
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
export function bigNumAdd(num1:number, num2:number){
  let stringNum1 = num1.toString();
  let stringNum2 = num2.toString();
  let result = '';
	let i = stringNum1.length - 1,
		j = stringNum2.length - 1,
		carry = 0;
	while (i >= 0 || j >= 0) {
		let n1 = i >= 0 ? +stringNum1[i] : 0;
		let n2 = j >= 0 ? +stringNum2[j] : 0;
		const temp = n1 + n2 + carry;
		carry = temp / 10 | 0;
		result = `${temp % 10}${result}`;
		i--;
		j--;
	}
	if (carry === 1) result = `1${result}`;
	return result;
}
