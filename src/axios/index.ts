import { nanoid } from "../index";
import axios, { AxiosError } from "axios";
import type {
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRetry from "axios-retry";

import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from "./constant";
import {
  createAxiosConfig,
  createDefaultOptions,
  createRetryOptions,
} from "./options";
import type {
  CustomAxiosRequestConfig,
  FlatRequestInstance,
  MappedType,
  RequestInstance,
  RequestOption,
  ResponseType,
} from "./type";

function createCommonRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  const opts = createDefaultOptions<ResponseData>(options);
  const axiosConf = createAxiosConfig(axiosConfig);
  const instance = axios.create(axiosConf);
  const abortControllerMap = new Map<string, AbortController>();
  const retryOptions = createRetryOptions(axiosConf);
  axiosRetry(instance, retryOptions);

  instance.interceptors.request.use((conf) => {
    const config: InternalAxiosRequestConfig = { ...conf };

    const requestId = nanoid();
    config.headers.set(REQUEST_ID_KEY, requestId);
    if (!config.signal) {
      const abortController = new AbortController();
      config.signal = abortController.signal;
      abortControllerMap.set(requestId, abortController);
    }
    const handleConfig = opts.onRequest?.(config) || config;
    return handleConfig;
  });
  instance.interceptors.response.use(
    async (response) => {
      const responseType: ResponseType =
        (response.config?.responseType as ResponseType) || "json";
      if (responseType !== "json" || opts.isBackendSuccess(response)) {
        return Promise.resolve(response);
      }
      const fail = await opts.onBackendFail(response, instance);
      if (fail) {
        return fail;
      }
      const backendError = new AxiosError<ResponseData>(
        "the backend request error",
        BACKEND_ERROR_CODE,
        response.config,
        response.request,
        response
      );
      await opts.onError(backendError);
      return Promise.reject(backendError);
    },
    async (error: AxiosError<ResponseData>) => {
      await opts.onError(error);
      return Promise.reject(error);
    }
  );
  function cancelRequest(requestId: string) {
    const abortController = abortControllerMap.get(requestId);
    if (abortController) {
      abortController.abort();
      abortControllerMap.delete(requestId);
    }
  }
  function cancelAllRequest() {
    abortControllerMap.forEach((abortController) => {
      abortController.abort();
    });
    abortControllerMap.clear();
  }
  return {
    cancelAllRequest,
    cancelRequest,
    instance,
    opts,
  };
}

export type * from "./type";

export function createRequest<
  ResponseData = any,
  State = Record<string, unknown>
>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  const { cancelAllRequest, cancelRequest, instance, opts } =
    createCommonRequest<ResponseData>(axiosConfig, options);

  const request: RequestInstance<State> = async function request<
    T = any,
    R extends ResponseType = "json"
  >(config: CustomAxiosRequestConfig) {
    const response: AxiosResponse<ResponseData> = await instance(config);

    const responseType = response.config?.responseType || "json";

    if (responseType === "json") {
      return opts.transformBackendResponse(response);
    }

    return response.data as MappedType<R, T>;
  } as RequestInstance<State>;

  request.cancelRequest = cancelRequest;
  request.cancelAllRequest = cancelAllRequest;
  request.state = {} as State;

  return request;
}

export function createFlatRequest<
  ResponseData = any,
  State = Record<string, unknown>
>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>
) {
  const { cancelAllRequest, cancelRequest, instance, opts } =
    createCommonRequest<ResponseData>(axiosConfig, options);

  const flatRequest: FlatRequestInstance<State, ResponseData> =
    async function flatRequest<T = any, R extends ResponseType = "json">(
      config: CustomAxiosRequestConfig
    ) {
      try {
        const response: AxiosResponse<ResponseData> = await instance(config);

        const responseType = response.config?.responseType || "json";

        if (responseType === "json") {
          const data = opts.transformBackendResponse(response);

          return { data, error: null, response };
        }

        return { data: response.data as MappedType<R, T>, error: null };
      } catch (error) {
        return {
          data: null,
          error,
          response: (error as AxiosError<ResponseData>).response,
        };
      }
    } as FlatRequestInstance<State, ResponseData>;

  flatRequest.cancelRequest = cancelRequest;
  flatRequest.cancelAllRequest = cancelAllRequest;
  flatRequest.state = {} as State;

  return flatRequest;
}
export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };
export type { AxiosError, CreateAxiosDefaults, AxiosInstance, AxiosResponse };
