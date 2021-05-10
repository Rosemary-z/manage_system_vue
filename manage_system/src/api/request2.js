import axios from 'axios';
import {
    Message,
    Notification,
    Loading
} from 'element-ui'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css';
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.timeout = 50000;
axios.interceptors.request.use(config => {
    // 在request拦截器中，显示进度条
    // NProgress.start();
    startLoading()
    // 为请求拦截器添加token，保证拥有获取数据的权限
    // 为所有请求设置请求头对象，添加token验证的Authorizaion字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
        // NProgress.done();
        endLoading()
        return config;
    },
    (error) => {
        if (error) {
            Notification({
                title: '错误',
                message: '网络请求错误或数据请求失败',
                type: 'error'
            })
        }
    })

export function request(url, type, params = {}) {
    switch (type.toLowerCase()) {
        case 'get':
            return axios.get(url, params)
        case 'post':
            return axios.post(url, params)
    }
}

let loading;

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: '拼命加载中...',
        // background
    })
}

function endLoading() {
    loading.close()
}