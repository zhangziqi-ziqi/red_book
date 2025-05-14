<script setup>
import {ref,onMounted} from 'vue'
import Content from '@/components/Content.vue'
import api from '@/utils/request'
import { ElMessage } from 'element-plus'
const collectionResults = ref([])

onMounted(async()=>{
        try {
            const res = await api.get('/collects/list')
            const collectionResults = res.data.data
        }catch (error) {
            console.error('获取收藏内容失败：', error)
            ElMessage.error('获取收藏内容失败，请重试')      
        }
})
</script>

<template>
<div class="my-collection">
    <Content :posts="collectionResults"/>
</div>
</template>

<style scoped>

</style>
