import qs from "qs";
import { isObject } from "./is";

/**
 * request([config])
 * baseURL 基础URL，用于开发环境和生产环境的URL前缀配置
 * url 请求地址
 * method 请求方式 默认GET/DELETE/HEAD/OPTIONS/POST/PUT/PATCH
 * credentials 携带资源凭证 * include/same-origin/omit
 * headers:{} 自定义的请求头信息 格式必须是纯粹对象
 * body:null 请求主体信息 只针对POST系列请求，根据当前服务器要求，如果用户传递的是一个纯粹对象，我们需要把其转变为urlencoded格式字符串
 * params:null 设定问号传参格式 格式必须是纯粹对象，我们在内部把其拼接到url的末尾
 * responseType 预设服务器反返回结果的读取方式 json/text/arrayBuffer/blob
 * signal 中断请求的信号
 */

// 类型声明
export interface RequestConfig {
  baseURL?: string; // 新增：基础URL，用于环境配置
  url?: string;
  method?: string;
  credentials?: RequestCredentials;
  headers?: Record<string, any>;
  body?: any;
  params?: Record<string, any> | null;
  responseType?: "json" | "text" | "arrayBuffer" | "blob";
  signal?: AbortSignal | null;
  [key: string]: any;
}

export type RequestResponse<T = any> = Promise<T>;

export interface RequestFetchInstance {
  (config: RequestConfig): RequestResponse<any>;
  get<T = any>(url: string, config?: RequestConfig): RequestResponse<T>;
  delete<T = any>(url: string, config?: RequestConfig): RequestResponse<T>;
  head<T = any>(url: string, config?: RequestConfig): RequestResponse<T>;
  options<T = any>(url: string, config?: RequestConfig): RequestResponse<T>;
  post<T = any>(
    url: string,
    body?: any,
    config?: RequestConfig
  ): RequestResponse<T>;
  put<T = any>(
    url: string,
    body?: any,
    config?: RequestConfig
  ): RequestResponse<T>;
  patch<T = any>(
    url: string,
    body?: any,
    config?: RequestConfig
  ): RequestResponse<T>;
}

/**
 * 通用的 HTTP 请求方法，支持 GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS 等所有常用请求方式。
 *
 * - 支持基础URL配置（baseURL），解决开发环境和生产环境的URL前缀问题。
 * - 支持自动参数序列化（params）、请求体格式化（body）、请求头自定义、token 自动注入等功能。
 * - 支持 responseType 指定返回数据格式（json、text、arrayBuffer、blob）。
 * - 支持请求中断（signal）。
 * - 提供 request.get/post/put/delete/patch/head/options 等快捷方法。
 *
 * @param config 请求配置对象，包含 baseURL、url、method、headers、body、params、responseType、signal 等参数。
 * @returns 返回一个 Promise，resolve 为服务器响应的数据，reject 为错误信息。
 *
 * @example
 * // 开发环境（使用代理）
 * request.get('/api/user', { baseURL: '', params: { id: 1 } });
 *
 * // 生产环境（带前缀）
 * request.get('/api/user', { baseURL: 'https://api.example.com', params: { id: 1 } });
 *
 * // 通用用法
 * request({ baseURL: 'https://api.example.com', url: '/api/user', method: 'GET', params: { id: 1 } });
 */
export const fetchRequest: RequestFetchInstance = function request(
  config: RequestConfig
): RequestResponse<any> {
  if (!isObject(config)) config = {};
  config = Object.assign(
    {
      baseURL: "", // 新增：基础URL默认值
      url: "",
      method: "GET",
      credentials: "include",
      headers: {},
      body: null,
      params: null,
      responseType: "json",
      signal: null,
    },
    config
  );
  if (!isObject(config.headers)) config.headers = {};
  if (config.params !== null && !isObject(config.params)) config.params = null;
  let {
    baseURL, // 新增：解构 baseURL
    url,
    method,
    credentials,
    headers,
    body,
    params,
    responseType,
    signal,
  } = config;

  // 保证 url 一定为字符串
  url = typeof url === "string" ? url : "";

  // 拼接 baseURL 和 url
  let fullUrl = url;
  if (baseURL) {
    // 确保 baseURL 不以 / 结尾，url 不以 / 开头
    const cleanBaseURL = baseURL.replace(/\/$/, "");
    const cleanURL = url.replace(/^\//, "");
    fullUrl = `${cleanBaseURL}/${cleanURL}`;
  }

  // 处理URL：params存在我们需要把params中的每一项拼接到URL末尾
  if (params)
    fullUrl += `${fullUrl.includes("?") ? "&" : "?"}${qs.stringify(params)}`;

  // 处理请求主体 只针对POST系列请求：body是个纯粹对象 根据当前后台要求 把其变成urlencoded格式
  if (isObject(body)) {
    body = qs.stringify(body);
    if (headers) {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
  }

  // 类似于axios中的拦截器
  let token = localStorage.getItem("token");
  if (token) {
    if (headers) {
      headers["Authorzation"] = token;
    }
  }

  method = method!.toUpperCase();
  const fetchConfig: RequestInit = {
    method,
    credentials,
    headers,
    cache: "no-cache",
    mode: "cors",
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body) fetchConfig.body = body;
  if (signal) fetchConfig.signal = signal as AbortSignal;

  // 使用 fullUrl 进行请求
  return fetch(fullUrl, fetchConfig)
    .then((response) => {
      let { status, statusText } = response;
      let result;
      if (!/^(2|3)\d{2}$/.test(String(status)))
        return Promise.reject({ code: -1, status, statusText });
      switch (responseType!.toLowerCase()) {
        case "json":
          result = response.json();
          break;
        case "text":
          result = response.text();
          break;
        case "arraybuffer":
          result = response.arrayBuffer();
          break;
        case "blob":
          result = response.blob();
          break;
        default:
          result = response.json();
          break;
      }
      return result.then(null, (reason) =>
        Promise.reject({ code: -2, reason })
      );
    })
    .catch((reason) => {
      return Promise.reject(reason);
    });
} as RequestFetchInstance;

// 快捷方法类型补全
(["GET", "HEAD", "DELETE", "OPTIONS"] as const).forEach((item) => {
  (fetchRequest as any)[item.toLowerCase()] = function <T = any>(
    url: string,
    config: RequestConfig = {}
  ): RequestResponse<T> {
    if (!isObject(config)) config = {};
    config["url"] = url;
    config["method"] = item;
    return fetchRequest(config);
  };
});

(["POST", "PUT", "PATCH"] as const).forEach((item) => {
  (fetchRequest as any)[item.toLowerCase()] = function <T = any>(
    url: string,
    body?: any,
    config: RequestConfig = {}
  ): RequestResponse<T> {
    if (!isObject(config)) config = {};
    config["url"] = url;
    config["method"] = item;
    config["body"] = body;
    return fetchRequest(config);
  };
});
