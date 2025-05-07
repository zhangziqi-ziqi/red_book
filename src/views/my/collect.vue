<script setup>
import {ref,onMounted} from 'vue'
import Content from '@/components/Content.vue'
import api from '@/utils/request'
import { ElMessage } from 'element-plus'
const collectionResults = ref([])

onMounted(()=>{
    const collectionResultsStr = localStorage.getItem('collectionResults')
    if(collectionResultsStr){
        collectionResults.value = JSON.parse(collectionResultsStr)
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
