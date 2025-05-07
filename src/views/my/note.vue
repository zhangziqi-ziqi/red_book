<script setup>
import {ref,onMounted} from 'vue'
import Content from '@/components/Content.vue'
import api from '@/utils/request'
import { ElMessage } from 'element-plus'
const noteResults = ref([])

onMounted(()=>{
    const noteResultsStr = localStorage.getItem('noteResults')
    if(noteResultsStr){
        noteResults.value = JSON.parse(noteResultsStr)
    }
})
</script>

<template>
<div class="my-note">
    <Content :posts="noteResults"/>
</div>
</template>

<style scoped>

</style>
