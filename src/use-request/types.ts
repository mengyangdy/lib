import { Ref, watch } from "vue";
import { CachedData } from "./utils/cache";
import UseRequestFetch from "./Fetch";

/**
 * 请求服务函数类型定义
 * @description 定义异步请求服务的标准接口，用于统一管理 API 请求函数
 * @template TData 请求返回的数据类型
 * @template TParams 请求参数类型，必须是数组类型，支持任意数量和类型的参数
 * @example
 * ```typescript
 * // 无参数请求
 * const getUserService: UseRequestService<User, []> = () => fetch('/api/user').then(res => res.json());
 *
 * // 单参数请求
 * const getUserByIdService: UseRequestService<User, [number]> = (id: number) =>
 *   fetch(`/api/user/${id}`).then(res => res.json());
 *
 * // 多参数请求
 * const searchUsersService: UseRequestService<User[], [string, number, number]> =
 *   (keyword: string, page: number, pageSize: number) =>
 *     fetch(`/api/users?keyword=${keyword}&page=${page}&pageSize=${pageSize}`).then(res => res.json());
 * ```
 */
export type UseRequestService<
  TData,
  TParams extends unknown[]
> = () => Promise<TData>;

export type UseRequestSubscribe = () => void;

export interface UseRequestFetchState<TData, TParams extends unknown[]> {
  loading: boolean;
  params?: TParams;
  data?: TData;
  error?: Error | unknown;
}

export interface UseRequestPluginReturn<TData, TParams extends unknown[]> {
  name?: string;
  onBefore?: (params: TParams) =>
    | ({
        stopNow?: boolean;
        returnNow?: boolean;
      } & Partial<UseRequestFetchState<TData, TParams>>)
    | void;
  onRequest?: (
    service: UseRequestService<TData, TParams>,
    params: TParams
  ) => {
    servicePromise?: Promise<TData>;
  };
  onSuccess?: (data: TData, params: TParams) => void;
  onError?: (e: Error, params: TParams) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  onCancel?: () => void;
  onMutate?: (data: TData) => void;
}

export type RequestHook<TData = any, TParams extends any[] = any[]> = (
  service: UseRequestService<TData, TParams>,
  options: UseRequestOptions<TData, TParams, any>,
  plugins: UseRequestPlugin<TData, TParams>[]
) => useRequestResult<TData, TParams>;

export type UseRequestMiddleware<TData,TParams extends any[]>=(
  useRequestNext:RequestHook<TData,TParams>,
)=>RequestHook<TData,TParams>

export type UseRequestBasicOptions<TData,TParams extends unknown[]>={
  /**
   * default false
   * 在初始化时会自动执行 service（比如自动发起请求/获取数据）
   * 如果设置为true就不会再初始化自动执行 需要手动调用run或runAsync
   */
  manual?:boolean,

  /**
   * 第一次默认执行时传递的参数
   */
  defaultParams?:TParams,

  /**
   * 在服务执行之前触发
   * @param params TParams
   * @returns void
   */
  onBefore?: (params: TParams) => void

  /**
   * 服务成功后触发
   * @param data TData
   * @param params TParams
   * @return void
   */
  onSuccess?:(data:TData,params:TParams)=>void
  /**
   *
   * @param e Error
   * @param params TParams
   * @returns void
   */
  onError?:(e:Error,params:TParams)=>void
  /**
   * 完成后触发
   * @param params TParams
   * @param data TData
   * @param e Error
   * @returns void
   */
  onFinally?:(params:TParams,data?:TData,e?:Error)=>void

  /**
   * 请求是否就绪
   */
  ready?:Ref<boolean> | boolean
  /**
   * 依赖于响应式对象以及vue的watch方法
   */
  refreshDeps?:Parameters<typeof watch>[0][] | boolean
  refreshDepsAction?:()=>void
  /**
   * 延迟加载时间
   */
  loadingDelay?:number | Ref<number>
  /**
   * vue devtools
   */
  debugKey?:string
  /**
   * 轮询间隔当大于0时将开启轮询
   */
  pollingInterval?:Ref<number> | number
  /**
   * 页面隐藏时是否继续轮询，如果设置位false，当页面隐藏时 轮询将暂停
   */
  pollingWhenHidden?:boolean
  /**
   * 轮询错误重试次数
   */
  pollingErrorRetryCount?:number
  /**
   * 是否在屏幕聚焦或修改时重新启动请求
   */
  refreshOnWindowFocus?:Ref<boolean> | boolean
  /**
   * 重新请求间隔
   */
  focusTimespan?:Ref<number> | number
  /**
   * 防抖延迟时间
   */
  debounceWait?:Ref<number> | number
  /**
   * 延迟开始之前请求
   */
  debounceLeading?:Ref<boolean> | boolean

  debounceTrailing?:Ref<boolean> | boolean

  debounceMaxWait?:Ref<number> | number

  throttleWait?:Ref<number> | number

  throttleLeading?:Ref<boolean> | boolean
  cacheKey?:string
  cacheTime?:number
  staleTime?:number
  setCache?:(data:CachedData<TData,TParams>)=>void
  getCache?:(params:TParams)=>CachedData<TData,TParams> | undefined
  retryCount?:number
  retryInterval?:number
  use?:UseRequestMiddleware<TData,TParams>[]
  rollbackOnError?:boolean | ((params:TParams)=>boolean)
}

