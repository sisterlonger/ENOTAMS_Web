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
            <tiny-button @click="confirm">确定</tiny-button>
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
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    TinyRadio,
    TinyRadioGroup,
    TinyCheckbox,
    TinyCheckboxGroup,
    TinyInput,
    TinyButton,
    TinyDatePicker
} from '@opentiny/vue'

const scheduleType = ref('daily')
const startTime = ref('')
const endTime = ref('')
const selectedDays = ref([])
const selectedDates = ref([])
const customDates = ref([])

// 日期选择器配置
const pickerOptions = ref({
    disabledDate(date) {
        return date < new Date().setHours(0, 0, 0, 0)
    }
})

// 星期选项
const weekDays = [
    { label: '周一', value: 'MON' },
    { label: '周二', value: 'TUE' },
    { label: '周三', value: 'WED' },
    { label: '周四', value: 'THU' },
    { label: '周五', value: 'FRI' },
    { label: '周六', value: 'SAT' },
    { label: '周日', value: 'SUN' }
]

// 生成1-31的日期矩阵
const monthDates = computed(() => {
    const dates = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    return chunkArray(dates, 7)
})

// 时间显示格式
const timeDisplay = computed(() => {
    if (!startTime.value || !endTime.value) return ''
    return `${formatTime(startTime.value)} - ${formatTime(endTime.value)}`
})

// 验证时间格式
const validateTime = (type) => {
    const timeRegex = /^([0-2][0-9])([0-5][0-9])$/
    const time = type === 'start' ? startTime.value : endTime.value
    if (!timeRegex.test(time)) {
        if (type === 'start') startTime.value = ''
        else endTime.value = ''
        alert('请输入有效的四位数字时间')
    }
}

// 生成最终规则
const emit = defineEmits(['scheduleChange'])
const confirm = () => {
    const rule = {
        type: scheduleType.value,
        timeRange: {
            start: startTime.value,
            end: endTime.value
        },
        days: [],
        dates: [],
        customDates: []
    }

    switch (scheduleType.value) {
        case 'weekly':
            rule.days = [...selectedDays.value]
            break
        case 'monthly':
            rule.dates = [...selectedDates.value]
            break
        case 'custom':
            rule.customDates = [...customDates.value]
            break
        default:
            console.log('xx');
            break;
    }

    emit('scheduleChange', rule)
}

// 工具函数
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