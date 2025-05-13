import { createRouter,createWebHashHistory } from "vue-router"

const routes =[
    {
        path:'/',   //重定向
        redirect:'/index'
        //redirect:'/login'
    },
    {
        path:'/index',   //主界面
        name:'index',    
        component:()=>import('../views/index.vue'),
        children:[
            {
                path:'/main',   //首页
                name:'main',    
                component:()=>import('../views/main/Main.vue')
            },
            {
                path:'/publish',   //发帖
                name:'publish',    
                component:()=>import('../views/post/post.vue'),
                children: [
                    { 
                      path: '/ai',
                      name: 'ai',
                      component: ()=>import('../views/ai/AIChat.vue'),
                    }
                ]
            },

            {
                path:'/message',   //通知
                name:'message',    
                component:()=>import('../views/message/message.vue')
            },
            {
                path:'/my',   //我的
                name:'my',   
                component:()=>import('../views/my/my.vue'),
                children: [
                    { 
                      path: '/my/note',  // 完整路径为 /my/note
                      name: 'note',
                      component: ()=>import('../views/my/note.vue')
                    },
                    { 
                      path: '/my/collect',
                      name: 'collect',
                      component: ()=>import('../views/my/collect.vue')
                    },
                    { 
                      path: '/my/like',
                      name: 'like',
                      component: ()=>import('../views/my/like.vue')
                    }
                ]
            }
        ]
    },
    {
        path:'/detail', //详情页
        name:'detail',
        component:()=>import('../views/detail.vue')

    },
    {
        path:'/login',   //登录
        name:'login',    
        component:()=>import('../views/login/login.vue'),
    },
    {
        path:'/register',   //注册
        name:'register',    
        component:()=>import('../views/register/register.vue')
    }
    
]

const router = createRouter({
    history : createWebHashHistory(),
    routes,
    linkActiveClass:'active'
})
export default router