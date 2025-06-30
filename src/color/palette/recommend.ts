import { colorPalettes } from "../constant";
import {
  getColorName,
  getDeltaE,
  getHsl,
  isValidColor,
  transformHslToHex,
} from "../shared";
import { ColorPalette, ColorPaletteFamily, ColorPaletteFamilyWithNearestPalette, ColorPaletteMatch, ColorPaletteNumber } from "../types";

/**
 * 根据给定的颜色获取推荐的颜色调板
 * 
 * 此函数首先根据输入的颜色确定一个推荐的颜色调板系列，然后创建一个映射，
 * 将颜色调板中的每个颜色与其编号关联起来通过这种方式，可以轻松地访问和操作颜色调板中的颜色
 * 
 * @param color 输入颜色，用于确定推荐的颜色调板系列
 * @returns 返回一个包含推荐颜色调板信息的对象，包括主颜色和匹配颜色
 */
export function getRecommendedColorPalette(color: string) {
  // 获取推荐的颜色调板系列
  const colorPaletteFamily = getRecommendedColorPaletteFamily(color);
  // 创建一个映射，用于存储颜色调板编号和颜色对象之间的映射关系
  const colorMap = new Map<ColorPaletteNumber, ColorPalette>();

  // 遍历颜色调板系列中的所有颜色，并将其添加到映射中
  colorPaletteFamily.palettes.forEach((palette) => {
    colorMap.set(palette.number, palette);
  });
  // 获取主颜色，即编号为500的颜色
  const mainColor = colorMap.get(500)!;
  // 查找与输入颜色匹配的颜色对象
  const matchColor = colorPaletteFamily.palettes.find(
    (palette) => palette.hex === color
  )!;
  // 构建最终的颜色调板对象，包括颜色调板系列、颜色映射、主颜色和匹配颜色
  const colorPalette: ColorPaletteMatch = {
    ...colorPaletteFamily,
    colorMap,
    main: mainColor,
    match: matchColor,
  };
  // 返回最终的颜色调板对象
  return colorPalette;
}

/**
 * 根据给定的颜色获取推荐的颜色调色板系列
 * @param color 输入的颜色值，可以是十六进制、RGB或颜色名称
 * @returns 返回一个包含颜色调色板信息的对象
 * @throws 如果输入的颜色值无效，则抛出错误
 */
export function getRecommendedColorPaletteFamily(color: string) {
  // 检查输入颜色是否有效，如果无效则抛出错误
  if (!isValidColor(color)) {
    throw new Error("Invalid color,please check color value!");
  }

  // 获取颜色的名称，并将其转换为小写，空格替换为短横线
  let colorName = getColorName(color);
  colorName = colorName.toLowerCase().replace(/\s/g, "-");

  // 获取输入颜色的HSL值
  const { h: h1, s: s1 } = getHsl(color);

  // 获取最接近的颜色调色板系列及其最近的明度调色板
  const { nearestLightnessPalette, palettes } = getNearestColorPaletteFamily(
    color,
    colorPalettes
  );

  // 解构出最近的明度调色板的十六进制值和编号
  const { hex, number } = nearestLightnessPalette;

  // 获取最近的明度调色板的HSL值
  const { h: h2, s: s2 } = getHsl(hex);

  // 计算输入颜色与最近的明度调色板的色相差异
  const deltaH = h1 - h2;

  // 计算输入颜色与最近的明度调色板的饱和度比例
  const sRatio = s1 / s2;

  // 构建颜色调色板系列对象
  const colorPaletteFamily: ColorPaletteFamily = {
    name: colorName,
    palettes: palettes.map((palette) => {
      let hexValue = color;

      // 判断当前调色板是否与最近的明度调色板相同
      const isSame = number === palette.number;

      // 如果不相同，则根据色相差异和饱和度比例计算新的HSL值，并转换为十六进制
      if (!isSame) {
        const { h: h3, l, s: s3 } = getHsl(palette.hex);

        const newH = deltaH < 0 ? h3 + deltaH : h3 - deltaH;
        const newS = s3 * sRatio;

        hexValue = transformHslToHex({
          h: newH,
          l,
          s: newS,
        });
      }

      // 返回调色板的十六进制值和编号
      return {
        hex: hexValue,
        number: palette.number,
      };
    }),
  };

  // 返回颜色调色板系列对象
  return colorPaletteFamily;
}

