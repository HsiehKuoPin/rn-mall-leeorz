import {goto, gotoAndClose} from "../reducers/RouterReducer";
import {clearToken} from "../reducers/LoginReducer";
import {showToastShort} from "./CommonToast";
import {isTrue} from "./AppUtil";
import {api_product, api_test, getHost} from "./CommonRequest";

const QR_CODE_REGISTER = 'QR_CODE_REGISTER';
const QR_CODE_PAYMENT = 'QR_CODE_PAYMENT';
const QR_CODE_PRODUCT_DETAIL = 'PRODUCT_DETAIL';

/**
 * 获取注册二维码
 * @param memberId
 */
export function getRegisterQRCode(memberId) {
    return `${getHost()}main/register/register.html?ctype=${QR_CODE_REGISTER}&memberId=${memberId}`;
}

/**
 * 获取收付款的二维码
 * @param name
 * @param userId
 * @param money
 */
export function getPaymentQRCode(name,userId,money) {
    return JSON.stringify({ctype:QR_CODE_PAYMENT,userName:name,memberId:userId,money:money});
}

/**
 * 获取商品详情二维码
 * @param productId
 */
export function getProductDetailQRCode(productId) {
    return JSON.stringify({ctype:QR_CODE_PRODUCT_DETAIL,productId:productId});
}

/**
 * 处理二维码
 * @param dispatch
 * @param QRCodeStr
 * @param token
 * @param isRealName
 */
export function dealQRCode(dispatch,QRCodeStr,token,isRealName) {
    try{
        if(QRCodeStr.substr(0,4) === 'http'){
            dealQRCodeUrl({dispatch,QRCodeStr,token,isRealName})
        }else {
            dealQRCodeJson({dispatch,QRCodeStr,token,isRealName})
        }
    }catch (e){
        showToastShort('解析二维码时发生错误')
    }
}

function dealQRCodeJson({dispatch,QRCodeStr,token,isRealName}) {
    let QRCode = JSON.parse(QRCodeStr.replace(/(^\s*)|(\s*$)/g, ''));//去掉两边的空格
    switch (QRCode.ctype){
        case QR_CODE_REGISTER:
            dispatch(clearToken());
            dispatch(gotoAndClose('Register',['Main'],{phone:QRCode.phone}));
            break;
        case QR_CODE_PAYMENT:
            if (token) {
                if (isTrue(isRealName)) {
                    dispatch(goto('Payment',QRCode));
                } else {
                    dispatch(goto('Certification'));
                }
            } else {
                dispatch(goto('Login'));
            }
            break;
        case QR_CODE_PRODUCT_DETAIL://商品详情
            break;
    }
}

function dealQRCodeUrl({dispatch,QRCodeStr,token,isRealName}){
    let ctype = getUrlString(QRCodeStr,'ctype');
    switch (ctype){
        case QR_CODE_REGISTER:
            let phone = getUrlString(QRCodeStr,'phone');//兼容之前的代码，之前代码取的是手机号码
            let memberId = getUrlString(QRCodeStr,'memberId');//新版取memberId
            let params = null;
            if(phone){
                params = {phone:phone};
            }else if(memberId){
                params = {memberId:memberId};
            }else {
                throw new Error();
            }
            dispatch(clearToken());
            dispatch(gotoAndClose('Register',['Main'],params));
            break;
    }
}


//获取url中的参数
function getUrlString(url,key) {
    let reg = new RegExp(key + "=([^&]*)(&|$)");
    let result = url.match(reg); // 对querystring匹配目标参数
    if (result !== null) {
        return decodeURIComponent(result[1]);
    } else {
        return null;
    }
}