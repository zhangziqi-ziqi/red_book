<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import PasswordLogin from '@/components/PasswordLogin.vue'
import PhoneLogin from '@/components/PhoneLogin.vue'
const ruleFormRef = ref<FormInstance>()

const loginOptions = ref('password')


</script>

<template>
    <div class="login">
        <h>Login</h>
        <el-radio-group v-model="loginOptions" aria-label="login_options">
            <el-radio-button value="password">密码登录</el-radio-button>
            <el-radio-button value="phone">验证码登录</el-radio-button>
        </el-radio-group>
        <div class="radius">
            
            <el-form
                label-width="auto" class="demo-ruleForm">
                <!-- 密码登录 -->
            <PasswordLogin v-if="loginOptions === 'password'" />
            
            <!-- 验证码登录 -->
            <PhoneLogin v-else-if="loginOptions === 'phone'" />
                
                
            </el-form>
        </div>
    </div>
</template>

<style scoped>
.login {
    width: 100%;
    height: calc(100vh);
    margin: 0px;
    padding: 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

h {
    font-size: 30px;
    margin-bottom: 20px;
}

.login_options {
    max-width: 1000px;
}

.radius {
    border: 1px;
    padding: 20px;
    border: 1px solid #616161;
    border-radius: 4px;
}
</style>
