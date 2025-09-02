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
export function arrayToTreeArray<T extends TreeNode>(list:T[], key:keyof T, root:T[keyof T]): TreeArray<T> {
  return list
    .filter((item) => item[key] === root)
    .map((item) => ({
      ...item,
      children: arrayToTreeArray(list,key, item[key]),
    }));
}