/**
 * 根据颜色和数字获取推荐的调色板颜色
 * 
 * 此函数旨在通过提供一个颜色和一个代表调色板位置的数字，
 * 返回调色板中相应位置的颜色的十六进制值这有助于在界面上
 * 一致地应用颜色主题和样式
 * 
 * @param color - 用户界面元素的基本颜色
 * @param number - 代表调色板中特定颜色的数字
 * @returns 返回调色板中与给定数字对应的颜色的十六进制值
 */
export function getRecommendedPaletteColorByNumber(
  color: string,
  number: ColorPaletteNumber
) {
  // 获取指定颜色的推荐调色板
  const colorPalette = getRecommendedColorPalette(color);
  
  // 从调色板的映射中获取与给定数字对应的颜色的十六进制值
  const { hex } = colorPalette.colorMap.get(number)!;
  
  // 返回获取到的颜色十六进制值
  return hex;
}

/**
 * 获取最接近的颜色色板家族
 * 
 * 该函数通过计算给定颜色与每个色板家族中颜色的差异，找到整体上最接近的色板家族，以及在该家族中最接近的颜色
 * 它首先计算每个家族中每个颜色与给定颜色的差异，然后找到差异最小的颜色，最后确定哪个家族的差异最小
 * 
 * @param color - 需要匹配的十六进制颜色字符串
 * @param families - 色板家族数组，每个家族包含一组颜色
 * @returns 返回最接近的色板家族信息，包括家族中最接近的颜色和亮度最接近的颜色
 */
function getNearestColorPaletteFamily(
  color: string,
  families: ColorPaletteFamily[]
) {
  // 对每个色板家族进行映射，添加每个颜色与给定颜色的差异值
  const familyWithConfig = families.map((family) => {
    // 对家族中的每个颜色计算与给定颜色的差异
    const palettes = family.palettes.map((palette) => {
      return {
        ...palette,
        delta: getDeltaE(color, palette.hex),
      };
    });

    // 找到家族中与给定颜色差异最小的颜色
    const nearestPalette = palettes.reduce((prev, curr) =>
      prev.delta < curr.delta ? prev : curr
    );

    // 返回包含差异最小颜色和所有颜色的家族信息
    return {
      ...family,
      nearestPalette,
      palettes,
    };
  });

  // 在所有家族中找到差异最小的颜色所在的家族
  const nearestPaletteFamily = familyWithConfig.reduce((prev, curr) =>
    prev.nearestPalette.delta < curr.nearestPalette.delta ? prev : curr
  );

  // 获取给定颜色的亮度
  const { l } = getHsl(color);

  // 构建包含最接近颜色和亮度最接近颜色的色板家族对象
  const paletteFamily: ColorPaletteFamilyWithNearestPalette = {
    ...nearestPaletteFamily,
    nearestLightnessPalette: nearestPaletteFamily.palettes.reduce(
      (prev, curr) => {
        // 获取前后颜色的亮度
        const { l: prevLightness } = getHsl(prev.hex);
        const { l: currLightness } = getHsl(curr.hex);

        // 计算亮度差异
        const deltaPrev = Math.abs(prevLightness - l);
        const deltaCurr = Math.abs(currLightness - l);

        // 返回亮度差异最小的颜色
        return deltaPrev < deltaCurr ? prev : curr;
      }
    ),
  };

  // 返回构建的色板家族对象
  return paletteFamily;
}
