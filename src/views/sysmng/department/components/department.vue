<template>
    <div>
        <Form v-if="depID != null" :depID="depID" @query="()=>{emit('query');depID=null}" />
    </div>
</template>

<script setup>

import { ref, defineProps, watch, toRefs,defineEmits } from 'vue'
import { Grid as TinyGrid, GridColumn as TinyGridColumn, Button as TinyButton, DialogBox as TinyDialogBox } from '@opentiny/vue'
import Form from './form.vue'


const props = defineProps({
    // eslint-disable-next-line vue/require-prop-types
    tableData: {},
});
const depID = ref(0)
const theGridRef = ref('theGridRef')
const { tableData } = toRefs(props);

const emit = defineEmits(['close','query']);

watch(
    tableData,
    (newValue) => {
        if (newValue.value != null) {
            depID.value = newValue.value.depID;
        }

    },
    { immediate: true, deep: true, }
);
</script>

<style scoped>
.title {
    font-size: 16px;
    padding: 15px;
    font-weight: bolder;
    color: #444;
}
</style>