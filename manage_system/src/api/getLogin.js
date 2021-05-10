import {
    request
} from './request.js'

export async function getLogin(params) {
    return request({
        method: 'post',
        url: 'login',
        params
    })
}