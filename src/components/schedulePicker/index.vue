<template>
    <div class="schedule-picker">
        <!-- 周期类型选择 -->
        <tiny-radio-group v-model="scheduleType">
            <tiny-radio label="daily">每天</tiny-radio>
            <tiny-radio label="weekly">按星期</tiny-radio>
            <tiny-radio label="monthly">每月</tiny-radio>
            <tiny-radio label="custom">自定义</tiny-radio>
        </tiny-radio-group>

        <!-- 时间段输入 -->
        <div class="time-range">
            <tiny-input v-model="startTime" placeholder="开始时间(0000)" :maxlength="4"
                @change="validateTime('start')"></tiny-input>
            <span class="separator">至</span>
            <tiny-input v-model="endTime" placeholder="结束时间(0000)" :maxlength="4"
                @change="validateTime('end')"></tiny-input>
            <tiny-button type='primary' @click="confirm">确定</tiny-button>
        </div>

        <!-- 每天 -->
        <div v-if="scheduleType === 'daily'" class="schedule-content">
            <div class="tip">每天 {{ timeDisplay }}</div>
        </div>

        <!-- 按星期 -->
        <div v-if="scheduleType === 'weekly'" class="schedule-content">
            <tiny-checkbox-group v-model="selectedDays">
                <tiny-checkbox v-for="day in weekDays" :key="day.value" :label="day.value">{{ day.label
                }}</tiny-checkbox>
            </tiny-checkbox-group>
        </div>

        <!-- 每月 -->
        <div v-if="scheduleType === 'monthly'" class="schedule-content">
            <tiny-checkbox-group v-model="selectedDates">
                <div v-for="row in monthDates" :key="row" class="date-row">
                    <tiny-checkbox v-for="date in row" :key="date" :label="date">{{ date }}</tiny-checkbox>
                </div>
            </tiny-checkbox-group>
        </div>

        <!-- 自定义日期 -->
        <div v-if="scheduleType === 'custom'" class="schedule-content">
            <tiny-date-picker v-model="customDates" type="dates" value-format="yyyy-MM-dd" placeholder="选择日期"
                :picker-options="pickerOptions"></tiny-date-picker>
        </div>
        <!-- 组装D项的文本 -->
        <tiny-row class="text-content">
            <tiny-input v-model="formatted" placeholder="组装的D项文本" clearable></tiny-input>
        </tiny-row>
    </div>
</template>

<script setup>
// TODO差查重和多时段delay
import { ref, computed, defineEmits } from 'vue'
import {
    TinyRadio,
    TinyRadioGroup,
    TinyCheckbox,
    TinyCheckboxGroup,
    TinyInput,
    TinyButton,
    TinyDatePicker,
    Modal,
} from '@opentiny/vue'

const scheduleType = ref('daily')
const startTime = ref('')
const endTime = ref('')
const selectedDays = ref([])
const selectedDates = ref([])
const customDates = ref([])
const formatted = ref('')
const scheduleRules = ref([]) // 新增数组存储所有规则

const emit = defineEmits(['scheduleChange'])

const pickerOptions = ref({
    disabledDate(date) {
        return date < new Date().setHours(0, 0, 0, 0)
    }
})

const weekDays = [
    { label: '周一', value: 'MON' },
    { label: '周二', value: 'TUE' },
    { label: '周三', value: 'WED' },
    { label: '周四', value: 'THU' },
    { label: '周五', value: 'FRI' },
    { label: '周六', value: 'SAT' },
    { label: '周日', value: 'SUN' }
]

const monthDates = computed(() => {
    const dates = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    return chunkArray(dates, 7)
})

const validateTime = (type) => {
    const timeRegex = /^([01][0-9]|2[0-3])([0-5][0-9])$/;
    const time = type === 'start' ? startTime.value : endTime.value
    if (!timeRegex.test(time)) {
        Modal.alert('请输入有效的四位数字时间')
        return false
    }
    return true
}

const confirm = () => {
    if (!validateTime('start') || !validateTime('end')) return

    const rule = {
        type: scheduleType.value,
        timeRange: {
            start: startTime.value.padStart(4, '0'),
            end: endTime.value.padStart(4, '0')
        },
        days: selectedDays.value,
        dates: selectedDates.value,
        customDates: customDates.value
    }

    const currentRule = formatSchedule(rule)
    scheduleRules.value = [...new Set(scheduleRules.value), currentRule] // 去重
    formatted.value = scheduleRules.value.join(' AND ')
    emit('scheduleChange', formatted.value)
}

const formatSchedule = (rule) => {
    const timePart = formatTimeRange(rule.timeRange.start, rule.timeRange.end)
    let result = ''

    switch (rule.type) {
        case 'daily':
            result = `${timePart} DLY`
            break

        case 'weekly':
            {
                const sortedDays = [...rule.days].sort()
                result = `${timePart} ${sortedDays.join(',')}`
                break
            }

        case 'monthly':
            if (rule.dates.length > 0) {
                const datesStr = rule.dates.sort().map(d => d.padStart(2, '0')).join(',')
                result = `${timePart} EVERY ${datesStr}`
            }
            break

        case 'custom':
            if (rule.customDates.length > 0) {
                const grouped = groupByMonth(rule.customDates)
                result = Object.values(grouped)
                    .map(month => {
                        const dates = month.sort((a, b) => a.getDate() - b.getDate())
                        return `${getMonthAbbreviation(month[0].toISOString().slice(0, 7))}.${dates.join(',')}`
                    })
                    .join(' AND ')
            }
            break;
        default:
            console.error('Invalid schedule type:', rule.type)
    }

    return result
}
const formatTimeRange = (start, end) => {
    const startStr = String(start).padStart(4, '0')
    const endStr = String(end).padStart(4, '0')
    let timePart = `${startStr}-${endStr}`

    const startMinutes = parseInt(startStr.substring(0, 2), 10) * 60 + parseInt(startStr.substring(2, 4), 10)
    const endMinutes = parseInt(endStr.substring(0, 2), 10) * 60 + parseInt(endStr.substring(2, 4), 10)
    if (endMinutes < startMinutes) {
        timePart += ' (NEXT DAY)'
    }

    return timePart
}

const groupByMonth = (dates) => {
    return dates.reduce((acc, date) => {
        const monthKey = date.toISOString().slice(0, 7)
        if (!acc[monthKey]) acc[monthKey] = []
        acc[monthKey].push(date)
        return acc
    }, {})
}

const getMonthAbbreviation = (monthKey) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthIndex = parseInt(monthKey.slice(5, 7), 10) - 1
    return months[monthIndex]
}

const chunkArray = (arr, size) => {
    return arr.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(arr.slice(i, i + size))
        return acc
    }, [])
}

const formatTime = (time) => {
    return time.replace(/(\d{2})(\d{2})/, '$1:$2')
}
</script>
<style scoped>
.schedule-picker {
    padding: 20px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
}

.time-range {
    margin: 15px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}


.separator {
    color: #606266;
    padding: 0 5px;
}

.schedule-content {
    margin-top: 15px;
    padding: 10px;
    background: #f5f7fa;
    border-radius: 4px;
}

.text-content {
    margin: 15px 0;
    display: flex;
    align-items: center;
    gap: 10px;
}

.date-row {
    display: flex;
    gap: 10px;
    margin-bottom: 8px;
}

.tip {
    color: #909399;
    font-size: 14px;
}
</style>