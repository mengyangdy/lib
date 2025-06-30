import { colord, extend } from "colord";

import type { AnyColor, HslColor, RgbColor } from "colord";

import labPlugin from "colord/plugins/lab";
import mixPlugin from "colord/plugins/mix";
import namesPlugin from "colord/plugins/names";

extend([labPlugin, mixPlugin, namesPlugin]);

/**
 * 判断传入的颜色值是否合法
 * @param color 任意颜色格式
 * @returns 布尔值（true 表示是合法颜色，false 表示不是合法颜色）
 */
export function isValidColor(color: AnyColor) {
  return colord(color).isValid();
}

/**
 * 将传入的颜色值转换为十六进制的颜色字符串（hex格式的）
 * @param color 任意颜色格式
 * @returns 十六进制的颜色字符串（hex格式）
 */
export function getHex(color: AnyColor) {
  return colord(color).toHex();
}

/**
 * 将传入的颜色值转换为 RGB 格式的对象并返回
 * @param color 任意颜色格式
 * @returns RGB 格式的对象
 */
export function getRgb(color: AnyColor) {
  return colord(color).toRgb();
}

/**
 * 将给定的颜色转换为HSL格式
 *
 * @param color - 任意颜色值，可以是字符串、对象等，具体取决于colord库的支持
 * @returns 返回转换后的HSL颜色字符串
 */
export function getHsl(color: AnyColor) {
  // 使用colord库将输入的颜色转换为HSL格式
  return colord(color).toHsl();
}

/**
 * 将给定的颜色转换为HSV色彩空间
 *
 * @param color - 任意颜色值，可以是字符串、对象等，具体取决于colord库的支持
 * @returns 返回转换后的HSV色彩值，具体格式取决于colord库的实现
 *
 * 此函数利用colord库进行颜色转换，选择HSV作为目标色彩空间HSV（Hue, Saturation, Value）是一种常用的色彩表示法，
 * 常用于颜色的选取和处理在许多图形处理场景中，HSV模型比RGB模型更直观，因为它更接近人类对颜色的感知方式
 */
export function getHsv(color: AnyColor) {
  return colord(color).toHsv();
}

/**
 * 计算两种颜色之间的外观差异。
 * 该函数使用 [colord](file://c:\Users\my466\Desktop\my\lib\node_modules\colord) 库来计算两种颜色之间的 Delta E 值，这是一种衡量颜色外观差异的标准。
 * Delta E 值可以用来评估两种颜色在视觉上的相似程度，数值越大表示差异越明显。
 *
 * @param color1 第一种颜色，可以是任意颜色表示格式。
 * @param color2 第二种颜色，同样可以是任意颜色表示格式。
 * @returns 返回两种颜色之间的 Delta E 值，表示颜色外观的差异程度。
 */
export function getDeltaE(color1: AnyColor, color2: AnyColor) {
  return colord(color1).delta(color2);
}

/**
 * 将HSL颜色转换为十六进制颜色
 * @param color - HSL格式的颜色，如"hsl(120, 100%, 50%)"
 * @returns 返回转换后的十六进制颜色字符串，如"#00ff00"
 */
export function transformHslToHex(color: HslColor) {
  // 使用colord库进行颜色格式转换
  return colord(color).toHex();
}

/**
 * 给颜色添加透明度
 *
 * 该函数接受一个颜色值和一个透明度值作为参数，返回添加了指定透明度的十六进制颜色值
 * 它使用了colord库来处理颜色，首先将输入的颜色转换为带有透明度的颜色，然后将其转换为十六进制格式
 *
 * @param color - 任何格式的颜色值，如名称、十六进制、RGB等
 * @param alpha - 透明度值，范围从0（完全透明）到1（完全不透明）
 * @returns 返回带有指定透明度的十六进制颜色值
 */
export function addColorAlpha(color: AnyColor, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}

/**
 * 混合两种颜色
 *
 * 此函数接受两种颜色和一个比例作为参数，然后将这两种颜色按照给定的比例进行混合
 * 使用colord库来处理颜色混合和转换操作，最终以十六进制字符串的形式返回混合后的颜色
 *
 * @param firstColor 第一种颜色，可以是任何colord库支持的颜色格式
 * @param secondColor 第二种颜色，同样可以是任何colord库支持的颜色格式
 * @param ratio 第二种颜色在混合结果中的比例，范围从0到1，决定了两种颜色的混合程度
 * @returns 以十六进制字符串形式返回混合后的颜色
 */
export function mixColor(
  firstColor: AnyColor,
  secondColor: AnyColor,
  ratio: number
) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}

/**
 * 将给定颜色与背景色按指定透明度混合，生成新的颜色值
 *
 * @param color 原始颜色值
 * @param alpha 透明度，取值范围为0到1
 * @param bgColor 背景颜色值，默认为白色
 * @returns 返回混合后的颜色的十六进制表示
 */
export function transformColorWithOpacity(
  color: string,
  alpha: number,
  bgColor = "#ffffff"
) {
  // 为原始颜色添加透明度
  const originColor = addColorAlpha(color, alpha);

  // 解构原始颜色的RGB值
  const { b: oB, g: oG, r: oR } = colord(originColor).toRgb();

  // 解构背景颜色的RGB值
  const { b: gbB, g: gbG, r: bgR } = colord(bgColor).toRgb();

  /**
   * 计算混合后的RGB值
   *
   * @param or 原始颜色的某个RGB通道值
   * @param bg 背景颜色的对应RGB通道值
   * @param al 透明度
   * @returns 返回混合后的RGB通道值
   */
  function calRgb(or: number, bg: number, al: number) {
    return bg + (or - bg) * al;
  }

  // 计算混合后的RGB值
  const resultRgb: RgbColor = {
    b: calRgb(oB, gbB, alpha),
    g: calRgb(oG, gbG, alpha),
    r: calRgb(oR, bgR, alpha),
  };

  // 将混合后的RGB值转换为十六进制表示并返回
  return colord(resultRgb).toHex();
}

/**
 * 判断给定颜色是否为白色
 *
 * 该函数使用 colord 库来处理颜色比较它接受任何颜色格式作为输入，
 * 并将其与白色 (#ffffff) 进行比较以判断是否相等
 *
 * @param color {AnyColor} - 待检查的颜色，可以是任何 colord 支持的颜色格式
 * @returns {boolean} - 如果给定颜色是白色，则返回 true；否则返回 false
 */
export function isWhiteColor(color: AnyColor) {
  return colord(color).isEqual("#ffffff");
}

export { colord };
