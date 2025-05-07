<script setup>
import {ref,onMounted} from 'vue'
import Content from '@/components/Content.vue'
import {ElMessage} from 'element-plus'
import api from '@/utils/request'

const likeResults = ref([])

onMounted(()=>{
    const likeResultsStr = localStorage.getItem('likeResults')
    if(likeResultsStr){
        likeResults.value = JSON.parse(likeResultsStr)
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
