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
        if (typeof value === 'object' && value !== null) {
          const newKey = keyName ? 
            (Array.isArray(obj) ? `${keyName}[${key}]` : `${keyName}.${key}`) : 
            key;
          formatKey(value, newKey);
        } else {
          if (!keyName) {
            flatObj[key] = value;
          } else {
            const formattedKey = Array.isArray(obj) ? 
              `${keyName}[${key}]` : 
              `${keyName}.${key}`;
            flatObj[formattedKey] = value;
          }
        }
      }
    }
  }

  formatKey(obj, flag);
  return flatObj;
}