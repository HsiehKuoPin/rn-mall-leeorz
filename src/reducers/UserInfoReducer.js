import {createActions, handleActions} from 'redux-actions';
import {
    BALANCE_ACCOUNT, CONSUMER_COUPON_ACCOUNT, GENERAL_INTEGRAL_ACCOUNT, JADE_INTEGRAL_ACCOUNT,
    K_INTEGRAL_ACCOUNT,
    MY_RECOMMENDATION, PLATINUM_INTEGRAL_ACCOUNT, SPECIAL_INTEGRAL_ACCOUNT, ENTREPRENEURSHIP_COUPON_ACCOUNT,
    COMPANY_BALANCE_ACCOUNT, CONSUMER_INTEGRAL_ACCOUNT
} from "../constraint/AssetsType";

let defaultState = {
    userInfo: {},
    assetInfo: {
        [BALANCE_ACCOUNT]: {},//余额总数
        [JADE_INTEGRAL_ACCOUNT]: {},//玉积分
        [CONSUMER_COUPON_ACCOUNT]: {},//消费券
        [SPECIAL_INTEGRAL_ACCOUNT]: {},//专用积分
        [PLATINUM_INTEGRAL_ACCOUNT]: {},//白金积分
        [K_INTEGRAL_ACCOUNT]: {},//K积分
        [GENERAL_INTEGRAL_ACCOUNT]: {},//通用积分
        [COMPANY_BALANCE_ACCOUNT]: {},//商家余额
        [ENTREPRENEURSHIP_COUPON_ACCOUNT]:{}, // 创业券
        [CONSUMER_INTEGRAL_ACCOUNT]:{}, // 消费积分
        [MY_RECOMMENDATION]: {} // 我的推荐
    }
};

_getAssetsObj = (assets) => {
    let assetsInfo = {};
    Object.keys(assets).map(key => Object.assign(assetsInfo, {[key]: {available: assets[key]}}));
    return assetsInfo;
};
export const {saveUser, clearUser, saveAsset, updateAsset} = createActions({
    SAVE_USER: userInfo => userInfo,
    CLEAR_USER: (userInfo) => {},
    SAVE_ASSET: assetInfo => assetInfo,
    UPDATE_ASSET: (assetKey, data) => ({assetKey, data}),
});

const reducer = handleActions({
    SAVE_USER: (state, action) => ( {...state, userInfo: action.payload}),
    CLEAR_USER: (state, action) => ( {...state, userInfo: {},assetInfo:defaultState.assetInfo}),
    SAVE_ASSET: (state, action) => {
        let assetsInfo = _getAssetsObj(action.payload);
        let newAssetsInfo = {};
        Object.keys(assetsInfo).map(key => {
            Object.assign(newAssetsInfo, {[key]: Object.assign({}, {...state.assetInfo[key]}, {available: assetsInfo[key].available})});
        });
        return {...state, assetInfo: newAssetsInfo}
    },
    UPDATE_ASSET: (state, action) => {
        let {assetKey, data} = action.payload;
        let newAsset = Object.assign({},state.assetInfo[assetKey],data);
        let assetInfo = {...state.assetInfo, [assetKey]: newAsset};
        return {...state, assetInfo: assetInfo};
    }
}, defaultState);


export default reducer;