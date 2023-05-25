import axios from 'axios'
// import Qs from 'qs'
import { Message } from 'element-ui'

const api2 = axios.create({
    baseURL: process.env.VUE_APP_API_ROOT,
    timeout: 10000,
    responseType: 'json'
    // withCredentials: true
})

api2.interceptors.request.use(
    request => {
        if (request.method == 'post') {
            if (request.data instanceof FormData) {
            } else {
                // 带上 token
                if (request.data == undefined) {
                    request.data = {}
                }
                // request.data = Qs.stringify(request.data)
            }
        } else {
            // 带上 token
            if (request.params == undefined) {
                request.params = {}
            }
        }
        return request
    }
)

api2.interceptors.response.use(
    response => {
        if (response.data.error != '') {
            // 如果接口请求时发现 token 失效，则立马跳转到登录页
            // Message.error(response.data.error)
            // return Promise.reject(response.data)
        }
        return Promise.resolve(response.data)
    },
    error => {
        return Promise.reject(error)
    }
)


export default api2
