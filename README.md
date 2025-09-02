# 工具库使用文档

这是一个功能丰富的 JavaScript/TypeScript 工具库，提供了常用的工具函数和方法。

## 安装

```bash
npm install @dylanjs/utils
# 或
yarn add @dylanjs/utils
# 或
pnpm add @dylanjs/utils
```

## 功能模块

### 1. HTTP 请求 (fetch)

基于原生 fetch API 封装的 HTTP 请求工具，支持所有常用请求方式。

#### 基本用法

```typescript
import { fetchRequest } from "@dylanjs/utils";

// GET 请求
fetchRequest
  .get("/api/users", {
    params: { page: 1, limit: 10 },
  })
  .then((res) => {
    console.log(res);
  });

// POST 请求
fetchRequest
  .post("/api/users", {
    name: "张三",
    email: "zhangsan@example.com",
  })
  .then((res) => {
    console.log(res);
  });

// 通用请求
fetchRequest({
  url: "/api/users",
  method: "PUT",
  body: { id: 1, name: "李四" },
  headers: { "Content-Type": "application/json" },
}).then((res) => {
  console.log(res);
});
```

#### 支持的请求方法

- `fetchRequest.get(url, config?)` - GET 请求
- `fetchRequest.post(url, body?, config?)` - POST 请求
- `fetchRequest.put(url, body?, config?)` - PUT 请求
- `fetchRequest.delete(url, config?)` - DELETE 请求
- `fetchRequest.patch(url, body?, config?)` - PATCH 请求
- `fetchRequest.head(url, config?)` - HEAD 请求
- `fetchRequest.options(url, config?)` - OPTIONS 请求

#### 配置选项

```typescript
interface RequestConfig {
  url?: string; // 请求地址
  method?: string; // 请求方法
  credentials?: RequestCredentials; // 凭证设置
  headers?: Record<string, any>; // 请求头
  body?: any; // 请求体
  params?: Record<string, any>; // URL 参数
  responseType?: "json" | "text" | "arrayBuffer" | "blob"; // 响应类型
  signal?: AbortSignal | null; // 中断信号
}
```

### 2. 防抖函数 (debounce)

防止函数在短时间内多次调用，只执行最后一次。

```typescript
import { Debounce } from "@dylanjs/utils";

// 基本用法
const debouncedFn = Debounce((searchTerm: string) => {
  console.log("搜索:", searchTerm);
}, 500);

// 使用
debouncedFn("hello"); // 500ms 后执行
debouncedFn("world"); // 取消上一次，500ms 后执行

// 立即执行
const immediateFn = Debounce(
  (value: string) => {
    console.log("立即执行:", value);
  },
  1000,
  true
);

// 带回调函数
const fnWithCallback = Debounce(
  (value: string) => value.toUpperCase(),
  500,
  false,
  (result) => console.log("结果:", result)
);

// 取消执行
debouncedFn.cancel();
```

### 3. 节流函数 (throttle)

限制函数在一定时间内只能执行一次。

```typescript
import { Throttle } from "@dylanjs/utils";

// 基本用法
const throttledFn = Throttle((value: string) => {
  console.log("节流执行:", value);
}, 1000);

// 使用
throttledFn("test1"); // 立即执行
throttledFn("test2"); // 被节流，不执行

// 配置选项
const configurableFn = Throttle((value: string) => console.log(value), 1000, {
  leading: true, // 是否在开始时执行
  trailing: true, // 是否在结束时执行
});

// 取消执行
throttledFn.cancel();
```

### 4. 本地存储 (storage)

封装 localStorage 和 sessionStorage 的工具函数。

```typescript
import { storage } from "@dylanjs/utils";

// 设置值
storage.set("user", { id: 1, name: "张三" });

// 获取值
const user = storage.get("user");

// 删除值
storage.remove("user");

// 清空所有
storage.clear();

// 检查是否存在
const exists = storage.has("user");
```

### 5. 类型判断 (is)

提供各种类型判断函数。

```typescript
import {
  isObject,
  isArray,
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isDate,
  isMap,
  isSet,
  isPromise,
  isWindow,
  isBrowser,
  isIOS,
  isPC,
  isClient,
  hasOwn,
} from "@dylanjs/utils";

isObject({}); // true
isArray([1, 2, 3]); // true
isString("hello"); // true
isNumber(123); // true
isBoolean(true); // true
isFunction(() => {}); // true
isDate(new Date()); // true
isMap(new Map()); // true
isSet(new Set()); // true
isPromise(Promise.resolve()); // true
isWindow(window); // true
isBrowser(); // true
isIOS(); // true/false
isPC(); // true/false
isClient(); // true/false
hasOwn({ a: 1 }, "a"); // true
```

### 6. 深拷贝 (cloneDeep)

深度克隆对象或数组。

```typescript
import { cloneDeep } from "@dylanjs/utils";

const original = {
  a: 1,
  b: { c: 2, d: [3, 4] },
};

const cloned = cloneDeep(original);
// cloned 是 original 的深拷贝，修改不会影响原对象
```

### 7. 颜色工具 (color)

颜色处理和管理工具。

```typescript
import { color } from "@dylanjs/utils";

// 颜色转换
const hex = color.toHex("#ff0000");
const rgb = color.toRgb("#ff0000");
const hsl = color.toHsl("#ff0000");

// 颜色操作
const lighter = color.lighten("#ff0000", 0.2);
const darker = color.darken("#ff0000", 0.2);
const alpha = color.alpha("#ff0000", 0.5);
```

