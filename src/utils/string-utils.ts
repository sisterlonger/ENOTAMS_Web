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
 * 将yyMMddhhss格式的字符串转换为yyyy年MM月dd日hh时mm分格式
 * @param {string} dateStr - 原始日期字符串，格式为yyMMddhhss（如"2509291430"）
 * @returns {string} 格式化后的日期字符串，格式为yyyy年MM月dd日hh时mm分
 */
export function formatCustomDate(dateStr:string):string {
    if (!dateStr || dateStr.length !== 10) {
        console.warn('日期字符串格式应为yyMMddhhss，且长度为10位');
        return dateStr; // 或返回空字符串等默认值
    }

    // 解析字符串各部分
    const yearPart = dateStr.substring(0, 2);
    const monthPart = dateStr.substring(2, 4);
    const dayPart = dateStr.substring(4, 6);
    const hourPart = dateStr.substring(6, 8);
    const minutePart = dateStr.substring(8, 10);

    // 将两位数年份转换为四位数（假设20xx年）
    const fullYear = `20${yearPart}`;

    // 返回目标格式
    return `${fullYear}年${monthPart}月${dayPart}日${hourPart}时${minutePart}分`;
}