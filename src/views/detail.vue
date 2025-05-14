<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import api from "@/utils/request";
const route = useRoute();
const detail = ref({
  title: "",
  content: "",
  userId: "",
  likeCount: 0,
  favoriteCount: 0,
  comments: [],
  isLiked: false,
  isFavorited: false,
  isFollowed: false,
  commentIds: [],
});
const newComment = ref("");
// 关注发帖人
const handleFollow = async () => {
  try {
    if (!detail.value.isFollowed) {
      const res = await api.post(`/follows?userId=${detail.value.userId}`);
      detail.value.isFollowed = true;
      ElMessage.success("关注成功");
    } else {
      const res = await api.delete(`/follows?userId=${detail.value.userId}`);
      detail.value.isFollowed = false;
      ElMessage.success("取消关注");
    }
  } catch (error) {
    console.error("关注操作失败：", error);
    ElMessage.error("关注操作失败，请重试");
  }
};
//点赞
const user = ref({
  name: "",
  avatar: "",
});
const handleLike = async () => {
  try {
    const postId = route.query.id;
    if (!detail.value.isLiked) {
    const res = await api.post(`/likes?postId=${postId}`);
      detail.value.isLiked = true;
      detail.value.likeCount =  detail.value.likeCount + 1
      ElMessage.success( "点赞成功" );
    }else if (detail.value.isLiked) {
      const res = await api.delete(`/likes?postId=${postId}`);
      detail.value.isLiked = false;
      detail.value.likeCount =  detail.value.likeCount - 1
      ElMessage.success( "取消点赞" );
    }
  } catch (error) {
    console.error("点赞失败：", error);
    ElMessage.error("点赞失败，请重试");
  }
};

// 收藏
const handleFavorite = async () => {
  try {
    const postId = route.query.id;
    if (!detail.value.isFavorited) {
        const res = await api.post(`/collects?postId=${postId}`);
      detail.value.isFavorited =true;
      detail.value.favoriteCount = detail.value.favoriteCount + 1
      ElMessage.success("收藏成功");
    }else if (detail.value.isFavorited) {
      const res = await api.delete(`/collects?postId=${postId}`);
      detail.value.isFavorited = false;
      detail.value.favoriteCount = detail.value.favoriteCount - 1
      ElMessage.success("取消收藏");
    }
  } catch (error) {
    console.error("收藏失败：", error);
    ElMessage.error("收藏失败，请重试");
  }
};

// 评论
const submitComment = async () => {
  try {
    if (!newComment.value.trim()) {
      ElMessage.warning("请输入评论内容");
      return;
    }
    const articleId = route.query.id;
    const res = await api.post(`/comments`, {
      articleId: articleId,
      content: newComment.value,
      parentId: 0,
    });
    if (res.data.success) {
      ElMessage.success("评论成功");
      newComment.value = "";
      await getCommentList(detail.value.commentIds);
    }
  } catch (error) {
    console.error("评论失败：", error);
    ElMessage.error("评论失败，请重试");
  }
};
// 删除评论
const handleDeleteComment = async (commentId) => {
  try {
    const res = await api.delete(`/comments/${commentId}`);
    if (res.data.success) {
      ElMessage.success("删除评论成功");
      await getCommentList();
    }
  } catch (error) {
    console.error("删除评论失败：", error);
    ElMessage.error("删除评论失败，请重试");
  }
};

// 回复评论
const replyComment = ref("");
const showReplyInput = ref(null);

