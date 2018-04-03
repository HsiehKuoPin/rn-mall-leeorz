import {goto} from "../reducers/RouterReducer";
import {COMMON, FAMOUS_CAR, OIL_CARD} from "../constraint/ProductType";

/**
 * 跳转详情页面
 * @param productData
 * @param dispatch
 */
export function gotoDetail(productData,dispatch) {
    switch (productData.type){
        case COMMON:
            dispatch(goto('ProductDetail',productData.id));
            break;
        case OIL_CARD:
        case FAMOUS_CAR:
            dispatch(goto('ProductCarDetail',productData.id));
            break;
        default:dispatch(goto('ProductDetail',productData.id));break;

    }
}