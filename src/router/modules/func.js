import Layout from '@/layout'
import EmptyLayout from '@/layout/empty'
export default {
    path: '/func',
    component: Layout,
    redirect: '/function/repository',
    name: 'func',
    meta: {
        title: '功能管理',
        icon: 'sidebar-menu'
    },
    children: [
        {
            path: 'repository',
            name: 'repository',
            component: () => import(/* webpackChunkName: 'multilevel_menu_example' */ '@/views/func/repository'),
            meta: {
                title: '仓库管理'
            }
        },
        {
            path: 'order',
            name: 'order',
            component: () => import(/* webpackChunkName: 'multilevel_menu_example' */ '@/views/func/order'),
            meta: {
                title: '订单管理'
            },
        },
        {
            path: 'vegetable',
            name: 'vegetable',
            component: EmptyLayout,
            redirect: '/func/vegetable/vegetable',
            meta: {
                title: '蔬菜管理'
            },
            children: [
                {
                    path: 'vegetable',
                    name: 'vegetableList',
                    component: () => import(/* webpackChunkName: 'multilevel_menu_example' */ '@/views/func/vegetable/vegetable'),
                    meta: {
                        title: '蔬菜列表'
                    }
                },
                {
                    path: 'expire',
                    name: 'expireList',
                    component: () => import(/* webpackChunkName: 'multilevel_menu_example' */ '@/views/func/vegetable/expire'),
                    meta: {
                        title: '过期列表',
                        auth: ['func.expireVege'],
                    }
                }
            ]
        }
    ]
}
