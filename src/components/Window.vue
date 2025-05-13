<script setup>

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, reactive } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElButton, ElDialog, ElForm, ElFormItem, ElInput,ElMessage } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import api from '@/utils/request.ts'
import { Plus } from '@element-plus/icons-vue'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>Ajax 异步设置内容</p>'
  }, 1500)
})

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const mode = 'default' // 或 'simple'

const dialogVisible = ref(false)

const formData = ref({
  title: '',
  tags: '',
  category: '',
})
const handleSubmit = () => {
  const editor = editorRef.value
  if (editor == null) return
  dialogVisible.value = true
  const content = editor.getHtml()
}
const handleConfirm = async () => {
  try {
    // 获取表单数据
    const postData = ({
      title: formData.value.title,
      content: editorRef.value.getHtml(),
      images: [], // 如果需要上传图片，这里需要添加图片数组
      categoryId: parseInt(formData.value.category) || 0, // 转换为数字
      tags: formData.value.tags.split(',').map(tag => parseInt(tag.trim())).filter(Boolean) // 将标签字符串转换为数字数组
    })

    // 发送请求到后端
    const response = await api.post('/posts', postData)

    if (!response.ok) {
      throw new Error('发布失败')
    }

    // 清除表单数据
    formData.value = {
      title: '',
      tags: '',
      category: ''
    }

    // 清除编辑器内容
    valueHtml.value = '<p></p>'

    // 关闭对话框
    dialogVisible.value = false
    
    // 关闭窗口
    isWindowVisible.value = false

    // 提示成功
    ElMessage.success('发布成功')
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败，请重试')
  }
}
// 添加窗口显示状态控制
const isWindowVisible = ref(false)
//修改窗口显示状态的方法
const toggleWindow = () => {
  isWindowVisible.value = !isWindowVisible.value
}
</script>

<template>
  <div class="window">
    <div v-if="isWindowVisible" class="overlay" ></div>
    <div v-if="isWindowVisible" class="floating-window">
      <div class="window-header">
        <span>发布笔记</span>
      </div>
      <div class="editor-container">

        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
          :mode="mode" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
          :mode="mode" @onCreated="handleCreated" />
      </div>
      <!-- 添加发布表单对话框 -->
      <el-dialog v-model="dialogVisible" title="发布文章" width="50%">
        <el-form :model="formData" label-width="80px">
          <el-form-item label="文章标题">
            <el-input v-model="formData.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-input v-model="formData.tags" placeholder="请输入标签，多个标签用逗号分隔"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-input v-model="formData.category" placeholder="请选择分类"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确认发布</el-button>
          </span>
        </template>
      </el-dialog>
      <div class="window-footer">
        <el-button @click="handleSubmit">发布</el-button>
      </div>
    </div>
    <!-- 添加圆形加号按钮 -->
    <div class="add-button" @click="toggleWindow" >
      <Plus class="plus-icon" />
      <span class="hover-text">发布<br>文章</span>
    </div>
  </div>
</template>

<style scoped>
.floating-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 80%;
  max-width: 800px;
  height: 80vh;
  max-height: 700px;
  margin-bottom: 70px;
  /* 为底部导航栏留出空间 */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.window-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.editor-container {
  flex: 1;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.window-footer {
  padding: 15px 20px;
  text-align: right;
  border-top: 1px solid #eee;

}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
}

.add-button {
  position: fixed;
  bottom: 220px;
  right: 60px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #a8d4ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 2000;
  font-size: 20px;
  padding: 10px;
  transition: all 0.3s;
}
.plus-icon {
  position: absolute;
  transition: all 0.3s;
}

.hover-text {
  position: absolute;
  opacity: 0;
  font-size: 14px;
  transition: all 0.3s;
  white-space: normal;
  text-align: center;
  line-height: 1.2;
}
.add-button:hover {
  transform: scale(1.1);
  background-color: #73acd4;
  box-shadow: 0 4px 16px 0 rgba(0, 238, 255, 0.5);
}
.add-button:hover .plus-icon {
  opacity: 0;
}

.add-button:hover .hover-text {
  opacity: 1;
}

</style>