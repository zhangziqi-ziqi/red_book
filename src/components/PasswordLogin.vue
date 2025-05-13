<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import api from '@/utils/request'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const checkUser = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error("此处不能为空"))
    }
    setTimeout(() => {
        callback()
    }, 1000)
}

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    } else {
        if (!ruleFormRef.value) return
        ruleFormRef.value.validateField('pass')
        callback()
    }
}

const ruleForm = reactive({
    user: '',
    pass: '',
})

const loginOptions = ref('password')
const rules = reactive<FormRules<typeof ruleForm>>({
    user: [{ validator: checkUser, trigger: 'blur' }],
    pass: [{ validator: validatePass, trigger: 'blur' }],
})
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
        await formEl.validate() // 等待验证通过
        const data = ({
        identifier:ruleForm.user,
        passwordOrCode:ruleForm.pass,
        pattern:1,
        })
        const response = await api.post( '/users/login', data)
        if(response.data.code === 0) {
            ElMessage.error(response.data.msg)
            return
        }
        localStorage.setItem('token', response.data.data)
        router.push('/main')
    } catch (error) {
        ElMessage.error('登录失败，请检查用户名和密码')
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
    <div calss="passwordlogin">
        <el-form ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-width="auto">
        <el-form-item label="User" prop="user">
            <el-input v-model="ruleForm.user" type="user" autocomplete="off" placeholder="请输入用户名/手机号/邮箱"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="pass">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
            <el-button type="danger" @click="submitForm(ruleFormRef)">
                Signin
            </el-button>
            <el-button @click="goToSignUp">Signup</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>
<style scoped></style>