<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import api from "@/utils/request";
import { useRouter } from "vue-router";
import { Plus } from "@element-plus/icons-vue";
const router = useRouter();

const user = ref({
  id: 0,
  name: "",
  avatar: "",
  bio: "",
  school: "",
  gender: "未知",
  birthday: "",
  region: "",
  followingCount: 0,
});

const getInfo = async () => {
  try {
    const response = await api.get("/users/me");
    const userData = response.data.data;
    user.value = {
      // 使用 .value 因为是 ref
      id: userData.userId,
      name: userData.username,
      avatar: userData.avatarUrl || "/src/assets/image/img.png", // 使用正确的静态资源路径
      bio: userData.bio || "",
      school: userData.school || "",
      gender: userData.gender || "",
      birthday: userData.birthday || "",
      region: userData.region || "",
      followingCount: 0,
    };
    ElMessage.success("获取用户信息成功");
  } catch (error) {
    console.error("获取用户信息失败：", error);
    ElMessage.error("获取用户信息失败，请重试");
    //未登录则跳转到登录页，实际使用中应该不会触发
    // if (error.response?.status === 401) {
    //     router.push('/login')
    // }
  }
};
const logout = async () => {
  try {
    await api.post("/users/logout");
    localStorage.removeItem("token");
    ElMessage.success("退出登录成功");
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
    ElMessage.error("退出登录失败，请重试");
  }
};
onMounted(() => {
  getInfo();
});

const beforeAvatarUpload = (file: File) => {
  //限制图片类型和大小
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    ElMessage.error("上传头像图片只能是 JPG或PNG 格式!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("上传头像图片大小不能超过 2MB!");
    return false;
  }
  return true;
};
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};
const uploadHeaders = computed(() => getHeaders());
const dialogVisible = ref(false);
const editForm = ref({
  username: "",
  password: "",
  email: "",
  phone: "",
  avatarUrl: "",
  nickname: "",
  gender: "",
  birthday: "",
  school: "",
  region: "",
  bio: "",
});

// 打开编辑对话框时初始化表单数据
const handleEdit = () => {
  editForm.value = {
    username: user.value.name,
    password: "",
    email: "",
    phone: "",
    avatarUrl: user.value.avatar,
    nickname: user.value.name,
    gender: user.value.gender,
    birthday: user.value.birthday,
    school: user.value.school,
    region: user.value.region,
    bio: user.value.bio,
  };
  dialogVisible.value = true;
};
const handleAvatarSuccess = (response: any, uploadFile: any) => {
  //上传成功后，将返回图片的url赋值给表单
  if (response.code === 1) {
    editForm.value.avatarUrl = response.data;  // 直接使用 response.data，因为它已经包含了完整的URL
  } else {
    ElMessage.error('头像上传失败');
  }
};
const goToFollowing = () => {
  router.push(`/following/${user.value.id}`);
};
// 提交编辑表单
const submitForm = async () => {
  try {
    await api.put(`/users/${user.value.id}`, editForm.value);
    ElMessage.success("个人资料更新成功");
    dialogVisible.value = false;
    // 重新获取用户信息以更新显示
    getInfo();
  } catch (error) {
    console.error("更新个人资料失败：", error);
    ElMessage.error("更新个人资料失败，请重试");
  }
};
</script>

<template>
  <div class="my">
    <div class="header">
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
    </div>

    <div class="myadmin">
      <div class="profile-header">
        <div class="avatar-section">
          <img :src="user.avatar" alt="no avatar" />
        </div>
        <div class="myadmin-info">
          <div class="myadmin-name">{{ user.name }}</div>
          <div class="myadmin-id">ID: {{ user.id }}</div>
          <div class="follow-stats">
            <div class="stat-item" @click="goToFollowing">
              <div class="stat-count">{{ user.followingCount || 0 }}</div>
              <div class="stat-label">关注</div>
            </div>
          </div>
        </div>
      </div>
      <div class="my-brief">{{ user.bio }}</div>
      <div class="user-details">
        
        <div v-if="user.school" class="detail-item">
          <i class="el-icon-school"></i>
          <span>{{ user.school }}</span>
        </div>
        <div v-if="user.gender" class="detail-item">
          <span>{{
            user.gender === "male"
              ? "男"
              : user.gender === "female"
              ? "女"
              : "保密"
          }}</span>
        </div>
        <div v-if="user.birthday" class="detail-item">
          <i class="el-icon-date"></i>
          <span>{{ user.birthday }}</span>
        </div>
        <div v-if="user.region" class="detail-item">
          <i class="el-icon-location"></i>
          <span>{{ user.region }}</span>
        </div>
      </div>
      

      <el-button
        type="primary"
        size="small"
        @click="handleEdit"
        class="edit-btn"
      >
        编辑资料
      </el-button>
    </div>
    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" title="编辑个人资料" width="50%">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="editForm.password"
            type="password"
            placeholder="不修改请留空"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/api/common/upload"
            :headers="uploadHeaders"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <img class="avatar" :src="editForm.avatarUrl" alt="Avatar" />
            <Pluss />
          </el-upload>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editForm.nickname" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editForm.gender">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
            <el-option label="保密" value="secret" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="学校">
          <el-input v-model="editForm.school" />
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="editForm.region" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="editForm.bio" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="content-tabs">
      <ul class="mylist">
        <router-link :to="{ path: '/my/note' }">笔记</router-link>
        <router-link :to="{ path: '/my/collect' }">收藏</router-link>
        <router-link :to="{ path: '/my/like' }">赞过</router-link>
      </ul>
    </div>

    <div class="sub-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.my {
  padding: 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.logout {
  position: absolute;
  top: 12px;
  right: 16px;

}
.myadmin {
  position: relative;
  margin: 16px;
  background-color: #fff;
}
.user-details {
    position: absolute;
    bottom: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
  height: 24px;
}
.profile-header {
  display: flex;
  gap: 24px;
  margin-bottom: 40px;
}

.avatar-section img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f0f0f0;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
}

.myadmin-info {
  flex: 1;
}

.myadmin-name {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.myadmin-id {
  color: #999;
  font-size: 12px;
  margin-bottom: 12px;
}
.follow-stats {
    position: absolute;
    display: flex;
    top: 12px;
    right: 40px;
}
.stat-item {
  cursor: pointer;
  text-align: center;
}
.stat-count {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}
.my-brief {
    display: flex;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin: 12px 0;
  padding: 12px 0;
  border-top: 1px solid #f0f0f0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background-color: #f8f9fa;
  border-radius: 10px;
  font-size: 12px;
}

.detail-item:hover {
  background-color: #f0f0f0;
}

.detail-item i {
  font-size: 14px;
  color: #666;
}

.content-tabs {
  position: sticky;
  top: 44px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  z-index: 99;
}
.mylist {
  display: flex;
  margin: 0;
  padding: 0 16px;
  list-style: none;
  height: 44px;
  align-items: center;
}

.mylist a {
  color: #666;
  text-decoration: none;
  padding: 5px 10px;
  position: relative;
}

.mylist a:hover,
.mylist a.router-link-active {
  color: #409eff;
}
.edit-btn {
  position: absolute;
  right: 16px;
  margin-top: 16px;
}

.dialog-footer {
  text-align: right;
}
.avatar-uploader {
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>