### 8. UnoCSS 预设 (uno-preset)

UnoCSS 的预设配置。

```typescript
import { unoPreset } from "@dylanjs/utils";

// 在 UnoCSS 配置中使用
export default defineConfig({
  presets: [unoPreset()],
});
```

### 9. 唯一 ID 生成 (nanoid)

生成唯一的标识符。

```typescript
import { nanoid } from "@dylanjs/utils";

const id = nanoid(); // 生成唯一ID
```

### 10. Axios 封装

基于 axios 的 HTTP 请求封装，支持请求重试、错误处理等功能。

```typescript
import { createRequest, createFlatRequest } from "@dylanjs/utils";

// 创建请求实例
const request = createRequest({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

// 使用请求
const response = await request({
  url: "/api/users",
  method: "GET",
});

// 扁平化请求（返回 { data, error } 格式）
const flatRequest = createFlatRequest();
const { data, error } = await flatRequest({
  url: "/api/users",
  method: "GET",
});

// 取消请求
request.cancelRequest(requestId);
request.cancelAllRequest();
```

### 11. WebSocket 工具

WebSocket 连接管理工具，支持心跳检测、自动重连等功能。

```typescript
import { WebSocketClient } from "@dylanjs/utils";

const ws = new WebSocketClient("ws://localhost:8080", {
  onConnected: (ws) => {
    console.log("连接已建立");
  },
  onMessage: (ws, ev) => {
    console.log("收到消息:", ev.data);
  },
  onDisconnected: (ws, ev) => {
    console.log("连接已断开");
  },
  onError: (ws, ev) => {
    console.log("连接错误:", ev);
  },
  heartbeat: {
    message: "ping",
    responseMessage: "pong",
    interval: 30000,
    pongTimeout: 5000,
  },
  autoReconnect: {
    retries: 5,
    delay: 2000,
    onFailed: () => {
      console.log("重连失败");
    },
  },
});

// 发送消息
ws.send("Hello Server");

// 手动关闭连接
ws.close();

// 重新连接
ws.open();
```

### 12. 数组格式化 (array-format)

数组处理工具函数。

```typescript
import { arrayToTreeArray } from "@dylanjs/utils";

// 将一维数组转换为树形结构
const list = [
  { id: 1, name: "部门1", parentId: 0 },
  { id: 2, name: "部门2", parentId: 0 },
  { id: 3, name: "子部门1", parentId: 1 },
  { id: 4, name: "子部门2", parentId: 1 },
];

const treeArray = arrayToTreeArray(list, "parentId", 0);
// 结果：
// [
//   {
//     id: 1,
//     name: "部门1",
//     parentId: 0,
//     children: [
//       { id: 3, name: "子部门1", parentId: 1, children: [] },
//       { id: 4, name: "子部门2", parentId: 1, children: [] }
//     ]
//   },
//   {
//     id: 2,
//     name: "部门2",
//     parentId: 0,
//     children: []
//   }
// ]
```

### 13. 数字格式化 (num-format)

数字处理工具函数。

```typescript
import { numThousandthFormat, bigNumAdd, bigNumMult } from "@dylanjs/utils";

// 数字千分位格式化
const formatted = numThousandthFormat(1234567.89);
console.log(formatted); // "1,234,567.89"

// 大数相加（避免精度丢失）
const sum = bigNumAdd(999999999999999999, 1);
console.log(sum); // "1000000000000000000"

// 大数相乘（避免精度丢失）
const product = bigNumMult(999999999999999999, 2);
console.log(product); // "1999999999999999998"
```

### 14. 对象格式化 (object-format)

对象处理工具函数。

```typescript
import { objectflatten } from "@dylanjs/utils";

// 嵌套对象扁平化
const nestedObj = {
  a: {
    b: {
      c: {
        dd: "abcdd",
      },
    },
    d: {
      xx: "adxx",
    },
    e: "ae",
  },
};

const flattened = objectflatten(nestedObj);
console.log(flattened);
// 结果：
// {
//   'a.b.c.dd': 'abcdd',
//   'a.d.xx': 'adxx',
//   'a.e': 'ae'
// }
```

### 15. 字符串格式化 (string-format)

字符串处理工具函数。

```typescript
import { maxChatNumTime } from "@dylanjs/utils";

// 找出字符串中出现最多次数的字符及次数
maxChatNumTime("hello world");
// 输出：
// 最多的字符是l
// 出现的次数是3
// 最多的字符是o
// 出现的次数是2
```

## 类型支持

所有函数都提供完整的 TypeScript 类型定义，支持泛型和类型推断。

```typescript
// 泛型示例
const debouncedFn = Debounce<string, void>((value: string) => {
  console.log(value);
}, 500);

// 类型推断
const result = await debouncedFn("hello"); // result 类型为 Promise<void>
```

## 浏览器兼容性

- 现代浏览器（Chrome 60+, Firefox 55+, Safari 12+, Edge 79+）
- 需要支持 ES6+ 特性

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.1.0

- 新增数组格式化工具 (`array-format`)
- 新增数字格式化工具 (`num-format`)
- 新增对象格式化工具 (`object-format`)
- 新增字符串格式化工具 (`string-format`)
- 增强类型判断工具，新增更多类型检查函数
- 完善 WebSocket 工具，支持心跳检测和自动重连
- 完善 Axios 封装，支持请求重试和错误处理

### v1.0.0

- 初始版本发布
- 包含所有核心功能模块
- 完整的 TypeScript 支持
