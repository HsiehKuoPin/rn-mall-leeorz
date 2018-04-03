import {
    DeviceEventEmitter
} from 'react-native';
import {goto, gotoAndClose, goBack} from "../reducers/RouterReducer";
import {ORDER_CREATED} from "../constraint/OrderType";
import {isTrue} from "./AppUtil";
import {showToastShort} from './CommonToast';

const APP_HOME = 'APP_HOME';//首页
const APP_GOTO_PRODUCT_LIST = 'APP_GOTO_PRODUCT_LIST';//商品列表
const APP_GOTO_PRODUCT_GROUP_LIST = 'APP_GOTO_PRODUCT_GROUP_LIST';//分组商品列表
const APP_GOTO_PRODUCT_BRAND_LIST = 'APP_GOTO_PRODUCT_BRAND_LIST';//品牌商品列表
const APP_PRODUCT_DETAIL = 'APP_PRODUCT_DETAIL';//商品详情
const APP_PURCHASECAR_DETAIL = 'APP_PURCHASECAR_DETAIL';//购车详情
const APP_SHOPPING_CAR = 'APP_SHOPPING_CAR';//购物车
const APP_GOTO_LOGIN = 'APP_GOTO_LOGIN';//去登录
const APP_GOTO_PAYMENT = 'APP_GOTO_PAYMENT';//跳转去付款页面
const APP_ORDER_LIST = 'APP_ORDER_LIST';//跳转订单列表
const APP_ORDER_DETAIL = 'APP_ORDER_DETAIL';//订单详情
const APP_REALNAME_AUTHENTICATION = 'APP_REALNAME_AUTHENTICATION';//实名认证
const APP_BINDING_BANKCARD = 'APP_BINDING_BANKCARD';//绑定银行卡
const APP_WEB_ACTIVITY = 'APP_WEB_ACTIVITY';//活动页面（网页）
const APP_OILCARD_DETAIL = 'APP_OILCARD_DETAIL';//购车详情（油卡）
const APP_CAR_TREASURE = 'APP_CAR_TREASURE';//车宝定购
const APP_HOME_BRAND = 'APP_HOME_BRAND';//品牌馆
const APP_HOME_DISCOUNT = 'APP_HOME_DISCOUNT';//折扣馆
const APP_HOME_LEGOU = 'APP_HOME_LEGOU';//乐购馆
const APP_GOLD_PURCHASE = 'APP_GOLD_PURCHASE';//黄金定购
const PUSH_MESSAGE_H5 = 'PUSH_MESSAGE_H5';//推送页面（网页）
const PUSH_MESSAGE_TEXT = 'PUSH_MESSAGE_TEXT';//推送页面（文本）
export function commonAction(dispatch, {item, token, isRealName, isHasRecommend, id}) {
    let ext = undefined;
    let type = typeof item.ext;
    if (type === 'object') {
        ext = item.ext;
    } else if (type === 'string') {
        if (!item.ext) {
        } else if (item.ext.indexOf('www') !== -1 || item.ext.indexOf('http') !== -1) {
        } else {
            ext = JSON.parse(item.ext);
        }
    }
    switch (item.action) {
        case APP_HOME:
            dispatch(gotoAndClose('Main'));
            break;
        case APP_GOTO_PRODUCT_LIST:
            dispatch(goto('ProductList', {id: {categoryId: ext.id}}));
            break;
        case APP_GOTO_PRODUCT_GROUP_LIST:
            dispatch(goto('ProductList', {id: {groupId: ext.id}}));
            break;
        case APP_GOTO_PRODUCT_BRAND_LIST:
            dispatch(goto('ProductList', {id: {brandIds: [ext.id]}}));
            break;
        case APP_PRODUCT_DETAIL:
            dispatch(goto('ProductDetail', ext.id));
            break;
        case APP_PURCHASECAR_DETAIL:
        case APP_OILCARD_DETAIL:
            dispatch(goto('ProductCarDetail', ext.id));
            break;
        case APP_SHOPPING_CAR:
            if (token) {
                dispatch(goBack('Main', {initialRouteName: 'ShoppingCart'}))
            } else {
                dispatch(goto('Login'));
            }
            break;
        case APP_GOTO_LOGIN:
            dispatch(goto('Login'));
            break;
        case APP_GOTO_PAYMENT:
            break;
        case APP_ORDER_LIST:
            if (token) {
                dispatch(goto('MyOrder', {orderType: ORDER_CREATED}));
            } else {
                dispatch(goto('Login'));
            }
            break;
        case APP_ORDER_DETAIL:
            break;
        case APP_REALNAME_AUTHENTICATION:
            if (token) {
                dispatch(goto('Certification'));
            } else {
                dispatch(goto('Login'));
            }
            break;
        case APP_BINDING_BANKCARD:
            if (token) {
                dispatch(goto('BindingBankCard'));
            } else {
                dispatch(goto('Login'));
            }
            break;
        case APP_CAR_TREASURE:
            if (token) {
                if (isTrue(isRealName)) {
                    if (isTrue(isHasRecommend)) {
                        dispatch(goto('CarTreasureOrder'));
                    }
                    else {
                        //弹窗
                        DeviceEventEmitter.emit('SHOWRECOMMENDVIEW');
                    }
                }
                else {
                    dispatch(goto('Certification'));
                }
            } else {
                dispatch(goto('Login'));
            }

            break;
        case APP_HOME_BRAND:
        case APP_HOME_DISCOUNT:
        case APP_HOME_LEGOU:
            dispatch(goto('HomeStreet', item.action));
            break;
        case APP_GOLD_PURCHASE:
            if (token) {
                if (isTrue(isRealName)) {
                    if (isTrue(isHasRecommend)) {
                        dispatch(goto('GoldOrderIndex'));
                    }
                    else {
                        //弹窗
                        DeviceEventEmitter.emit('SHOWRECOMMENDVIEW');
                    }
                }
                else {
                    dispatch(goto('Certification'));
                }
            } else {
                dispatch(goto('Login'));
            }
            break;
        case PUSH_MESSAGE_H5:
            dispatch(goto('CommonWebView', {url: item.ext}));
            break;
        case PUSH_MESSAGE_TEXT:
            dispatch(goto('NewsDetail', {id: id, type: 'message'}));
            break;
    }
}