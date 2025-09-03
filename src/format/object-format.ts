/**
 * var entryObj = {
	a: {
		b: {
			c: {
				dd: 'abcdd'
			}
		},
		d: {
			xx: 'adxx'
		},
		e: 'ae'
	}
}

// 要求转换成如下对象
var outputObj = {
	'a.b.c.dd': 'abcdd',
	'a.d.xx': 'adxx',
	'a.e': 'ae'
}  对称嵌套对象扁平化
 * @param obj 嵌套对象
 * @returns 处理后的对象
 */
export function objectflatten<T extends object>(obj: T): Record<string, any> {
  const flatObj: Record<string, any> = {};
  let flag: string | undefined = undefined; // 将null改为undefined并明确类型

  function formatKey(obj: object, keyName?: string): void {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key as keyof object];
        if (typeof value === "object" && value !== null) {
          const newKey = keyName
            ? Array.isArray(obj)
              ? `${keyName}[${key}]`
              : `${keyName}.${key}`
            : key;
          formatKey(value, newKey);
        } else {
          if (!keyName) {
            flatObj[key] = value;
          } else {
            const formattedKey = Array.isArray(obj)
              ? `${keyName}[${key}]`
              : `${keyName}.${key}`;
            flatObj[formattedKey] = value;
          }
        }
      }
    }
  }

  formatKey(obj, flag);
  return flatObj;
}

/**
 * 反转对象的键值对
 * @param obj 要反转的对象
 * @returns 反转后的对象
 */
/**
 * 反转对象的键值对
 * @param obj 要反转的对象
 * @returns 键值对反转后的新对象
 */
export function invertObject<
  T extends Record<string | number, string | number>
>(obj: T): Record<string | number, string | number> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  );
}

/**
 * 从对象中移除空值（null、undefined、空字符串、0、false）
 * @param obj 要处理的对象
 * @returns 移除空值后的新对象
 */
export function removeNullUndefined<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value != null && value !== "" && value !== 0 && value !== false) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * 交换对象的键值对
 * @param obj 要交换键值对的对象
 * @returns 键值对交换后的新对象
 */
export function invert<T extends Record<string, string | number>>(
  obj: T
): Record<string, string> {
  return Object.keys(obj).reduce(
    (res, k) => Object.assign(res, { [obj[k]]: k }),
    {} as Record<string, string>
  );
}

/**
 * 将字符串转换为对象
 * @param str 要转换的字符串
 * @returns 转换后的对象
 */
export function strParse(str: string) {
  return JSON.parse(str.replace(/(\w+)\s*:/g, (_, p1) => `"${p1}":`)).replace(
    /\'/g,
    '"'
  );
}

/**
 * 比较多个对象是否完全一致
 * @param objects 要比较的对象数组
 * @returns 如果所有对象都相等返回 true，否则返回 false
 */
export function isEqual(...objects: any[]): boolean {
  if (objects.length <= 1) return true;
  return objects.every(
    (obj) => JSON.stringify(obj) === JSON.stringify(objects[0])
  );
}