export type UseRequestOptions<
TData,
  TParams extends any[]=any[],
  TPlugin=any
>=UseRequestBasicOptions<TData, TParams> & {
  pluginOptions?:TPlugin
}

export type UseRequestOptionsWithFormatResult<
  TData,
  TParams extends any[]=any[],
  TPlugin=any,
  SR=any
>=UseRequestOptions<TData,TParams,TPlugin> & {
  formatResult:(res:SR)=>TData
}

export type UseRequestOptionsWithInitialData<
  TData,
  TParams extends any[] = any[],
  TPlugin = any
>= UseRequestOptions<TData, TParams, TPlugin> & {
  initialData: TData extends infer R ? R : TData
}

export interface UseRequestPlugin<TData, TParams extends unknown[] = unknown[], TPlugin = any> {
  (
    fetchInstance: UseRequestFetch<TData, TParams>,
    options: UseRequestOptions<TData, TParams, TPlugin>,
  ): UseRequestPluginReturn<TData, TParams>
  onInit?: (
    options: UseRequestOptions<TData, TParams, TPlugin>,
  ) => Partial<UseRequestFetchState<TData, TParams>>
}

export interface useRequestResult<
  TData,
  TParams extends unknown[],
  FormatResult = any,
  Initial = any
> {
  /**
   * Is the service being executed.
   */
  loading: Readonly<Ref<boolean>>

  /**
   * Data returned by service.
   */
  data: Readonly<
    Ref<
      FormatResult extends false
        ? Initial extends false
          ? TData | undefined
          : TData
        : FormatResult extends (...args: any[]) => any
          ? ReturnType<FormatResult> | undefined
          : FormatResult | undefined
    >
  >

  /**
   * 	Exception thrown by service.
   */
  error: Readonly<Ref<Error | undefined>>

  /**
   * params	An array of parameters for the service being executed. For example, you triggered `run(1, 2, 3)`, then params is equal to `[1, 2, 3]`.
   */
  params: Readonly<Ref<TParams | []>>

  /**
   * Ignore the current promise response.
   */
  cancel: UseRequestFetch<TData, TParams>['cancel']

  /**
   * Use the last params, call `run` again.
   */
  refresh: UseRequestFetch<TData, TParams>['refresh']

  /**
   * Use the last params, call `runAsync` again.
   */
  refreshAsync: UseRequestFetch<TData, TParams>['refreshAsync']

  /**
   * Manually trigger the execution of the service, and the parameters will be passed to the service.
   */
  run: UseRequestFetch<TData, TParams>['run']

  /**
   * Automatic handling of exceptions, feedback through `onError`
   */
  runAsync: UseRequestFetch<TData, TParams>['runAsync']

  /**
   * Mutate `data` directly
   */
  mutate: UseRequestFetch<TData, TParams>['mutate']
}

export type Timeout = ReturnType<typeof setTimeout>

export type Interval = ReturnType<typeof setInterval>