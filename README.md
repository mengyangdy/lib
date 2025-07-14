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
import { isObject, isArray, isString, isNumber } from "@dylanjs/utils";

isObject({}); // true
isArray([1, 2, 3]); // true
isString("hello"); // true
isNumber(123); // true
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

### 7. 用户代理 (agent)

获取浏览器和系统信息。

```typescript
import { agent } from "@dylanjs/utils";

// 获取浏览器信息
console.log(agent.browser); // { name: 'Chrome', version: '91.0.4472.124' }

// 获取操作系统信息
console.log(agent.os); // { name: 'Windows', version: '10' }

// 获取设备信息
console.log(agent.device); // { type: 'desktop', mobile: false }
```

### 8. 颜色工具 (color)

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

### 9. UnoCSS 预设 (uno-preset)

UnoCSS 的预设配置。

```typescript
import { unoPreset } from "@dylanjs/utils";

// 在 UnoCSS 配置中使用
export default defineConfig({
  presets: [unoPreset()],
});
```

### 10. 唯一 ID 生成 (nanoid)

生成唯一的标识符。

```typescript
import { nanoid } from "@dylanjs/utils";

const id = nanoid(); // 生成唯一ID
```

### 11. Axios 封装

基于 axios 的 HTTP 请求封装。

```typescript
import { axios } from "@dylanjs/utils";

// 使用方式类似 fetchRequest
axios.get("/api/users").then((res) => {
  console.log(res.data);
});
```

### 12. WebSocket 工具

WebSocket 连接管理工具。

```typescript
import { websocket } from "@dylanjs/utils";

const ws = new websocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("连接已建立");
});

ws.on("message", (data) => {
  console.log("收到消息:", data);
});

ws.send("Hello Server");
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

### v1.0.0

- 初始版本发布
- 包含所有核心功能模块
- 完整的 TypeScript 支持
