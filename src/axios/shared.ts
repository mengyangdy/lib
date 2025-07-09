import type {
  AxiosHeaderValue,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * 获取请求的Content-Type头
 *
 * 此函数旨在从Axios请求配置中提取Content-Type头的值如果未设置Content-Type头，
 * 则默认返回'application/json'这在发送请求时确定请求体的编码类型非常重要
 *
 * @param config 内部Axios请求配置，其中包含所有请求相关的设置
 * @returns {AxiosHeaderValue} 请求的Content-Type头的值，如果未设置，则为默认值
 */
export function getContentType(config: InternalAxiosRequestConfig) {
  // 从请求配置的头部信息中获取Content-Type的值，如果未设置，则使用默认值'application/json'
  const contentType: AxiosHeaderValue =
    config.headers["Content-Type"] || "application/json";
  // 返回Content-Type的值
  return contentType;
}
/**
 * 判断HTTP请求是否成功
 *
 * 此函数用于检查HTTP响应状态码是否表示请求成功它基于HTTP规范来评估状态码：
 * - 成功的状态码范围为200至299（包括200和299）
 * - 特别地，状态码304（未修改）也被视为成功，因为它表示资源未更改，通常用于缓存
 *
 * @param status HTTP响应状态码，用于判断请求是否成功
 * @returns 返回一个布尔值，如果请求成功则为true，否则为false
 */
export function isHttpSuccess(status: number) {
  const isSuccessCode = status >= 200 && status < 300;
  return isSuccessCode || status === 304;
}

/**
 * 判断响应是否为JSON类型
 *
 * 此函数通过检查响应配置中的responseType属性，来确定响应是否为JSON类型
 * 如果responseType为"json"或未指定（undefined），则认为响应是JSON类型
 *
 * @param response Axios响应对象，包含响应数据和配置信息
 * @returns 如果响应为JSON类型，则返回true；否则返回false
 */
export function isResponseJson(response: AxiosResponse) {
  // 获取响应类型配置
  const { responseType } = response.config;
  // 检查响应类型是否为"json"或未指定
  return responseType === "json" || responseType === undefined;
}
