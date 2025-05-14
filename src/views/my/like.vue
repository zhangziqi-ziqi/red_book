<script setup>
import {ref,onMounted} from 'vue'
import Content from '@/components/Content.vue'
import {ElMessage} from 'element-plus'
import api from '@/utils/request'

const likeResults = ref([])

onMounted(async()=>{
    try {
        const res = await api.get('/likes/my-liked-posts')
        likeResults.value = res.data.data
    }catch (error) {
        console.error('获取点赞内容失败：', error)
        ElMessage.error('获取点赞内容失败，请重试')
    }
})
</script>

<template>
<div class="my-like">
    <Content :posts="likeResults"/>
</div>
</template>

<style scoped>

</style>
