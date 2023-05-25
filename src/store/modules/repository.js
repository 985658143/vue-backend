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
    // 获取仓库列表
    storageList({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/storage/queryAll', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 查询仓库类型
    searchType({commit}) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/storage/addCondition').then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加仓库
    addStorage({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/storage/addStorage', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 修改仓库
    updateStorage({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/storage/updateStorage', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除仓库
    deleteStorage({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/storage/delStorage', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 查询单个仓库信息
    singleStorage({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/storage/queryByStidGetOne', data).then(res => {
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
