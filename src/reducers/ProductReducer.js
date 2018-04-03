import {createActions, handleActions} from 'redux-actions';

let defaultState = {
    recommendProductList: [],//为你推荐的数据缓存
    recommendUpdateTime:0,//为你推荐的数据更新时间
};
export const {saveRecommendProduct} = createActions({
    SAVE_RECOMMEND_PRODUCT: (list,time) => ({list,time}),
});
const reducer = handleActions({
    SAVE_RECOMMEND_PRODUCT: (state, action) => ({recommendProductList:action.payload.list,recommendUpdateTime:action.payload.time}),
}, defaultState);

export default reducer;