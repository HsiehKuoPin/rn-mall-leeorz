import {Platform} from 'react-native';
import {showLoadingDialog} from "../reducers/CacheReducer";

let dispatch = null;

const STATUS_SUCCESS = 10000;
const STATUS_ERROR = 10001;
const STATUS_TOKEN_INVALID = 10002;//token失效
const STATUS_FAIL = 10003;

export const api_product = 'http://api.newmall.ejiamall.cn/api/';
export const api_test = 'http://japi.wdfcds.com/api/';

let host = api_product;
// let host = api_test;

let phone_imei = '';
let version = '1.0.0';
let timeout = 30 * 1000;

const HEADER = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const POST = {
    method: 'POST'
};

const GET = {
    method: 'GET'
};

/**
 * 更新接口配置
 * @param appConfig
 */
export function updateConfig(appConfig) {
    if (appConfig.host) {

        host = appConfig.host;
        if (host.indexOf('newmall') !== -1) {
            host = host.replace('http://', 'https://');//将正式环境升级为ssl
        }
        phone_imei = appConfig.phone_imei;
        version = appConfig.version;
    }
}

/**
 * 配置dispatch
 * @param dispatchFunc
 */
export function configDispatchFunc(dispatchFunc) {
    dispatch = dispatchFunc;
}

export function getHost() {
    return host;
}

/**
 * 可以传入多个参数
 * @param objs
 * @returns {phone_imei: string, version: string, platform: string}
 */
function getRequestObj(...objs) {
    let params = {
        phone_imei: phone_imei,
        version: version,
        platform: Platform.OS,
    };
    objs.map((item, index) => Object.assign(params, item));
    return params;
}

//获取统一错误提示
export function getRequestFailTip(responseJson) {
    if (!__DEV__) {
        if (responseJson) {
            return `${responseJson.message}`;
        } else {
            return `请求发生异常`;
        }
    } else {
        if (responseJson) {
            return `${responseJson.message},状态码(${responseJson.status})`;
        } else {
            return `请求发生异常,状态码(unknown)`;
        }
    }
}

/**
 * POST请求
 * @param requestUrl
 * @param requestData
 * @param showLoadingDialog
 * @constructor
 */
export function post(requestUrl, requestData = {}, showLoadingDialog = false) {
    return request(requestUrl, POST.method, requestData, showLoadingDialog);
}

/**
 * GET请求
 * @param requestUrl
 * @param requestData
 * @param isShowLoadingDialog
 * @constructor
 */
export function get(requestUrl, requestData = {}, isShowLoadingDialog = false) {
    return request(requestUrl, GET.method, requestData, isShowLoadingDialog);
}

/**
 * 请求
 * @param requestUrl
 * @param requestMethod
 * @param requestData
 * @param isShowLoadingDialog
 */
export function request(requestUrl, requestMethod, requestData, isShowLoadingDialog) {
    requestData = getRequestObj(requestData);
    //检查空值，并删除空属性
    requestData = checkParams(requestData);
    console.log(`REQUEST:==============================>
                 URL:   ${host + requestUrl}
                 METHOD:${requestMethod}
                 HEADER:${JSON.stringify(HEADER)}
                 BODY:  ${JSON.stringify(requestData)}`);


    let fetch = new Promise((resolve, reject) => {
        if (isShowLoadingDialog) {
            controlLoadingDialog(true);
            setTimeout(() => {
                doFetch(resolve, reject, requestUrl, requestMethod, requestData, isShowLoadingDialog)
            }, 500);
        } else {
            doFetch(resolve, reject, requestUrl, requestMethod, requestData);
        }
    });

    return Promise.race([
        fetch,
        new Promise((resolve, reject) => {
            setTimeout(() => {
                if (isShowLoadingDialog) {
                    controlLoadingDialog(false);
                }
                reject({message: '请求超时,请稍后再试'});
            }, timeout);
        })
    ]);
}

function doFetch(resolve, reject, requestUrl, requestMethod, requestData, isShowLoadingDialog) {
    fetch(host + requestUrl, {
        method: requestMethod,
        headers: HEADER,
        body: JSON.stringify(requestData)
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
    }).then((responseData) => {
        if (isShowLoadingDialog) controlLoadingDialog(false);
        console.log("RESPONSE:==============================>", responseData);
        resolve(responseData);
        return responseData;
    }).catch((e) => {
        if (isShowLoadingDialog) controlLoadingDialog(false);
        reject(e);
        console.log("responseException:==============================>" + e.message)
    });
}

/**
 * 控制loadingDialog的显示
 * @param isShowLoadingDialog
 */
function controlLoadingDialog(isShowLoadingDialog) {
    if (dispatch) {
        dispatch(showLoadingDialog(isShowLoadingDialog));
    }
}

/**
 * 检查属性是否是null or undefined，是则删除该属性
 * @param params
 */
function checkParams(params) {
    for (let key in params) {
        const value = params[key];
        if (!value) {
            delete params[key];
        }
    }
    return params;
}

export function isSuccess(response) {
    return response && response.status === STATUS_SUCCESS;
}

export function isTokenInvalid(response) {
    return response && response.status === STATUS_TOKEN_INVALID;
}