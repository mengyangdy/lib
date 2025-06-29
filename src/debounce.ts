/**
 * 1. 基本实现
2. 优化一:优化参数和 this 指向
3. 优化二:优化取消操作
4. 优化三:优化立即执行效果
5. 优化四:优化返回值
6. 优化五:增加 promise
 * 防抖函数
 * @description 多次触发事件 只执行最后一次事件  延迟执行  可以设置立即执行
 * @example MyDebounce(fn, 1000, false, resultCallback)
 * @param fn 函数
 * @param delay 延迟时间
 * @param immediate 是否立即执行
 * @param resultCallback 回调函数
 * @returns 函数
 */

type DebouncedFunction<T extends (...args: any[]) => any, TThis = unknown> = (
  this: TThis,
  ...args: Parameters<T>
) => Promise<ReturnType<T>> & {
  cancel: () => void;
};

export function Debounce< T extends (...args: any[]) => any,TThis = unknown>(fn:T, delay:number, immediate:boolean = false, resultCallback?:(result: ReturnType<T>) => void): DebouncedFunction<T,TThis> {
  // 用于记录上一次事件触发的timer
  let timer: NodeJS.Timeout | null = null
  let isInvoke = false
  // 触发事件时执行的函数
  const _debounce = function (this: TThis,...args: Parameters<T>):Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
      try {
        // 多次触发事件 取消上一次的事件
        if (timer) clearTimeout(timer)

        let res: ReturnType<T>

        // 立即执行
        if (immediate && !isInvoke) {
          res = fn.apply(this, args)
          if (resultCallback && res !== undefined) resultCallback(res)
          resolve(res)
          isInvoke = true
          return
        }

        // 延迟执行对应的fn函数
        timer = setTimeout(() => {
          res = fn.apply(this, args)
          if (resultCallback && res !== undefined) resultCallback(res)
          resolve(res)
          timer = null
        }, delay)
      } catch (error) {
        reject(error)
      }
    })
  } as DebouncedFunction<T, TThis>;

  // 取消功能实现
  _debounce.cancel = function (this: DebouncedFunction<T, TThis>):void {
    if (timer) clearTimeout(timer)
    timer = null
    isInvoke = false
  }

  return _debounce
}