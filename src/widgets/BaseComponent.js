import React,{Component} from 'react';
import LoginInvalidDialog from "./dialog/LoginInvalidDialog";
import {goto, gotoAndClose} from "../reducers/RouterReducer";
import {
    View,
    StyleSheet
} from "react-native";
import {clearShoppingCart, clearShoppingCartProductTotalCount} from "../reducers/ShoppingCartReducer";
import {clearToken} from "../reducers/LoginReducer";
import {clearUser} from "../reducers/UserInfoReducer";
import {showLoginInvalidDialog} from "../reducers/CacheReducer";
import {isTokenInvalid} from "../common/CommonRequest";
export default class BaseComponent extends Component{

    constructor(props){
        super(props);
        this.token = props.token;
        this.isPageResume = true;
    }

    isResume(nextProps){
        let nowRouterName = nextProps.navigation.state.routeName;
        if(nextProps.nav){
            if(nowRouterName === nextProps.nav.routes[nextProps.nav.index].routeName){
                if(this.isPageResume){
                    return false;
                }else{
                    this.isPageResume = true;
                }
            }else{
                this.isPageResume = false;
            }
        }
        return this.isPageResume;
    }

    isUserTokenChange(nextProps){
        // console.warn('this.token',this.token,'nextProps.token',nextProps.token);
        // if(this.token){
            if(this.token !== nextProps.token){
                this.token = nextProps.token;
                return true;
            }
        // }
            return false;
    }

    /**
     * 检测用户token是否有效
     * @param response
     * @param token
     * @returns {boolean}
     */
    checkUserTokenValid({response={},title} = {},isForceLogout = true){
        let {dispatch} = this.props;
        if(isTokenInvalid(response)){//用户登录失效
            dispatch(showLoginInvalidDialog(true,isForceLogout,title));
            return false;

        } else if(!this.props.token){
            dispatch(showLoginInvalidDialog(true,isForceLogout,title));
            return false;
        }
        return true;
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
});

