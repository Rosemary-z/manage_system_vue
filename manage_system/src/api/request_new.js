import axios from 'axios'
import {
    Loading,
    Notification
} from 'element-ui'

let loading;
const http = axios.create({
    timeout: 10000,
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    headers: {
        'Content-Type': 'application/json'
    }
})
// 请求拦截
http.interceptors.request.use(req => {
    // 开启loading
    startLoading()
    // 拿到后端传回来的token值，为此后每一次请求添加token
    let token = sessionStorage.getItem('token')
    token && (req.headers.Authorization = token)
    return req
}, error => {
    console.log(error);
    return Promise.reject(error)
})
// 响应拦截
http.interceptors.response.use(res => {
    console.log(res);
    res && endLoading()
    return res
}, error => {
    endLoading()
    // 判断错误响应类型，如果是超时则提醒
    if (error.toString().indexOf('timeout') !== -1) {
        Notification({
            title: '错误',
            message: '请求超时',
            type: 'error'
        })
    }
    // console.log(error);
    // let _res = error.response
    // switch(_res.status){
    //     // 如果后端返回的状态吗是401，证明token已过期，需要重新获取，清除此前token数据=>跳转到login页面
    //    case 401:
    //     sessionStorage.clear()       
    // }   
    return Promise.reject(error)
})

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(0,0,0,.3)'
    })
}

function endLoading() {
    loading.close()
}
export default http