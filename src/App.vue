<script setup>
import index from '@/views/index.vue';
import {ref,onMounted} from 'vue' 
import axios from 'axios'
</script>

<template>
  <router-view />
</template>

<style scoped>
.div{
  width: 100%;
  height: 100%;
  text-align: center;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
