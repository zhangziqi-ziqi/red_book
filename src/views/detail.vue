<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import api from '@/utils/request'
const route = useRoute()
const detail = ref({
    title: '',
    content: '',
    userId:'',
    likeCount: 0,
})
const user = ref({
    name: '',
    avatar: '',
})
//获取用户信息
const getUserInfo = async (userId) => {
    try {
        const res = await api.get(`/users/${userId}`)
        user.value ={
            name: res.data.name || '未知用户',
            avatar: res.data.avatar || '@/assets/image/img.png'
        }
    }catch (error) {
        console.error('获取用户信息失败：', error)
        ElMessage.error('获取用户信息失败，请重试')
    }
}
//获取帖子详情
const getPostDetail = async () => {
    try {
        const postId = route.query.id
        if (!postId) {
            console.error('未找到帖子ID')
            ElMessage.error('未找到帖子ID')
            return
        }
        const res = await api.get(`/posts/detail?id=${postId}`)
        detail.value = res.data
        await getUserInfo(detail.value.userId)
    }catch (error) {
        console.error('获取帖子详情失败：', error)
        ElMessage.error('获取帖子详情失败，请重试')
    }
}
onMounted(() => {
    getPostDetail()
})
</script>

<template>
    <div class="detail">
        <div class="detail-img">
            <img :src="detail.coverUrl" alt="封面图片">
        </div>
        <div class="detail-content">
            <div class="detail-title">{{detail.title}}</div>
            <div class="deatil-info">{{ detail.content }}</div>
        </div>
        <div class="detaillist">
            <img :src="user.avatar" alt="用户头像">
            <div class="detaillist-name">{{ user.name }}</div>
            <div class="detaillist-aixin">
                <i class="iconfont icon-aixin"></i>
                <span>{{ detail.likeCount }}</span>
            </div>
        </div>
        <el-divider />
        <div class="comments">
            <div class="comments-title">评论</div>
            <ul style="padding-left: 0;">
                <li>
                    <img src="@/assets/image/img.png" alt="">
                    <div class="comments-content">
                        <div class="comments-name">用户1</div>
                        <div class="comments-text">这是一条评论</div>
                    </div>
                    <div class="conments-aixin"></div>
                    <i class="iconfont icon-aixin"></i>
                    <span>111</span>

                </li>
            </ul>
        </div>
    </div>

</template>

<style scoped>
:root {
    --width: 1080px;
}
.detail {
    max-width: var(--width);
    min-width: 320px;
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 60px;
    background-color: #fff;
}

.detail-img {
    width: 100%;
    height: 300px;
    background-color: #F7F7F7;
    text-align: center;
    overflow: hidden;
}

.detail-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.detail-content {
    padding: 20px;
}

.detail-title {
    font-size: 20px;
    font-weight: 600;
}

.detail-info {
    font-size: 14px;
    color: #5C5C5C;
    margin: 10px 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.detaillist {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 20px;
    margin-left: 20px;
}

.detaillist img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.detaillist-name {
    font-size: 12px;
    color: #5C5C5C;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    flex: 1;
}

.detaillist-aixin {
    display: flex;
    align-items: center;
}

.detaillist-aixin i {
    font-size: 24px;
}

.comments {
    max-width: var(--width);
    min-width: 320px;
    padding: 20px;
    margin-bottom: 60px;
    background-color: #fff;
}

.comments ul li {
    display: flex;
}

.comments-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
}

.comments ul li img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.comments-name {
    font-size: 12px;
    color: #5C5C5C;
}

.comments-content {
    display: block;
    flex:1;
    margin-left: 10px;
}

.comments-text {
    font-size: 12px;
    -webkit-box-orient: vertical;
}
</style>
