<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import Content from '@/components/Content.vue'
import { ElMessage } from 'element-plus'
import api from '@/utils/request'
import { useRouter } from 'vue-router'
const router = useRouter()

const user = ref({
    id: 0,
    name: '',
    avatar: '',
    brief: ''
})

const getInfo = async () => {
    try {
        const response = await api.get('/users/me')
        ElMessage.info('获取用户信息成功', response.data.data)
        user.value = response.data.data
        if(!user.value.avatar){
            user.value.avatar = '@/assets/image/img.png'//设置为默认头像
        }
    }  catch (error) {
        console.error('获取用户信息失败：', error)
        ElMessage.error('获取用户信息失败，请重试')
        //未登录则跳转到登录页，实际使用中应该不会触发
        // if (error.response?.status === 401) {
        //     router.push('/login')
        // }
    }
}
const logout = async () => {
    
    try{
        await api.post('/users/logout')
        localStorage.removeItem('token')
        ElMessage.success('退出登录成功')
        router.push('/login')
    }catch (error) {
        console.error('Logout failed:', error)
        ElMessage.error('退出登录失败，请重试')
    }
}
onMounted(() => {
    getInfo()
})
</script>

<template>
    <div class="my">
        <div class="logout">
            <el-popover placement="bottom-start" :width="200" trigger="hover">
                <template #reference>
                    <el-button class="m-2">
                        <i class="iconfont icon-RectangleCopy"></i>
                    </el-button>
                </template>
                <div @click="logout">退出登录</div>
            </el-popover>
        </div>
        <div class="myadmin">
            <img :src="user.avatar" alt="no avatar">
            <div class="myadmin-info">
                <div class="myadmin-name">{{user.name}}</div>
                <div class="myadmin-id">id:{{user.id}}</div>
            </div>
        </div>
        <div class="my-brief">{{user.brief}}</div>
        <ul class="mylist">
            <router-link :to="{ path: '/my/note' }">笔记</router-link>
            <router-link :to="{ path: '/my/collect' }">收藏</router-link>
            <router-link :to="{ path: '/my/like' }">赞过</router-link>
        </ul>
        <div class="sub-content">
            <router-view />
        </div>
    </div>
</template>

<style scoped>
.my {
    padding: 20px;
}

.logout {
    text-align: right;
}

.myadmin {
    display: flex;
    align-items: center;
    margin: 20px 0;
}

.myadmin img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 20px;
}

.myadmin-info {
    flex: 1;
}

.myadmin-name {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 5px;
}

.myadmin-id {
    color: #666;
    font-size: 14px;
}

.my-brief {
    color: #666;
    margin: 10px 0;
}

.mylist {
    display: flex;
    gap: 20px;
    margin: 20px 0;
    padding: 0;
    list-style: none;
}

.mylist a {
    color: #333;
    text-decoration: none;
    padding: 5px 10px;
}

.mylist a:hover,
.mylist a.router-link-active {
    color: #409EFF;
}
</style>