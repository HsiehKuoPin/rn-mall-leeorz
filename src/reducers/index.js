import RouterReducer from './RouterReducer';
import LoginReducer from './LoginReducer';
import ShoppingCartReducer from './ShoppingCartReducer';
import UserInfoReducer from './UserInfoReducer'
import CacheReducer from './CacheReducer'
import ProductReducer from "./ProductReducer";
import SearchReducer from './SearchReducer';

export default {
    nav: RouterReducer,
    loginStore: LoginReducer,
    shoppingCartStore: ShoppingCartReducer,
    userInfoStore: UserInfoReducer,
    cacheStore: CacheReducer,
    productStore: ProductReducer,
    searchStore: SearchReducer,
};