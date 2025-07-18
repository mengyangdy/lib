import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export type ContentType =
  | "application/json"
  | "application/octet-stream"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/html"
  | "text/plain";

export interface RequestOption<ResponseData = any> {
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean;
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance
  ) => Promise<AxiosResponse | null> | Promise<void>;
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>;
  onRequest: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  transformBackendResponse(
    response: AxiosResponse<ResponseData>
  ): any | Promise<any>;
}

interface ResponseMap {
  arrayBuffer: ArrayBuffer;
  blob: Blob;
  document: Document;
  stream: ReadableStream<Uint8Array>;
  text: string;
}
export type ResponseType = keyof ResponseMap | "json";

export type MappedType<
  R extends ResponseType,
  JsonType = any
> = R extends keyof ResponseMap ? ResponseMap[R] : JsonType;

export type CustomAxiosRequestConfig<R extends ResponseType = "json"> = Omit<
  AxiosRequestConfig,
  "responseType"
> & {
  responseType?: R;
};

export interface RequestInstanceCommon<T> {
  cancelAllRequest: () => void;
  cancelRequest: (requestId: string) => void;
  state: T;
}

export interface RequestInstance<S = Record<string, unknown>>
  extends RequestInstanceCommon<S> {
  <T = any, R extends ResponseType = "json">(
    config: CustomAxiosRequestConfig<R>
  ): Promise<MappedType<R, T>>;
}

export type FlatResponseSuccessData<T = any, ResponseData = any> = {
  data: T;
  error: null;
  response: AxiosResponse<ResponseData>;
};

export type FlatResponseFailData<ResponseData = any> = {
  data: null;
  error: AxiosError<ResponseData>;
  response: AxiosResponse<ResponseData>;
};

export type FlatResponseData<T = any, ResponseData = any> =
  | FlatResponseSuccessData<T, ResponseData>
  | FlatResponseFailData<ResponseData>;

export interface FlatRequestInstance<
  S = Record<string, unknown>,
  ResponseData = any
> extends RequestInstanceCommon<S> {
  <T = any, R extends ResponseType = "json">(
    config: CustomAxiosRequestConfig<R>
  ): Promise<FlatResponseData<MappedType<R, T>, ResponseData>>;
}
