/**
 * 判断是否是今天
 * @param date
 * @returns
 */
export function isToday(date: Date): boolean {
  return (
    date.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
  );
}

/**
 * 将日期转换为YYYY-MM-DD格式
 * @param date
 * @returns
 */
export function formatYMD(date: Date) {
  return date.toISOString().slice(0, 10);
}

/**
 * 将秒数转换为hh:mm:ss格式
 * @param s
 */
export function formatSeconds(s: number) {
  return new Date(s * 1000).toISOString().substr(11, 8);
}

/**
 * 获取指定年份的某个月份的第一天
 * @param d 日期
 * @returns
 */
export function getFirstDate(d: Date = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * 获取指定年份的某个月的最后一天
 * @param d 日期
 * @returns
 */
export function getLastDate(d: Date = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/**
 * 获取指定年份的某个月份的天数
 * @param year number
 * @param month number
 * @returns number
 */
export function getDaysNum(year:number,month:number):number{
  return new Date(year,month,0).getDate()
}
