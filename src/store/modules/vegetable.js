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
    // 获取蔬菜列表
    vegeList({commit}) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/queryAllVege').then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取过期蔬菜列表
    outList({commit}) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/queryNeedClear').then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 获取蔬菜类型
    getType({commit}) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/addCondition').then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 根据名称查询蔬菜
    searchVege({commit}, data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/queryByVague', data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    
    // 根据时间查询蔬菜
    searchTime({commit},data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/queryByVpurchasedate',data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 添加蔬菜
    addVegetable({commit},data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/addVegetable',data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 修改蔬菜
    updateVege({commit},data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/update',data).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 删除蔬菜
    deleteVege({commit},data) {
        return new Promise((resolve, reject) => {
            // 通过 mock 进行登录
            api.post('/vegetable/updateByStateClear',data).then(res => {
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
