import {createActions, handleActions} from 'redux-actions';

let defaultState = {
    defaultAddress: undefined,
    defaultTotalAmount: undefined,
    defaultTotalPrice: undefined,
    defaultProduct:undefined,
    updateFlag:0,
    updateShoppingFlag:0,
    updateAddressListFlag:0,
    updateRichMoreFlag:0,
    updatePushMsgFlag:0,
    loadingDialog:{
        visible:false,
        isCanceledOnTouchOutside:false,
    },

    loginInvalidDialog:{
        visible:false,
        forceLogout:true,
        title:'您的登录已经失效'
    },

};
export const {
    showLoadingDialog,
    showLoginInvalidDialog,
    saveAddress,
    saveTotalAmount,
    saveTotalPrice,
    saveProduct,
    notifyUpdateUserInfo,
    notifyUpdateShoppingCart,
    notifyUpdateAddressList,
    notifyUpdateRichMore,
    notifyUpdatePushMsg} = createActions({
    SHOW_LOGIN_INVALID_DIALOG:(visible = false,forceLogout = true,title='您的登录已经失效') =>({visible,forceLogout,title}),
    SHOW_LOADING_DIALOG:(visible = false,isCanceledOnTouchOutside = false)=>({visible,isCanceledOnTouchOutside}),
    SAVE_ADDRESS: address => address,
    SAVE_TOTAL_AMOUNT: totalAmount => totalAmount,
    SAVE_TOTAL_PRICE: saveTotalPrice => saveTotalPrice,
    SAVE_PRODUCT: saveProduct => saveProduct,
    NOTIFY_UPDATE_USER_INFO:updateFlag => updateFlag,
    NOTIFY_UPDATE_SHOPPING_CART:updateShoppingFlag => updateShoppingFlag,
    NOTIFY_UPDATE_ADDRESS_LIST:updateAddressListFlag => updateAddressListFlag,
    NOTIFY_UPDATE_RICH_MORE:updateRichMoreFlag => updateRichMoreFlag,
    NOTIFY_UPDATE_PUSH_MSG:updatePushMsgFlag => updatePushMsgFlag,
});

const reducer = handleActions({
    SHOW_LOGIN_INVALID_DIALOG:(state,action)=>({...state,loginInvalidDialog:action.payload}),
    SHOW_LOADING_DIALOG:(state,action)=>({...state,loadingDialog:action.payload}),
    SAVE_ADDRESS: (state, action) => ({...state, defaultAddress: action.payload}),
    SAVE_TOTAL_AMOUNT: (state, action) => ( {...state, defaultTotalAmount: action.payload}),
    SAVE_TOTAL_PRICE: (state, action) => ( {...state, defaultTotalPrice: action.payload}),
    SAVE_PRODUCT: (state, action) => ( {...state, defaultProduct: action.payload}),
    NOTIFY_UPDATE_USER_INFO: (state, action) => ( {...state, updateFlag: action.payload}),
    NOTIFY_UPDATE_SHOPPING_CART: (state, action) => ( {...state, updateShoppingFlag: action.payload}),
    NOTIFY_UPDATE_ADDRESS_LIST: (state, action) => ( {...state, updateAddressListFlag: action.payload}),
    NOTIFY_UPDATE_RICH_MORE: (state, action) => ( {...state, updateRichMoreFlag: action.payload}),
    NOTIFY_UPDATE_PUSH_MSG: (state, action) => ( {...state, updatePushMsgFlag: action.payload}),
}, defaultState);

export default reducer;