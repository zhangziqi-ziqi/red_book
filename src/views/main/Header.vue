<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/request'
import { ElMessage } from 'element-plus'
const router = useRouter()
const searchType = ref('keyword')
const searchResults = ref([])
const total = ref(0)
const searchkeyword = ref('')
const data = ref({
    "keyword": "",
    "username": "",
    "hashtag": "",
    "page": 1,
    "size": 10
})
const emit = defineEmits(['search-results'])
const search = async () => {
    try {
        // 重置所有搜索字段
        data.value.keyword = ''
        data.value.username = ''
        data.value.hashtag = ''

        // 根据搜索类型设置对应字段
        switch (searchType.value) {
            case 'keyword':
                data.value.keyword = searchkeyword.value
                break
            case 'username':
                data.value.username = searchkeyword.value
                break
            case 'hashtag':
                data.value.hashtag = searchkeyword.value
                break
        }
        const res = await api.post('/posts/search', data.value)
        if (res.data.code === 1) {
            searchResults.value = res.data.data.records
            total.value = res.data.data.total
            //发送搜索结果到父组件
            emit('search-results', searchResults.value)
            // 如果没有搜索结果
            if (searchResults.value.length === 0) {
                ElMessage.info('没有找到相关内容')
            }
        } else {
            throw new Error(res.data.msg || '搜索失败')
        }
    } catch (error) {
        console.error('搜索失败：', error)
        ElMessage.error('搜索失败，请重试')
    }
}
</script>

<template>
    <div class="header">
        <div class="header-list">
            <div class="header-input">
                <el-select v-model="searchType" class="search-type">
                    <el-option label="关键词" value="keyword" />
                    <el-option label="用户" value="username" />
                    <el-option label="标签" value="hashtag" />
                </el-select>
                <input type="text" placeholder="搜索文章、用户、标签" v-model="searchkeyword">
                <button @click="search">
                    <i class="iconfont icon-sousuo"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header-input {
    display: flex;
    align-items: center;
    gap: 10px;
}

.header-input input {
    flex: 1;
    padding: 8px;
    min-width: 200px;
}

.header-input button {
    margin-right: 5px;
}

.search-type {
    min-width: 70px;
}

.search-results {
    margin-top: 20px;
}
</style>
export default Header