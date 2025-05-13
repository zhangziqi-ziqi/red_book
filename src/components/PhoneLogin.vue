<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import api from '@/utils/request'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const ruleForm = reactive({
    phoneNumber: '',
    verificationCode: '',
})
const router = useRouter()
const GetCode = async() => {
    try {
      const data = {
        phone: ruleForm.phoneNumber,
      }
      const code =await api.post('/users/code', null,{params:data})
      ElMessage.success('验证码已发送')
      ElMessage.success('验证码为：'+code.data.data)
      return code
    }catch (error) {
        console.error('验证码发送失败:', error)
        ElMessage.error('验证码发送失败,请检查手机号')
        return
    }
}
const submitForm = async(formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        formEl.validate() // 等待验证通过
        const data = ({
        identifier: ruleForm.phoneNumber,
        passwordOrCode: ruleForm.verificationCode,
        pattern:0,
        })
        const response =await api.post('/users/login', data)
        localStorage.setItem('token', response.data.token)
        router.push('/main')
    } catch (error) {
        console.error('Login failed:', error)
        ElMessage.error('登录失败，验证码错误')
        return
    }
}
const goToSignUp = () => {
    router.push('/register').catch(err => {
        console.error('路由跳转失败:', err)
    })
}
</script>
<template>
    <div class="phone-login">
        <el-form-item label="PhoneNumber">
            <el-input  v-model="ruleForm.phoneNumber" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item class="verification_area" label="VerificationCode">
            <el-input v-model="ruleForm.verificationCode" type="text" placeholder="请输入验证码"/>
            <el-button type="primary" @click="GetCode">获取验证码</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="danger" @click="submitForm">
                Signin
            </el-button>
            <el-button @click="goToSignUp">Signup</el-button>
        </el-form-item>
    </div>
</template>
<style scoped>
.verification_area {
    display: flex;
}

/* 使用深度选择器 */
.verification_area ::v-deep .el-input {
    flex: 1;
}
.verification_area ::v-deep .el-button {
  margin-left: 10px; 
  /* 固定按钮宽度避免挤压 */
}
</style>