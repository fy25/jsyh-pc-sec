import { Base } from "../utils/base"

// 获取验证码
function publicApi(url, params) {
    return Base.post(url, params)
}

function get(url, params) {
    return Base.get(url, params)
}



export { publicApi, get }