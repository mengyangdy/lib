/**
 * 从url中提取域名
 * @param url url
 * @returns 域名
 */
export function extractDomain(url: string): string {
  return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
}

/**
 * 验证电子邮箱名
 * @param email 
 * @returns 
 */
export function validateEmail(email: string): boolean {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

/**
 * 移除多余空格
 * @param str 
 * @returns 
 */
export function setTrimOut(str:string):string{
  return str.replace(/\s\s+/g,' ')
}
