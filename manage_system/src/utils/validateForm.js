// 1. 用户名验证规则
export function checkUserName(rule, value, callback) {
    // 非空验证
    if (!value) {
        return callback(new Error("用户名不能为空"));
    }
    // 正则验证
    var userNameReg = /(^[a-zA-Z]{1,10}\w{0,9})$/;
    if (!userNameReg.test(value)) {
        return callback(new Error("用户名为5-10位数字字母下划线组成，开头必须是字母"));
    }
    return //自定义校验规则，必须调用callback回调函数
};
// 2. 密码验证规则
export function checkPassWord(rule, value, callback) {
    // 非空验证
    if (!value) {
        return callback(new Error("密码不能为空"));
    }
    // 正则验证
    var checkPassReg = /^\d{6}$/;
    if (!checkPassReg.test(value)) {
        return callback(new Error("密码为6位数字"));
    }
    return
};
// 3. 邮箱验证规则
export function checkEmail(rule, value, callback) {
    // 正则验证
    var checkEmailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!checkEmailReg.test(value)) {
        return callback(new Error("邮箱格式有误"));
    }
    return
};
// 4. 手机号码验证规则
export function checkMobile(rule, value, callback) {
    // 正则验证
    var checkMobileReg = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/;
    if (!checkMobileReg.test(value)) {
        return callback(new Error("电话号码不合法"));
    }
    return
};

// 5. 登录账号验证
export function checkLogin(rule, value, callback) {

}