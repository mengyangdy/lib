// 定义树形节点接口
interface TreeNode<T = unknown> {
  [key: string]: T;
}

// 定义带children的树形结构类型
type TreeArray<T extends TreeNode> = Array<T & { children: TreeArray<T> }>;

/**
 * 将一维数组转化为带children的树形数组 用于table等数据展示
 * @param list 需要转化的数组
 * @param key 父级id是哪个字段
 * @param root 根节点的id
 * @returns 树形数组
 */
export function arrayToTreeArray<T extends TreeNode>(
  list: T[],
  key: keyof T,
  root: T[keyof T]
): TreeArray<T> {
  return list
    .filter((item) => item[key] === root)
    .map((item) => ({
      ...item,
      children: arrayToTreeArray(list, key, item[key]),
    }));
}

/**
 * 将多维数组扁平化
 * @param arr 多维数组
 * @returns 扁平化后的数组
 */
export function flattenArray<T>(arr: T[][]): T[] {
  return arr.reduce((a, v) => a.concat(v), []);
}

/**
 * 从数组中移除假值
 * @param arr 数组
 * @returns 移除假值后的数组
 */
export function compact(arr: any[]): any[] {
  return arr.filter(Boolean);
}

/**
 * 创建一个从0到n-1的组成的数组
 * @param n 长度
 * @returns 从0-n的数组
 */
export function createArray(n: number) {
  return Array.from(new Array(n), (v, i) => i);
}

/**
 * 随机排序数组
 * @param arr 数组
 * @returns 随机排序后的数组
 */
export function randomSort(arr: any[]): any[] {
  return arr.sort(() => Math.random() - 0.5);
}

/**
 * 移除数组中的重复值
 * @param arr 数组
 * @returns 移除重复值后的数组
 */
export function removeDuplicates(arr: any[]): any[] {
  return [...new Set(arr)];
}

/**
 * 根据某个键值对数组进行去重
 * @param arr 数组
 * @param key 键值
 * @returns 去重后的数组
 */
export function duplicateByKey(arr: any[], key: string): any[] {
  return [
    ...arr.reduce((prev, cur) => prev.set(cur[key], cur), new Map()).values(),
  ];
}

/**
 * 找到多个数组的交集
 * @param a 数组
 * @param arr 数组
 * @returns 交集
 */
export function intersection(a: any[], ...arr: any[]): any[] {
  return [...new Set(a)].filter((v) => arr.every((b) => b.includes(v)));
}

/**
 * 找到数组中最大值的索引
 * @param arr 数组
 * @returns 最大值的索引
 */
/**
 * 找出数组中最大值的索引
 * @param arr 数字数组
 * @returns 最大值的索引，如果数组为空返回 -1
 */
export function indexOfMax(arr: number[]): number {
  if (arr.length === 0) return -1;
  return arr.reduce((prev, curr, i, a) => (curr > a[prev] ? i : prev), 0);
}

/**
 * 找出数组中最小值的索引
 * @param arr 数字数组
 * @returns 最小值的索引，如果数组为空返回 -1
 */
export function indexOfMin(arr: number[]): number {
  if (arr.length === 0) return -1;
  return arr.reduce((prev, curr, i, a) => (curr < a[prev] ? i : prev), 0);
}

/**
 * 找到数组中与给定数字最接近的值
 * @param arr 数字数组
 * @param n 给定数字
 * @returns 最接近的数字
 */
export function closest(arr: number[], n: number): number {
  if (arr.length === 0) throw new Error("数组不能为空");
  return arr.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
  );
}

/**
 * 将多个数组组合成一个数组
 * @param arr 多个数组
 * @returns 组合后的数组
 */
export function zipArr<T>(...arr: T[][]): T[][] {
  if (arr.length === 0) return [];
  return Array.from({ length: Math.max(...arr.map((a) => a.length)) }, (_, i) =>
    arr.map((a) => a[i])
  );
}

/**
 * 转置矩阵的行和列
 * @param matrix 二维数组（矩阵）
 * @returns 转置后的矩阵
 */
export function transpose<T>(matrix: T[][]): T[][] {
  if (matrix.length === 0 || matrix[0].length === 0) return [];
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}
