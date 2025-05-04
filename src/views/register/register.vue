<script  setup>
import { reactive,ref } from 'vue'

// 当前登录方式
const loginType = ref('password')

// 登录选项配置
const SignUp = () => {
}
</script>

<template>

        <div class="register">
            <el-form
                :model="formData"
                :rules="rules"
                ref="formRef"
                class="login-container">
            <el-form-item label="username">
                <el-input  />
            </el-form-item>
            <el-form-item label="password">
                <el-input  />
            </el-form-item>
            <el-form-item label="confirm_password">
                <el-input  />
            </el-form-item>
            <el-form-item label="email">
                <el-input  />
            </el-form-item>
            <el-form-item label="phone">
                <el-input  />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" >发送验证码</el-button>
            </el-form-item>
            <el-form-item label="verification_code">
                <el-input  />
            </el-form-item>
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