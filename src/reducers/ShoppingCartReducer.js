import {createActions, handleActions} from 'redux-actions';

let defaultState = {
    shoppingCart: [],
    shoppingCartProductTotalCount: 0,
    shoppingCartItemCheck: []
};
export const {
    saveShoppingCart,
    clearShoppingCart,
    removeShoppingCartProduct,
    removeShoppingCartProductList,
    addShoppingCartProduct,
    minusShoppingCartProduct,
    selectShoppingCartProduct,
    clearShoppingCartProductTotalCount,
    saveShoppingCartProductTotalCount,
    addShoppingCart,
    allSelectMerchantProduct,//全选某个商家的商品
} = createActions({
    SAVE_SHOPPING_CART: shoppingCart => shoppingCart,
    CLEAR_SHOPPING_CART: (shoppingCart) => {},
    REMOVE_SHOPPING_CART_PRODUCT: shoppingCartItemId => shoppingCartItemId,
    REMOVE_SHOPPING_CART_PRODUCT_LIST: shoppingCartItemList => shoppingCartItemList,
    ADD_SHOPPING_CART_PRODUCT: shoppingCartItemId => shoppingCartItemId,
    MINUS_SHOPPING_CART_PRODUCT: shoppingCartItemId => shoppingCartItemId,
    SELECT_SHOPPING_CART_PRODUCT: shoppingCartItemId => shoppingCartItemId,
    CLEAR_SHOPPING_CART_PRODUCT_TOTAL_COUNT: () => {},
    SAVE_SHOPPING_CART_PRODUCT_TOTAL_COUNT: (count) => ({count}),
    ADD_SHOPPING_CART: shoppingCartCount => shoppingCartCount,
    ALL_SELECT_MERCHANT_PRODUCT:(merchantId,isAllCheck)=>({merchantId,isAllCheck}),
});

getCalculateShoppingCartProductTotalCountState = (state) => {
    let totalCount = 0;
    let result = [];
    if (state.shoppingCartItemCheck !== undefined && state.shoppingCartItemCheck.length !== 0) {
        state.shoppingCart.map((item) => {
            let check = false;
            state.shoppingCartItemCheck.map((checkItem) => {
                if (item.skuId === checkItem) {
                    check = true;
                }
            })
            totalCount += Number.parseInt(item.quantity);
            result.push({...item, check: check});

        })
    } else {
        state.shoppingCart.map((item) => {
            totalCount += Number.parseInt(item.quantity);
            result.push({...item, check: false});
        })
    }
    return {
        shoppingCart: result,
        shoppingCartProductTotalCount: totalCount,
        shoppingCartItemCheck: state.shoppingCartItemCheck
    };
};

const reducer = handleActions({
    SAVE_SHOPPING_CART: (state, action) => {

        return getCalculateShoppingCartProductTotalCountState({...state, shoppingCart: action.payload});
    },
    CLEAR_SHOPPING_CART: (state, action) => (getCalculateShoppingCartProductTotalCountState({
        ...state,
        shoppingCart: [],
        shoppingCartItemCheck: []
    })),
    REMOVE_SHOPPING_CART_PRODUCT: (state, action) => {
        let shoppingCartItemId = action.payload;
        let result = [];
        let checkResult = [];
        if (shoppingCartItemId) {
            state.shoppingCart.map((item) => {
                if (item.skuId !== shoppingCartItemId) {
                    result.push(item);
                }
            })
            state.shoppingCartItemCheck.map((item) => {
                if (item !== shoppingCartItemId) {
                    checkResult.push(item);
                }
            })
        }
        return getCalculateShoppingCartProductTotalCountState({
            shoppingCart: result,
            shoppingCartItemCheck: checkResult
        });
    },
    REMOVE_SHOPPING_CART_PRODUCT_LIST: (state, action) => {
        let shoppingCartItemIds = action.payload;
        let result = state.shoppingCart;
        let checkResult = state.shoppingCartItemCheck;
        if (shoppingCartItemIds) {
            shoppingCartItemIds.map((shoppingCartItemId) => {
                result.map((item,index) => {
                    if (item.skuId === shoppingCartItemId) {
                        result.splice(index,1);
                    }
                })
                checkResult.map((item,index) => {
                    if (item.skuId === shoppingCartItemId) {
                        checkResult.splice(index,1);
                    }
                })
            })
            return getCalculateShoppingCartProductTotalCountState({
                shoppingCart: result,
                shoppingCartItemCheck: checkResult
            });
        }
    }
    ,
        ADD_SHOPPING_CART_PRODUCT: (state, action) => {
            let shoppingCartItemId = action.payload;
            let result = [];
            if (shoppingCartItemId) {
                state.shoppingCart.map((item) => {
                    if (item.skuId === shoppingCartItemId) {
                        item.quantity++;
                    }
                    result.push({...item, quantity: item.quantity});
                })
            }

            return getCalculateShoppingCartProductTotalCountState({
                shoppingCart: result,
                shoppingCartItemCheck: state.shoppingCartItemCheck
            });
        },
            MINUS_SHOPPING_CART_PRODUCT
    :
        (state, action) => {
            let shoppingCartItemId = action.payload;
            let result = [];
            if (shoppingCartItemId) {
                state.shoppingCart.map((item) => {
                    if (item.skuId === shoppingCartItemId) {
                        item.quantity--;
                    }
                    result.push({...item, quantity: item.quantity});
                })
            }
            return getCalculateShoppingCartProductTotalCountState({
                shoppingCart: result,
                shoppingCartItemCheck: state.shoppingCartItemCheck
            });
        },
            SELECT_SHOPPING_CART_PRODUCT
    :
        (state, action) => {
            let shoppingCartItemId = action.payload;
            let result = [];
            if (shoppingCartItemId) {
                state.shoppingCart.map((item) => {
                    if (item.skuId === shoppingCartItemId) {
                        if (!item.check) {
                            if (!result.includes(item.skuId)) {
                                result.push(item.skuId);
                            }
                        }
                    }
                    else if (item.check) {
                        if (!result.includes(item.skuId)) {
                            result.push(item.skuId);
                        }
                    }
                })
            }
            return getCalculateShoppingCartProductTotalCountState({
                shoppingCart: state.shoppingCart,
                shoppingCartItemCheck: result
            });
        },
            CLEAR_SHOPPING_CART_PRODUCT_TOTAL_COUNT
    :
        (state, action) => {
            return {...state, shoppingCartProductTotalCount: 0};
        },
            SAVE_SHOPPING_CART_PRODUCT_TOTAL_COUNT
    :
        (state, action) => {
            return {...state, shoppingCartProductTotalCount: action.payload.count};
        },

            ADD_SHOPPING_CART: (state, action) => ({
            ...state,
            shoppingCartProductTotalCount: state.shoppingCartProductTotalCount + action.payload
        }),
        ALL_SELECT_MERCHANT_PRODUCT:(state,action)=>{
            console.log('action',action);
            let merchantId = action.payload.merchantId;
            let isAllCheck = action.payload.isAllCheck;
            let checkResult = [];

            state.shoppingCart.map((item) => {
                console.log('state.shoppingCart',item);
                if (item.productSkuVo.merchantId === merchantId) {
                    item.check = isAllCheck;
                }

                if (item.check && !checkResult.includes(item.skuId)) {
                    checkResult.push(item.skuId);
                }
            });

            return getCalculateShoppingCartProductTotalCountState({
                shoppingCart: state.shoppingCart,
                shoppingCartItemCheck: checkResult
            });

        }

    }, defaultState);

export default reducer;