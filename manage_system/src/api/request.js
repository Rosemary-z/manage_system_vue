import axios from 'axios';
export function request(config) {
    const instance = new axios.create({
        //baseURL:'http://123.207.32.32:8000',http://152.136.185.210:8000/api/z8
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 5000
    });
    return instance(config);
}