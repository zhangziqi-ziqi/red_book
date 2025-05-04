<script setup>
import {ref} from 'vue'
let footerlist = ref([
    {id:1,icon:'icon-shouye',path:'/main'},
    {id:2,icon:'icon-jiahao',path:'/publish'},
    {id:3,icon:'icon-xiaoxizhongxin',path:'/message'},
    {id:4,icon:'icon-wode',path:'/my'},
])
</script>

<template>
    <div class="nav-bottom">
        <div class="footer">
            <div class="footer-list">
                <ul style="padding-left: 0;">
                    <li v-for="item in footerlist" :key="item.id">
                        <router-link :to="item.path">
                            <i class="iconfont" :class=item.icon></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>