<script setup>
import { ref, onMounted,watch } from 'vue'
import api from '@/utils/request'
import { useRouter } from 'vue-router'
import { avatarProps } from 'element-plus';

const props = defineProps({
    posts: {
        type: Array,
        default: () => []
    }
})
const router = useRouter();
let content = ref([])
const loading = ref(true)
//"根据id获取用户"
const getUserInfo = async (userId) => {
    try {
        const res = await api.get(`/users/${userId}`);
        return {
            name: res.data.name || '未知用户',
            avatar: res.data.avatar || '@/assets/image/img.png'
        }
    } catch (error) {
        console.error('获取用户信息失败：', error);
        return {
            name: '未知用户',
            avatar: '@/assets/image/img.png'
        }
    }
}
//监听posts属性的变化
watch(() => props.posts, async (newPosts) => {
    if (newPosts) {
        if (newPosts.length === 0) {
            content.value = []
        } else {
            //使用Promise.all()并行获取用户信息
            const postsWithUserInfo = await Promise.all(
                newPosts.map(async post => {
                    const userInfo = await getUserInfo(post.userId);
                    return {
                        postId: post.postId,
                        title: post.title,
                        img: post.coverUrl || '',
                        name: userInfo.name,
                        avatar: userInfo.avatar,
                        like: post.likeCount
                    }

                })
            )
            content.value = postsWithUserInfo
        }
    }
},{ immediate: true })

onMounted(async () => {
    if (content.value.length === 0 && !props.posts?.length) {
        try {
            loading.value = true
            const res = await api.get('/posts/recommended')
            const posts = res.data.data.records
            // 获取推荐内容的用户信息
            const postsWithUserInfo = await Promise.all(
                posts.map(async post => {
                    const userInfo = await getUserInfo(post.userId)
                    return {
                        postId: post.postId,
                        title: post.title,
                        img: post.coverUrl || '',
                        name: userInfo.name,
                        avatar: userInfo.avatar,
                        like: post.likeCount
                    }
                })
            )
            content.value = postsWithUserInfo
        } catch (error) {
            console.error('获取推荐内容失败：', error)
        }finally {
            loading.value = false  // 结束加载
        }
    }
})
//带帖子id参数跳转到详情页
const goDetails = (postId) => {
    router.push({
        path: '/detail',
        query: { id: postId } 

    })
}
</script>

<template>
    <div class="content-container">
        <el-empty v-if="loading" :image-size="200">
            <template #description>
                <el-text class="mx-1" type="primary">加载中...</el-text>
            </template>
        </el-empty>
        <el-empty v-else-if="content.length === 0" description="暂无数据" />
        <ul v-else style="padding-left: 0;">
            <li v-for="(item, index) in content" :key="index">
                <div @click="goDetails(item.postId)">
                    <div class="content-img">
                        <img :src="item.img" alt="no image">
                    </div>
                    <div class="content-title">{{ item.title }}</div>
                    <div class="contentlist">
                        <img :src="item.avatar" alt="no avatar">
                        <div class="contentlist-name">{{ item.name }}</div>
                        <div class="aixin">
                            <i class="iconfont icon-aixin"></i>
                            <span>{{ item.like }}</span>

                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
