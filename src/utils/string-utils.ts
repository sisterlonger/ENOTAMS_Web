// 判断是否为空（非日期类）
export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
}
// 判断是否为默认日期或者空日期
// 定义更严格的输入类型
export type DateInput = Date | string | number | null | undefined;

export function isValidDate(date: unknown): date is Date {
  // 使用类型守卫和 Number.isNaN
  return date instanceof Date && !Number.isNaN(date.getTime());
}

export function isNotDefaultOrEmpty(
  date: DateInput,
  defaultDateStr = '1900-01-01T00:00:00'
): boolean {
  // 空值检查
  if (date == null || date === '') {
    return false;
  }

  try {
    // 处理不同类型的输入
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (!isValidDate(dateObj)) {
      return false;
    }

    const defaultDateObj = new Date(defaultDateStr);
    console.log(dateObj.getTime());
    console.log(defaultDateObj.getTime());
    return dateObj.getTime() !== defaultDateObj.getTime();
  } catch (error) {
    // 日期解析错误也视为无效
    return false;
  }
}

// 
// 时间转换为yyMMddhhmm
export function formatTimeToYYMMDDHHMM (time:any) :string {
    let now = new Date();
    if (isNotDefaultOrEmpty(time)) {
        now = new Date(time);
    }

    // 获取年份的后两位
    const year = String(now.getFullYear()).slice(-2); // 注意这里是 slice(-2) 来获取后两位
    // 获取月份（注意月份从0开始，所以要+1），并确保两位数字
    const month = String(now.getMonth() + 1).padStart(2, '0');
    // 获取日期，并确保两位数字
    const day = String(now.getDate()).padStart(2, '0');
    // 获取小时，并确保两位数字
    const hours = String(now.getHours()).padStart(2, '0');
    // 获取分钟，并确保两位数字
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // 拼接成 yyMMddhhmm 格式
    return year + month + day + hours + minutes;
};


/**
 * 将多种时间格式转换为yyyy年MM月dd日hh时mm分格式
 * 支持格式：
 * 1. yyMMddhhss (如"2509291430" -> "2025年09月29日14时30分")
 * 2. yyyy-MM-dd HH:mm:ss.ffffff (如"2026-04-03 09:29:33.159169" -> "2026年04月03日09时29分")
 * 3. 标准ISO格式 (如"2026-04-03T09:29:33.159Z")
 * @param {string} dateStr - 原始日期字符串
 * @returns {string} 格式化后的日期字符串，格式为yyyy年MM月dd日hh时mm分
 */
export function formatCustomDate(dateStr: string): string {
  if (!dateStr) {
    return dateStr;
  }

  // 判断格式类型
  if (/^\d{10}$/.test(dateStr)) {
    // 格式1: yyMMddhhss (旧格式)
    const yearPart = dateStr.substring(0, 2);
    const monthPart = dateStr.substring(2, 4);
    const dayPart = dateStr.substring(4, 6);
    const hourPart = dateStr.substring(6, 8);
    const minutePart = dateStr.substring(8, 10);
    const fullYear = `20${yearPart}`;
    
    return `${fullYear}年${monthPart}月${dayPart}日${hourPart}时${minutePart}分`;
  }
  
  // 格式2/3: 新格式，使用Date对象解析
  const date = new Date(dateStr);
  
  // 检查日期是否有效，使用 Number.isNaN
  if (Number.isNaN(date.getTime())) {
    console.warn('日期字符串格式无效:', dateStr);
    return "";
  }
  
  // 提取各组成部分
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}年${month}月${day}日${hour}时${minute}分`;
}