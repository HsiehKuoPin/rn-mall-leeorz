import React, {Component} from 'react';
import {StackNavigator, addNavigationHelpers} from 'react-navigation';
import {connect} from 'react-redux';
import {routes, routerConfig} from '../../config/routes';
import {goBack, goto, gotoAndClose} from '../../reducers/RouterReducer';
import LoadingDialog from '../../widgets/dialog/LoadingDialog';
import {Platform, BackHandler, View,NativeModules,NativeEventEmitter} from 'react-native';
import {saveAppVersion, saveRegistrationId} from "../../reducers/LoginReducer";
import LoginInvalidDialog from "../../widgets/dialog/LoginInvalidDialog";
import {configDispatchFunc, isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import TipDialog from "../../widgets/dialog/TipDialog";
import TempTipDialog from "../../widgets/dialog/TempTipDialog";

export const AppNavigator = StackNavigator(routes, routerConfig);

let customClickBackFunc = null;
export function setCustomClickBackFunc(func){
    customClickBackFunc = func;
}

class AppWithNavigationState extends Component {
    constructor(props) {
        super(props);
        configDispatchFunc(this.props.dispatch);
        this.props.dispatch(saveAppVersion(props.appVersion));
        this.clickBackTime = 0;
        this.lastClickBackTime = 0;
    }

    defaultClickBackFunc(){
        let {nav, dispatch} = this.props;
        if (nav.index === 0) {
            this.clickBackTime = new Date().getTime();
            if (this.clickBackTime - this.lastClickBackTime > 2000) {
                showToastShort("再点一下退出");
                this.lastClickBackTime = this.clickBackTime;
                return true;
            } else {
                this.lastClickBackTime = this.clickBackTime;
                return false
            }
        } else {
            this.props.dispatch(goBack());
            return true;
        }
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => {
                    if(customClickBackFunc){
                        customClickBackFunc();
                        return true;
                    }else{
                        return this.defaultClickBackFunc();
                    }
                }
            );
        }

        if(NativeModules.GFCJPushModule){
            let eventEmitter = new NativeEventEmitter(NativeModules.GFCJPushModule);
            this.listener = eventEmitter.addListener('registration_id', (regId) => {
                if (this.props.token) this.registration(regId,this.props.token);
                this.props.dispatch(saveRegistrationId(regId));
            });
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', () => {});
        }
        if(NativeModules.GFCJPushModule){
            this.listener.remove();
        }
    }

    /**
     * 注册极光推送
     */
    registration(registrationId,token){

        post('main/push/registration', {registrationId,token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    NativeModules.GFCJPushModule.pushConfig(JSON.stringify(responseData.result));
                }else{
                    console.log('注册极光推送失败：'+responseData.message);
                }
            }).catch((e) => {
            console.log('注册极光推送异常：'+e.message);
        });
    }

    _goto(routeName){
        let {dispatch} = this.props;
        let nowRouteName =  this.props.navigation?this.props.navigation.state.routeName:undefined;
        if(dispatch){
            if((nowRouteName === 'Personal'|| nowRouteName === 'ShoppingCart') && routeName === 'Login'){
                dispatch(gotoAndClose(routeName,['Main']));
            }else{
                dispatch(goto(routeName));
            }
        }
    }

    render() {
        const {nav, dispatch} = this.props;
        return (
            <View style={{flex:1}}>
                <LoginInvalidDialog goto={this._goto.bind(this,'Login')}/>
                <LoadingDialog/>

                <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
                {/*<View><TempTipDialog/></View>*/}
            </View>
        )
    }
}



selector = (state) => {
    return {
        nav: state.nav,
        token: state.loginStore.token,
    }
};
export default connect(selector)(AppWithNavigationState);
