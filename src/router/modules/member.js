import Layout from '@/layout'

export default {
    path: '/members',
    component: Layout,
    redirect: '/member/page',
    name: 'members',
    meta: {
        title: '人员管理',
        icon: 'user'
    },
    children: [
        {
            path: 'member',
            name: 'member',
            component: () => import('@/views/members/member'),
            meta: {
                title: '用户管理',
                auth: ['member.userList'],
            }
        },
        {
            path: 'supplier',
            name: 'supplier',
            component: () => import('@/views/members/supplier'),
            meta: {
                title: '供应商管理'
            },
        }
    ]
}
