import api from '@/api'
import api2 from '@/api/index2'

const state = {
    account: localStorage.account || '',
    identity: localStorage.identity || '',
    uid: localStorage.uid || '',
    permissions: []
    // token: localStorage.token || '',
    // failure_time: localStorage.failure_time || '',
}

const getters = {
    isLogin: state => {
        let retn = false
        // if (state.token) {
        //     let unix = Date.parse(new Date())
        //     if (unix < state.failure_time * 1000) {
        //         retn = true
        //     }
        // }
        state.account ? retn = true : retn = false;
        return retn
    }
}

const actions = {
    // 获取权限 改变路由
    getPermissions({state, commit}) {
        return new Promise(resolve => {
            // 获取权限
            let permissions = state.permissions
            resolve(permissions)
        })
    },
    // 注册
    register({commit}, data) {
        let params = {
            uname: data.account,
            upwd: data.password,
            upwd2: data.password2,
            utel: data.phone,
            uloc: data.address,
            code: data.verify,
            autocode: data.code,
        }
        console.log(params)
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/user/register', params).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 登录
    login({commit}, data) {
        let params = {
            uname: data.account,
            upwd: data.password,
            code: data.verify,
            autocode: data.code,
        }
        console.log(params)
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/user/login', params).then(res => {
                if(res.resultCode == 200) {
                    commit('setUserData', res.data)
                    commit('setPermissions', res.data.uid)
                }
                resolve(res)
            }).catch(error => {
                console.log(error)
                reject(error)
            })
        })
    },
    // 生成验证码
    showCode({commit}) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api2.post('/user/checkCode').then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 注销
    logout({commit}) {
        commit('removeUserData')
        commit('menu/invalidRoutes', null, {root: true})
    },
    // 获取用户列表
    userList({commit}) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/user/queryAllUser').then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取单个用户信息
    singleInfo({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/user/updateCondition', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 修改用户
    updateUser({commit}, data) {
        console.log(data)
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/user/updateByUid', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除用户
    deleteUser({commit}, data) {
        console.log(data)
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/user/deleteUserByUid', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取用户列表
    supplierList({commit}) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/supplier/queryListAll').then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加供应商
    addSupplier({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/supplier/addSupplier', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 修改供应商
    updateSupplier({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/supplier/updateSupplier',data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除供应商
    deleteSupplier({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/supplier/delSupplier',data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 查询供应商列表
    searchSupplier({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/supplier/queryByVague', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
}

const mutations = {
    setUserData(state, data) {
        localStorage.setItem('account', data.uname)
        localStorage.setItem('identity', data.identity)
        localStorage.setItem('uid', data.uid)
        state.account = data.uname;
        state.identity = data.identity;
        state.uid = data.uid;
    },
    removeUserData(state) {
        localStorage.removeItem('account')
        localStorage.removeItem('identity')
        localStorage.removeItem('uid')
        state.account = ''
        state.identity = ''
        state.uid = ''
    },
    // 权限设置
    setPermissions(state, uid) {
        if(uid == 1) {
            // 管理员权限
            state.permissions = [
                'member.userList',
                'member.addSupplier',
                'member.updateSupplier',
                'member.deleteSupplier',
                'func.addStorage',
                'func.updateStorage',
                'func.deleteStorage',
                'func.addVege',
                'func.updateVege',
                'func.expireVege',
            ]
        }else {
            // 用户权限
            state.permissions = [
                'func.addOrder',
                'user.setting'
            ]
        }
        console.log(state.permissions)
    },
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
