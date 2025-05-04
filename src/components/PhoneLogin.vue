<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const GetCode = () => {
    
    console.log('GetCode')
}
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        
        router.push('/main')
    } catch (error) {
        console.error('Login failed:', error)
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
            <el-input  placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item class="verification_area" label="VerificationCode">
            <el-input placeholder="请输入验证码"/>
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