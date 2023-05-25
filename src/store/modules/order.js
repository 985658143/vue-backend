import api from '@/api'

const state = {
    account: localStorage.account || '',
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
    // 管理员获取订单列表
    orderList({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/orders/queryByUid', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加时 获取蔬菜信息
    vegeInfo({commit},data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/orders/addCondition', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 根据id查询单个蔬菜
    searchSingle({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/queryByVid', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加订单
    addOrder({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/orders/addOrder', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 查询某蔬菜订单
    searchVege({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/orders/queryByVid', data).then(res => {
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
        state.account = data.uname
    },
    removeUserData(state) {
        localStorage.removeItem('account')
        state.account = ''
    },
    setPermissions(state, permissions) {
        state.permissions = permissions
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
