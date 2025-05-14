<script setup>
import Window from '@/components/Window.vue'
import { ref, onMounted } from 'vue'
import AIChat from '../ai/AIChat.vue'
</script>

<template>
  <div class="post-container">
    <Window></Window>
    <!-- AI聊天界面 -->
     <!-- AI聊天界面（直接显示） -->
     <div class="ai-chat-section">
      <AIChat />
    </div>
  </div>
</template>

<style scoped>
.post-container {
  position: relative;
  min-height: 100vh;
  margin-bottom: 60px;
}
.ai-chat-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.ai-chat-container {
    width: 80%;
    height: 80%;
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
}
</style>
