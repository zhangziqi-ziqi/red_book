<script setup>
import {ref} from 'vue'
import Header from './Header.vue'
import Content from '@/components/Content.vue'
import {onMounted} from 'vue'
import api from '@/utils/request.ts'
import {ElMessage} from 'element-plus'

const posts = ref([])
const searchResults=ref([])
const tags = ref([
])

onMounted(async () => {
    try {
        const response = await api.get('/posts/categories')
        tags.value = response.data.data
        if (tags.value.length > 0) {
            activeTag.value = tags.value[0].id
            await fetchPosts(activeTag.value)
        }
    }catch (error) {
        console.error('Get tags failed:', error)
        ElMessage.error('获取标签失败')
    }
})

const activeTag = ref(1)
const handleTagClick = async(tagId) => {
    activeTag.value = tagId
    await fetchPosts(tagId)

}
const fetchPosts = async (categoryId) => {
    try {
        const data = {
            page: 1,
            pageSize: 10,
            categoryId: categoryId,
        }
        const response = await api.get(`/posts/recommended`,data)
        posts.value = response.data
    } catch (error) {
        console.error('获取帖子失败:', error)
        ElMessage.error('获取帖子失败')
    }
}
const handleSearchResults=(results)=>{
    searchResults.value = results
}
</script>

<template>
<div class="layout">
    <Header @searchResults="handleSearchResults" />
      <!-- 添加标签滚动条 -->
      <div class="tags-container">
            <div class="tags-scroll">
                <div 
                    v-for="tag in tags" 
                    :key="tag.id"
                    :class="['tag-item', { active: activeTag === tag.id }]"
                    @click="handleTagClick(tag.id)"
                >
                    {{ tag.name }}
                </div>
            </div>
        </div>
    <Content :posts="searchResults.length > 0 ? searchResults : posts"/>     
</div>
</template>

<style scoped>
.layout {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.tags-container {
    width: 100%;
    overflow: hidden;
    background: #fff;
    border-bottom: 1px solid #eee;
}

.tags-scroll {
    display: flex;
    overflow-x: auto;
    padding: 10px;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
}

.tags-scroll::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
}

.tag-item {
    flex-shrink: 0;
    padding: 6px 16px;
    margin-right: 12px;
    border-radius: 16px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    background: #fff;
    cursor: pointer;
    transition: all 0.3s;
}

.tag-item:hover {
    background: #f1f1f1;
}

.tag-item.active {
    color: #ff2442;
    background: #edececfd;
}
</style>
