<script setup>
import { ref, onMounted } from "vue";
import Content from "@/components/Content.vue";
import api from "@/utils/request";
import { ElMessage } from "element-plus";
const noteResults = ref([]);
onMounted(async() => {
    try {
        // 查找当前用户的所有笔记
      const res = await api.get("/posts/user");
      if (res.data.code === 1) {
      noteResults.value = res.data.data;
      }
    } catch (error) {
      ElMessage.error("获取笔记失败");
      console.error(error);
    }
});
</script>

<template>
  <div class="my-note">
    <Content :posts="noteResults" />
  </div>
</template>

<style scoped>
</style>
