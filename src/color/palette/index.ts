import type { AnyColor } from "colord";

import { getHex } from "../shared";

import type { ColorPaletteNumber } from "../types";

import { getAntdColorPalette } from "./antd";

import { getRecommendedColorPalette } from "./recommend";

/**
 * 根据给定的颜色获取颜色调板
 * 
 * 此函数接受一个颜色值和一个可选的布尔参数，用于确定是返回推荐的颜色调板还是Ant Design标准颜色调板
 * 推荐的颜色调板是通过特定算法生成的，而非推荐的调板则是基于Ant Design的颜色体系生成的
 * 
 * @param color - 任何类型的颜色值，用于生成颜色调板
 * @param recommended - 可选参数，默认为false如果设置为true，则返回推荐的颜色调板
 * @returns 返回一个Map对象，其中包含颜色调板编号和对应的十六进制颜色值
 */
export function getColorPalette(color: AnyColor, recommended = false) {
  // 创建一个Map实例，用于存储颜色调板编号和对应的十六进制颜色值
  const colorMap = new Map<ColorPaletteNumber, string>();

  // 如果推荐标志为true，则使用推荐的颜色调板
  if (recommended) {
    // 获取推荐颜色调板，并将每个颜色信息添加到colorMap中
    const colorPalette = getRecommendedColorPalette(getHex(color));
    colorPalette.palettes.forEach((palette) => {
      colorMap.set(palette.number, palette.hex);
    });
  } else {
    // 如果不使用推荐颜色调板，则获取Ant Design标准颜色调板
    const colors = getAntdColorPalette(color);

    // 定义Ant Design颜色调板中包含的颜色编号
    const colorNumbers: ColorPaletteNumber[] = [
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ];

    // 遍历颜色编号数组，将每个编号和对应的十六进制颜色值添加到colorMap中
    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index]);
    });
  }

  // 返回包含颜色调板信息的Map对象
  return colorMap;
}

/**
 * 根据颜色和数字获取调色板中的颜色
 * 
 * 此函数通过输入的颜色名称和数字在调色板中查找对应的颜色它首先获取整个颜色调色板，
 * 然后根据提供的数字返回调色板中的特定颜色如果推荐标志设置为true，它将使用推荐的颜色调色板
 * 
 * @param color - 任何颜色类型，表示要获取调色板颜色的基础颜色
 * @param number - 调色板中的颜色编号，用于指定要返回的颜色位置
 * @param recommended - 可选参数，默认为false如果设置为true，表示使用推荐的颜色调色板
 * @returns 返回调色板中与给定数字对应的颜色值如果找不到对应的颜色，将返回undefined
 */
export function getPaletteColorByNumber(
  color: AnyColor,
  number: ColorPaletteNumber,
  recommended = false
) {
  // 获取指定颜色的调色板映射，根据推荐标志决定是否使用推荐调色板
  const colorMap = getColorPalette(color, recommended);

  // 根据提供的数字从调色板映射中获取对应的颜色，这里使用了类型断言和非空断言，因为假设调色板映射中一定包含该数字对应的颜色
  return colorMap.get(number as ColorPaletteNumber)!;
}
