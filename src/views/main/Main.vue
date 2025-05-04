<script setup>
import {ref} from 'vue'
import Header from './Header.vue'
import Content from '@/components/Content.vue'

const searchResults=ref([])
const handleSearchResults=(results)=>{
    searchResults.value = results
}
</script>

<template>
<div class="layout">
    <Header @searchResults="handleSearchResults" />
    <Content :posts="searchResults" />     
</div>
</template>

<style scoped>

</style>
