import { colorNames } from "../constant";

import { getHex, getHsl, getRgb } from "./colord";

/**
 * 根据颜色值获取颜色名称
 * 该函数通过比较给定颜色与预定义颜色集的差异来确定最接近的颜色名称
 * 
 * @param color 颜色值，可以是十六进制、RGB或HSL格式
 * @returns 最接近的颜色名称
 */
export function getColorName(color: string) {
  // 将给定颜色转换为十六进制格式
  const hex = getHex(color);
  // 将给定颜色转换为RGB格式
  const rgb = getRgb(color);
  // 将给定颜色转换为HSL格式
  const hsl = getHsl(color);

  // 初始化差异计算变量
  let ndf = 0;
  let ndf1 = 0;
  let ndf2 = 0;
  // 初始化最接近颜色的索引和差异值
  let cl = -1;
  let df = -1;

  // 初始化颜色名称变量
  let name = "";
  // 遍历预定义颜色集，寻找最接近的颜色名称
  colorNames.some((item, index) => {
    const [hexValue, colorName] = item;
    // 检查颜色是否直接匹配预定义颜色集中的颜色
    const match = hex === hexValue;
    if (match) {
      // 如果匹配，直接返回颜色名称
      name = colorName;
    } else {
      // 如果不匹配，获取当前预定义颜色的RGB和HSL值
      const { b, g, r } = getRgb(hexValue);
      const { h, l, s } = getHsl(hexValue);

      // 计算RGB和HSL空间中的差异
      ndf1 = (rgb.r - r) ** 2 + (rgb.g - g) ** 2 + (rgb.b - b) ** 2;
      ndf2 = (hsl.h - h) ** 2 + (hsl.s - s) ** 2 + (hsl.l - l) ** 2;

      // 综合RGB和HSL差异，计算总差异
      ndf = ndf1 + ndf2 * 2;
      // 如果当前差异更小，则更新最接近颜色的索引和差异值
      if (df < 0 || df > ndf) {
        df = ndf;
        cl = index;
      }
    }
    // 如果找到匹配的颜色，则停止遍历
    return match
  });
  // 如果没有找到匹配的颜色，使用差异最小的颜色作为最接近的颜色
  name=colorNames[cl][1]
  return name;
}
