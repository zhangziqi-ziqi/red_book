<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import api from '@/utils/request.ts'
import { ElMessage } from 'element-plus'


const router = useRouter()
const formRef = ref<FormInstance>()
const form = reactive({
    user: '',
    pass: '',
    confirmPass: '',
    email: '',
    phone: '',
    code: '',
    avatar: '',
    nickname: '',
    date: '',
    gender: '',
})
const rules = reactive<FormRules>({
    user: [
        {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
        }
    ],
    pass: [
        {
            required: true,
            message: '密码不能为空',
            trigger: 'blur',
        }
    ],
    confirmPass: [
        {
            required: true,
            message: '请再次输入密码',
            trigger: 'blur',
        },
        {
            validator: (rule, value, callback) => {
                if (value !== form.pass) {
                    callback(new Error('两次输入密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ],
    phone: [
        {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur',
        },{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
        {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur',
        }
    ],
    code: [
        {
            // required: true,
            message: '验证码不能为空',
            trigger: 'blur',
        }
    ],
})

// 登录选项配置
const SignUp = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid, fields) => {
        if (!valid) {
            ElMessage.error('请完善注册信息')
            console.log('验证失败字段:', fields)
            return
        } else {
            try {
                const registerData = {
                    username: form.user,
                    password: form.pass,
                    email: form.email,
                    phone: form.phone,
                    avatarUrl: form.avatar,
                    nickname: form.nickname,
                    gender: form.gender,
                    birthday: form.date,
                    school: '',
                    region: '',
                    bio: '',
                }
                const res = await api.post('/users/register', registerData)
                if (res.data.code === 200) {
                    ElMessage.success('注册成功')
                    router.push('/login').catch(err => {
                        console.error('路由跳转失败:', err)
                    })
                }else{
                    ElMessage.error(res.data.message || '注册失败')
                }
            }catch (error) {
                console.error('注册失败:', error)
                ElMessage.error('注册失败，请稍后重试')
            }
        }
    })
}

const GetCode = async() => {
    try {
      const data = {
        phone: form.phone,
      }
      const code =await api.post('/users/code', null, {params : data})
      ElMessage.success('验证码已发送')
      ElMessage.success('验证码为：'+code.data.data)
      return code
    }catch (error) {
        console.error('验证码发送失败:', error)
        ElMessage.error('验证码发送失败,请检查手机号')
        return
    }
}
</script>

<template>

    <div class="register">
        <el-form :model="form" :rules="rules" ref="formRef" class="login-container">
            <el-form-item label="用户名" prop="user">
                <el-input v-model="form.user" />
            </el-form-item>
            <el-form-item label="密码" prop="pass">
                <el-input v-model="form.pass" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPass">
                <el-input v-model="form.confirmPass" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="GetCode">发送验证码</el-button>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
                <el-input v-model="form.code" />
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="form.gender">
                    <el-radio value="male">男</el-radio>
                    <el-radio value="female">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="生日">
                <el-date-picker v-model="form.date" type="date" placeholder="Pick a date" style="width: 100%" />
            </el-form-item>
            <el-button @click="SignUp">注册</el-button>
        </el-form>
    </div>
</template>

<style scoped>
.register {
    width: 100%;
    height: calc(100vh);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 30px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-type-selector {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
}

.form-container {
    transition: all 0.3s ease;
}


</style>