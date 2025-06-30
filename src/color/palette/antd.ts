import type { AnyColor, HsvColor } from "colord";

import { getHex, getHsv, isValidColor, mixColor } from "../shared";

import type { ColorIndex } from "../types";

/** Hue step */
const hueStep = 2;
/** Saturation step, light color part */
const saturationStep = 16;
/** Saturation step, dark color part */
const saturationStep2 = 5;
/** Brightness step, light color part */
const brightnessStep1 = 5;
/** Brightness step, dark color part */
const brightnessStep2 = 15;
/** Light color count, main color up */
const lightColorCount = 5;
/** Dark color count, main color down */
const darkColorCount = 4;

/**
 * 根据颜色和索引获取Ant Design调色板中的颜色
 * 
 * 此函数旨在通过指定的颜色和索引值来获取Ant Design调色板中对应的颜色值
 * 它首先验证输入颜色是否有效，然后根据索引值计算并返回相应的颜色值
 * 
 * @param color - 任意颜色值，可以是Hex、RGB、HSB等格式
 * @param index - 颜色索引，表示在调色板中的位置，范围为1到10
 * @returns 返回对应索引的颜色值，格式为Hex字符串
 * 
 * @throws 如果输入的颜色值无效，抛出错误
 */
export function getAntdPaletteColorByIndex(
  color: AnyColor,
  index: ColorIndex
): string {
  // 验证输入颜色是否有效，如果无效则抛出错误
  if (!isValidColor(color)) {
    throw new Error("invalid input color value");
  }
  
  // 如果索引为6，直接返回原始颜色的Hex值，因为Ant Design调色板中索引6的颜色不改变
  if (index === 6) {
    return getHex(color);
  }

  // 判断是亮色还是暗色
  const isLight = index < 6;
  
  // 将输入颜色转换为HSV格式
  const hsv = getHsv(color);
  
  // 根据索引计算新的HSV值
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;
  
  // 创建新的HSV颜色对象
  const newHsv: HsvColor = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight)
  };
  
  // 将计算得到的HSV值转换回Hex格式并返回
  return getHex(newHsv);
}

const darkColorMap = [
  { index: 7, opacity: 0.15 },
  { index: 6, opacity: 0.25 },
  { index: 5, opacity: 0.3 },
  { index: 5, opacity: 0.45 },
  { index: 5, opacity: 0.65 },
  { index: 5, opacity: 0.85 },
  { index: 5, opacity: 0.9 },
  { index: 4, opacity: 0.93 },
  { index: 3, opacity: 0.95 },
  { index: 2, opacity: 0.97 },
  { index: 1, opacity: 0.98 }
];


/**
 * 根据给定的颜色生成Ant Design色板
 * 
 * 此函数接受一个基础颜色，以及可选的是否使用暗色主题标志和暗色主题的混合颜色，
 * 并返回一个包含多个颜色变体的数组，用于在Ant Design组件中创建一致的颜色主题
 * 
 * @param color 基础颜色，可以是任何颜色格式
 * @param darkTheme 是否使用暗色主题，默认为false
 * @param darkThemeMixColor 暗色主题的混合颜色，默认为'#141414'
 * @returns 返回一个字符串数组，包含基于基础颜色生成的颜色变体
 */
export function getAntdColorPalette(color:AnyColor,darkTheme=false,darkThemeMixColor='#141414'):string[]{
  // 定义色板中颜色的索引
  const indexes:ColorIndex[]= [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  // 根据索引生成颜色模式
  const patterns=indexes.map(index=>(getAntdPaletteColorByIndex(color,index)))
  // 如果是暗色主题，进一步处理颜色模式
  if(darkTheme){
    const darkPatterns=darkColorMap.map(({index,opacity})=>{
      // 混合暗色主题颜色与原始颜色模式，以达到暗色效果
      const darkColor=mixColor(darkThemeMixColor,patterns[index],opacity)
      return darkColor
    })
    // 返回处理后的暗色主题颜色的十六进制表示
    return darkPatterns.map(item=>getHex(item))
  }
  // 如果不是暗色主题，直接返回原始颜色模式
  return patterns
}

/**
 * 计算在HSV颜色空间中的色相值
 * 
 * @param hsv - 输入的HSV颜色对象
 * @param i - 色相变化的步数
 * @param isLight - 是否是亮色系
 * @returns 计算后的色相值
 */
function getHue(hsv:HsvColor,i:number,isLight:boolean){
  let hue:number
  const hsvH=Math.round(hsv.h)
  
  // 根据输入色相值调整色相变化的方向
  if(hsvH >=60 && hsvH <=240){
    hue=isLight?hsvH - hueStep * i:hsvH + hueStep * i
  }else{
    hue=isLight?hsvH + hueStep * i:hsvH - hueStep * i
  }
  
  // 确保计算后的色相值在0到360之间
  if(hue < 0){
    hue += 360
  }
  if(hue >=360){
    hue -= 360
  }
  
  return hue
}

/**
 * 获取饱和度值
 * 本函数旨在根据HSV颜色模型和特定条件计算并返回一个调整后的饱和度值
 * 
 * @param hsv HsvColor类型的对象，包含色调、饱和度和明度值
 * @param i 数字类型，表示当前循环或序列的索引，用于计算调整后的饱和度
 * @param isLight 布尔类型，指示当前颜色是偏向亮色还是暗色，影响饱和度的计算方式
 * @returns 返回计算后的饱和度值
 */
function getSaturation(hsv:HsvColor,i:number,isLight:boolean){
  // 当色调和饱和度都为0时，直接返回当前饱和度值，因为这代表是一个无彩色的情况
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  let saturation: number;

  // 根据是否是亮色以及索引值来决定饱和度的计算方式
  if (isLight) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }

  // 确保饱和度不会超过100，这是饱和度的最大值
  if (saturation > 100) {
    saturation = 100;
  }

  // 特殊情况下，对于亮色且索引达到最大时，将饱和度限制在10，避免过亮颜色的饱和度过高
  if (isLight && i === lightColorCount && saturation > 10) {
    saturation = 10;
  }

  // 确保饱和度不会低于6，避免颜色过于灰暗
  if (saturation < 6) {
    saturation = 6;
  }

  // 返回最终计算得到的饱和度值
  return saturation;
}

/**
 * 根据HSV颜色模式、索引和是否为亮色来计算并返回新的值(V分量)
 * 
 * @param hsv - 输入的HSV颜色对象
 * @param i - 索引，用于计算步长
 * @param isLight - 布尔值，指示是否为亮色
 * @returns 返回计算后的值(V分量)，确保在0到100之间
 */
function getValue(hsv:HsvColor,i:number,isLight:boolean){
  let value: number;

  // 根据是否为亮色，使用不同的步长计算新的值(V分量)
  if (isLight) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }

  // 确保值(V分量)不会超过100
  if (value > 100) {
    value = 100;
  }

  return value;
}