export type ThrottledFunction<
  T extends (...args: any[]) => any,
  TThis = unknown
> = (
  this: TThis,
  ...args: Parameters<T>
) => Promise<ReturnType<T>> & {
  cancel: () => void;
};

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * 函数节流装饰器，用于限制函数在特定时间间隔内只能执行一次。
 * 如果在节流期间多次调用，只有最后一次调用会被执行。
 * 
 * @param fn 要进行节流处理的函数。
 * @param interval 节流的时间间隔，单位为毫秒。
 * @param options 节流的可选配置，包括 leading 和 trailing 参数。
 * @returns 返回一个节流后的函数，该函数的执行会受到节流限制。
 */
export function Throttle<T extends (...args: any[]) => any, TThis = unknown>(
  fn: T,
  interval: number,
  options: ThrottleOptions = {}
): ThrottledFunction<T, TThis> {
  // 记录最后一次执行的时间戳
  let startTime = 0;
  // 定时器，用于在节流期间安排函数执行
  let timer: ReturnType<typeof setTimeout> | null = null;
  // 解构节流配置，如果没有设置，默认 leading 和 trailing 都为 false
  const { leading = false, trailing = false } = options;

  /**
   * 实际执行的节流函数。
   * 如果当前调用在节流时间之外，且允许 leading 调用，则立即执行函数。
   * 如果当前调用在节流时间之内，且允许 trailing 调用，则在节流时间结束后执行函数。
   * 
   * @param this 函数执行上下文。
   * @param args 函数的参数。
   * @returns 返回一个 Promise，表示异步操作。
   */
  const _throttle = function (
    this: TThis,
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
      try {
        // 当前时间
        const nowTime = Date.now();
        // 如果允许 leading 调用且是第一次调用，则记录当前时间为起始时间
        if (leading && startTime === 0) {
          startTime = nowTime;
        }
        // 计算剩余等待时间
        const waitTime = interval - (nowTime - startTime);
        // 如果等待时间小于等于0，表示已经过了节流时间，可以执行函数
        if (waitTime <= 0) {
          // 清除上一次的定时器
          if (timer) clearTimeout(timer);
          // 执行函数并返回结果
          const res = fn.apply(this, args);
          resolve(res);
          // 更新起始时间为当前时间
          startTime = nowTime;
          // 重置定时器
          timer = null;
          return;
        }
        // 如果允许 trailing 调用且没有定时器，则设置定时器在节流时间结束后执行函数
        if (trailing && !timer) {
          timer = setTimeout(() => {
            const res = fn.apply(this, args);
            resolve(res);
            // 更新起始时间为当前时间
            startTime = Date.now();
            // 重置定时器
            timer = null;
          }, waitTime);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  /**
   * 为节流函数添加一个 cancel 方法，用于取消当前的节流操作。
   * 这允许在节流期间随时取消函数的执行。
   */
  const throttledWithCancel = Object.assign(_throttle, {
    cancel: function (this: ThrottledFunction<T, TThis>) {
      // 清除定时器并重置起始时间
      if (timer) clearTimeout(timer);
      startTime = 0;
      timer = null;
    },
  }) as unknown as ThrottledFunction<T, TThis>;

  // 返回带有 cancel 方法的节流函数
  return throttledWithCancel;
}
