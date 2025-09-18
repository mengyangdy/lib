// 导入自定义的 nanoid 函数，用于生成唯一请求ID
import { nanoid } from "../index";
import axios, { AxiosError } from "axios";
import type {
  AxiosInstance, // axios 实例类型
  AxiosResponse, // 响应类型
  CreateAxiosDefaults, // 创建 axios 默认配置类型
  InternalAxiosRequestConfig, // 内部请求配置类型
} from "axios";
// 导入 axios 重试插件
import axiosRetry from "axios-retry";

import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from "./constant";
import {
  createAxiosConfig, // 创建 axios 配置函数
  createDefaultOptions, // 创建默认选项函数
  createRetryOptions, // 创建重试选项函数
} from "./options";
import type {
  CustomAxiosRequestConfig, // 自定义请求配置类型
  FlatRequestInstance, // 扁平化请求实例类型
  MappedType, // 映射类型
  RequestInstance, // 请求实例类型
  RequestOption, // 请求选项类型
  ResponseType, // 响应类型
} from "./type";

// 定义通用请求创建函数
function createCommonRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults, // 可选的axios配置
  options?: Partial<RequestOption<ResponseData>> // // 可选的请求选项
) {
  const opts = createDefaultOptions<ResponseData>(options); // 创建默认选项
  const axiosConf = createAxiosConfig(axiosConfig); // 创建 axios 配置
  const instance = axios.create(axiosConf); // 创建 axios 实例
  const abortControllerMap = new Map<string, AbortController>(); // 请求取消控制器映射
  const retryOptions = createRetryOptions(axiosConf); // 创建重试选项
  axiosRetry(instance, retryOptions); // 应用重试插件
  // 请求配置器
  instance.interceptors.request.use((conf) => {
    const config: InternalAxiosRequestConfig = { ...conf }; // 复制配置

    const requestId = nanoid(); // 生成唯一请求ID
    config.headers.set(REQUEST_ID_KEY, requestId); // 设置请求ID到请求头
    if (!config.signal) {
      // 如果没有请求信号
      const abortController = new AbortController(); // 创建取消控制器
      config.signal = abortController.signal; // 设置取消信号
      abortControllerMap.set(requestId, abortController); // 存储控制器
    }
    const handleConfig = opts.onRequest?.(config) || config; // 调用请求前钩子
    return handleConfig;
  });
  // 响应拦截器
  instance.interceptors.response.use(
    // 成功响应处理
    async (response) => {
      const responseType: ResponseType =
        (response.config?.responseType as ResponseType) || "json";
      if (responseType !== "json" || opts.isBackendSuccess(response)) {
        // 如果不是JSON或后端成功
        return Promise.resolve(response); // 直接返回响应
      }
      const fail = await opts.onBackendFail(response, instance); // 调用后端失败钩子
      if (fail) {
        return fail; // 返回失败处理结果
      }
      // 创建后端错误
      const backendError = new AxiosError<ResponseData>(
        "the backend request error", // 错误消息
        BACKEND_ERROR_CODE, // 错误代码
        response.config, // 请求配置
        response.request, // 请求对象
        response // 响应对象
      );
      await opts.onError(backendError); // 调用错误处理钩子
      return Promise.reject(backendError); // 返回错误
    },
    // 错误响应处理
    async (error: AxiosError<ResponseData>) => {
      await opts.onError(error); // 调用错误处理钩子
      return Promise.reject(error); // 拒绝 Promise
    }
  );
  // 请求取消功能
  function cancelRequest(requestId: string) {
    // 取消指定请求
    const abortController = abortControllerMap.get(requestId);
    if (abortController) {
      abortController.abort(); // 取消请求
      abortControllerMap.delete(requestId); // 删除控制器
    }
  }
  function cancelAllRequest() {
    // 取消所有请求
    abortControllerMap.forEach((abortController) => {
      abortController.abort(); // 取消每个请求
    });
    abortControllerMap.clear(); // 清空映射
  }
  return {
    cancelAllRequest, // 取消所有请求函数
    cancelRequest, // 取消指定请求函数
    instance, // axios 实例
    opts, // 请求选项
  };
}
// 导出所有类型定义
export type * from "./type";
// 定义标准请求创建函数
export function createRequest<
  ResponseData = any, // 响应数据类型
  State = Record<string, unknown> // 状态类型
>(
  axiosConfig?: CreateAxiosDefaults, // axios 配置
  options?: Partial<RequestOption<ResponseData>> // 请求选项
) {
  // 获取公共请求功能
  const { cancelAllRequest, cancelRequest, instance, opts } =
    createCommonRequest<ResponseData>(axiosConfig, options);
  // 创建请求实例
  const request: RequestInstance<State> = async function request<
    T = any,// 泛型数据类型
    R extends ResponseType = "json"// 响应类型，默认为 JSON
  >(config: CustomAxiosRequestConfig) {
    const response: AxiosResponse<ResponseData> = await instance(config);// 执行请求

    const responseType = response.config?.responseType || "json";// 获取响应类型

    if (responseType === "json") {// 如果是 JSON 响应
      return opts.transformBackendResponse(response);// 转换后端响应
    }

    return response.data as MappedType<R, T>;// 返回映射后的数据
  } as RequestInstance<State>;

  request.cancelRequest = cancelRequest;// 添加取消请求功能
  request.cancelAllRequest = cancelAllRequest;// 添加取消所有请求功能
  request.state = {} as State;// 初始化状态

  return request;// 返回请求实例
}
// 定义扁平化请求创建函数
export function createFlatRequest<
  ResponseData = any,// 响应数据类型
  State = Record<string, unknown>// 状态类型
>(
  axiosConfig?: CreateAxiosDefaults, // axios配置
  options?: Partial<RequestOption<ResponseData>> // 请求选项
) {
  // 获取公共请求功能
  const { cancelAllRequest, cancelRequest, instance, opts } =
    createCommonRequest<ResponseData>(axiosConfig, options);
  // 创建扁平化请求实例
  const flatRequest: FlatRequestInstance<State, ResponseData> =
    async function flatRequest<T = any, R extends ResponseType = "json">(
      config: CustomAxiosRequestConfig
    ) {
      try {
        const response: AxiosResponse<ResponseData> = await instance(config);// 执行请求

        const responseType = response.config?.responseType || "json";// 获取响应类型

        if (responseType === "json") {// 如果是JSON响应
          const data = opts.transformBackendResponse(response);//转换后响应
          return { data, error: null, response };// 返回成功结果
        }

        return { data: response.data as MappedType<R, T>, error: null };// 返回非JSON结果
      } catch (error) {
        return {// 返回错误结果
          data: null,
          error,
          response: (error as AxiosError<ResponseData>).response,
        };
      }
    } as FlatRequestInstance<State, ResponseData>;
  // 添加额外功能到扁平化请求实例
  flatRequest.cancelRequest = cancelRequest;// 添加
  flatRequest.cancelAllRequest = cancelAllRequest;
  flatRequest.state = {} as State;

  return flatRequest;
}
export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };
export type { AxiosError, CreateAxiosDefaults, AxiosInstance, AxiosResponse };