const handleReply = async (parentId) => {
  try {
    if (!replyComment.value.trim()) {
      ElMessage.warning("请输入回复内容");
      return;
    }
    const articleId = route.query.id;
    const res = await api.post(`/comments`, {
      articleId: articleId,
      content: replyComment.value,
      parentId: parentId,
    });
    if (res.data.success) {
      ElMessage.success("回复成功");
      replyComment.value = "";
      showReplyInput.value = null;
      await getCommentList();
    }
  } catch (error) {
    console.error("回复失败：", error);
    ElMessage.error("回复失败，请重试");
  }
};
//获取评论id列表
const getCommentList = async (commentIds) => {
  try {
    const articleId = route.query.id;
    const res = await api.get(`/comments/article/${articleId}/all`);
    detail.value.comments= res.data.data;
    console.log(detail.value.comments);
    for(const comment of detail.comments.value){
        await getUserInfo(comment.userId);
    }
  } catch (error) {
    console.error("获取评论列表失败：", error);
    ElMessage.error("获取评论列表失败，请重试");
  }
};
//获取用户信息
const getUserInfo = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}`);
    user.value = {
      name: res.data.data.username || "未知用户",
      avatar: res.data.data.avatarUrl || "@/assets/image/img.png",
    };
  } catch (error) {
    console.error("获取用户信息失败：", error);
    ElMessage.error("获取用户信息失败，请重试");
  }
};
//获取帖子详情
const getPostDetail = async () => {
  try {
    const postId = route.query.id;
    if (!postId) {
      console.error("未找到帖子ID");
      ElMessage.error("未找到帖子ID");
      return;
    }
    const res = await api.get(`/posts/${postId}`);
    detail.value = res.data;
    detail.value.likeCount= res.data.likeCount;
    detail.value.favoriteCount= res.data.collectionCount;
    // 从本地存储获取关注列表
    const followList = JSON.parse(localStorage.getItem('followList') || '[]');
    // 判断当前用户是否在关注列表中
    detail.value.isFollowed = followList.includes(detail.value.userId);
    if(await (await api.get(`/likes?postId=${postId}`)).data.msg==="未点赞"){
        detail.value.isLiked=false;
    }else{
        detail.value.isLiked=true;
    }
    if(await (await api.get(`/collects?postId=${postId}`)).data.msg==="未收藏"){
        detail.value.isFavorited=false;
    }else{
        detail.value.isFavorited=true;
    }
    await getUserInfo(detail.value.userId);
    await getCommentList();
  } catch (error) {
    console.error("获取帖子详情失败：", error);
    // ElMessage.error("获取帖子详情失败，请重试");
  }
};
onMounted(() => {
  getPostDetail();
});
</script>

<template>
  <div class="detail">
    <div class="detail-img">
      <img :src="detail.coverUrl" alt="封面图片" />
    </div>
    <div class="detail-content">
      <div class="detail-title">{{ detail.title }}</div>
      <div class="deatil-info">{{ detail.content }}</div>
    </div>
    <div class="detaillist">
      <img :src="user.avatar" alt="用户头像" />
      <div class="detaillist-name">{{ user.name }}</div>
      <el-button 
        type="primary" 
        size="small" 
        @click="handleFollow"
        :class="{ 'is-followed': detail.isFollowed }"
      >
        {{ detail.isFollowed ? '已关注' : '关注' }}
      </el-button>
      <div class="detaillist-aixin">
        <i class="iconfont icon-aixin"></i>
        <span>{{ detail.likeCount }}</span>
      </div>
    </div>
    <div class="action-buttons">
      <el-button type="primary" @click="handleLike">
        <i
          class="iconfont"
          :class="detail.isLiked ? 'icon-aixin-filled' : 'icon-aixin'"
        ></i>
        {{ detail.likeCount }}
      </el-button>
      <el-button type="success" @click="handleFavorite">
        <i
          class="iconfont"
          :class="detail.isFavorited ? 'icon-shoucang-filled' : 'icon-shoucang'"
        ></i>
        收藏
      </el-button>
    </div>
    <el-divider />

    <div class="comments">
      <div class="comments-title">评论</div>
      <div class="comment-input">
                <el-input
                    v-model="newComment"
                    type="textarea"
                    :rows="2"
                    placeholder="写下你的评论..."
                />
                <el-button type="primary" @click="submitComment">发表评论</el-button>
            </div>
      <ul style="padding-left: 0">
        <li v-for="comment in detail.comments" :key="comment.id">
          <!-- <img :src="comment.user.avatar" :alt="comment.user.name"/> -->
          <div class="comments-content">
            <div class="comments-name">{{ comment.nickname }}</div>
            <div class="comments-text">{{ comment.content }}</div>
            <div class="comment-actions">
              <span class="reply-btn" @click="showReplyInput = comment.id">回复</span>
              <span 
                v-if="comment.userId === currentUserId" 
                class="delete-btn" 
                @click="handleDeleteComment(comment.id)"
              >
                删除
              </span>
            </div>
             <!-- 回复输入框 -->
             <div v-if="showReplyInput === comment.id" class="reply-input">
              <el-input
                v-model="replyComment"
                type="textarea"
                :rows="1"
                placeholder="回复评论..."
              />
              <div class="reply-actions">
                <el-button size="small" @click="showReplyInput = null">取消</el-button>
                <el-button type="primary" size="small" @click="handleReply(comment.id)">
                  回复
                </el-button>
              </div>
            </div>
            <div class="conments-aixin"></div>
            <i class="iconfont icon-aixin"></i>
            <span>{{ comment.likeNum || 0 }}</span>
            <!-- 子评论列表 -->
            <div v-if="comment.children && comment.children.length > 0" class="sub-comments">
              <div v-for="subComment in comment.children" :key="subComment.id" class="sub-comment">
                <div class="sub-comment-content">
                  <span class="sub-comment-name">{{ subComment.nickname }}</span>
                  <span class="sub-comment-text">{{ subComment.content }}</span>
                </div>
              </div>
            </div>
          </div>
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
  background-color: #f7f7f7;
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
  color: #5c5c5c;
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
  color: #5c5c5c;
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
.is-followed {
  background-color: #f5f5f5;
  color: #909399;
}

.comment-actions {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
.comments {
  max-width: var(--width);
  min-width: 320px;
  padding: 20px;
  margin-bottom: 60px;
  background-color: #fff;
}
.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin: 20px;
}

.comment-input {
    margin-bottom: 20px;
}

.comment-input .el-button {
    margin-top: 10px;
    float: right;
}
.comments ul { 
    margin-top: 60px;  /* 增加评论列表的顶部边距 */
  list-style: none;  /* 移除列表默认样式 */
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
  color: #5c5c5c;
}

.comments-content {
  display: block;
  flex: 1;
  margin-left: 10px;
}

.comments-text {
  font-size: 12px;
  -webkit-box-orient: vertical;
}
.comments-aixin {
    display: flex;
    align-items: center;
    margin-left: auto;
    cursor: pointer;
}

.comments-aixin i {
    font-size: 16px;
    margin-right: 4px;
}

.icon-aixin-filled {
    color: #ff4757;
}

.icon-shoucang-filled {
    color: #ffd700;
}
.reply-btn, .delete-btn {
  margin-right: 15px;
  cursor: pointer;
}

.delete-btn {
  color: #f56c6c;
}

.reply-input {
  margin: 10px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.reply-actions {
  margin-top: 10px;
  text-align: right;
}

.sub-comments {
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px solid #eee;
}

.sub-comment {
  margin: 8px 0;
  font-size: 12px;
}

.sub-comment-name {
  color: #409eff;
  margin-right: 5px;
}

.sub-comment-text {
  color: #606266;
}
</style>