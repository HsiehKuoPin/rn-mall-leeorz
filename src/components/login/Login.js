import React, {Component} from 'react';
import {
    Image,
    TextInput,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    NativeModules
} from 'react-native'
import styles from '../../styles/login_style';
import {ic_account, ic_password, login_logo} from "../../constraint/Image";
import TitleBar from '../../widgets/TitleBar';
import EditText from '../../widgets/edittext/EditText';
import {goto,goBack} from '../../reducers/RouterReducer';
import {post, getRequestFailTip, isSuccess} from '../../common/CommonRequest';
import {showToastShort} from '../../common/CommonToast';
import {saveToken,saveOtherConfig} from '../../reducers/LoginReducer';
import {saveShoppingCartProductTotalCount} from "../../reducers/ShoppingCartReducer";
import {saveUser} from "../../reducers/UserInfoReducer";
import {encryption} from "../../common/StringUtil";
import IphoneModel from "../../widgets/IphoneModel";
import connect from "react-redux/es/connect/connect";
import {style_edit_text} from "../../widgets/edittext/style_edit_text";
import TintImage from "../../widgets/TintImage";
import {mainColor, placeholderTextColor} from "../../constraint/Colors";
import {ic_login_account, ic_login_password} from "../../../resources/index";

const {width} = Dimensions.get('window');
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_text: '',
            pass_text: '',
        }
    }

    goRegister = () => {
        this.props.dispatch(goto('Register'));
    };

    goResetPassword = () => {
        this.props.dispatch(goto('ResetPassword'));
    };

    _login = () => {

        if (this.state.user_text === '') {
            showToastShort("手机号码或者用户名不能为空...")
        } else if (this.state.pass_text === '') {
            showToastShort("您还没输入密码...")
        } else {
            let requestObj = {
                'loginName': this.state.user_text,
                'password': encryption(this.state.pass_text),
            };
            post('user/login', requestObj,true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        if (this.props.registrationId)this.registration(this.props.registrationId,responseData.result.token);
                        this._getUserInfo(responseData.result.token);

                        this.props.dispatch(saveToken(responseData.result.token));
                        this.props.dispatch(saveShoppingCartProductTotalCount(responseData.result.shoppingCartCount));
                        this.props.dispatch(saveOtherConfig(responseData.result));
                        this.props.dispatch(goBack());

                    }else{
                        showToastShort(getRequestFailTip(responseData));
                    }
                }).catch((e) => {
                    console.warn(e.message);
                    showToastShort(getRequestFailTip());
            });
        }
    };

    /**
     * 注册极光推送
     */
    registration(registrationId, token){
        post('main/push/registration', {registrationId,token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    if (NativeModules.GFCJPushModule) {
                        NativeModules.GFCJPushModule.pushConfig(JSON.stringify(responseData.result));
                    }
                }else{
                    console.log('注册极光推送失败：'+responseData.message);
                }
            }).catch((e) => {
            console.log('注册极光推送异常：'+e.message);
        });
    }
    /**
     * 获取用户数据
     * @param userToken
     * @private
     */
    _getUserInfo(userToken){
        post('user/self', {token: userToken})
            .then((response) => {
                if (isSuccess(response)) {
                    this.props.dispatch(saveUser(response.result))
                }
            }).catch((e) => {
                console.warn(e.message)
        });
    }

    render() {
        return (
            <View style={styles.background}>
                <TitleBar title={'登  录'}/>
                <View style={styles.container}>
                    <View style={[styles.loginBackground]}>
                            <View style={Styles.logoBackground}>
                            <Image source={login_logo} style={Styles.loginLogo}/>
                            </View>
                            <View style={styles.accountLayout}>
                                <EditText customStyle={[style_edit_text.rectangle_border,{borderColor:mainColor,}]}
                                                icon={ic_login_account}
                                                isTintColor={true}
                                                placeholder={'请输入您的账号'}
                                                placeholderTextColor={placeholderTextColor}
                                                maxLength={20}
                                                onChangeText={(user_text) => this.setState({user_text})}/>
                                <EditText customStyle={[style_edit_text.rectangle_border,{marginTop:20,borderColor:mainColor,}]}
                                                icon={ic_login_password}
                                                isTintColor={true}
                                                placeholder={'请输入您的密码'}
                                                keyboardType={"default"}
                                                placeholderTextColor={placeholderTextColor}
                                                onChangeText={(pass_text) => this.setState({pass_text})}
                                                secureTextEntry={true}/>
                                <TouchableOpacity style={styles.login} activeOpacity={0.7}
                                                  onPress={() => this._login()}>
                                    <Text style={styles.loginText}>登 录</Text>
                                </TouchableOpacity>
                                <View style={{flexDirection: 'row',paddingLeft:8,paddingRight:8,marginTop:5}}>
                                    <TouchableOpacity activeOpacity={0.7} onPress={this.goResetPassword}>
                                        <Text style={styles.text}>忘记密码</Text>
                                    </TouchableOpacity>
                                    <View style={{flex:1}}/>
                                    <TouchableOpacity activeOpacity={0.7} onPress={this.goRegister}>
                                        <Text style={[styles.text]}>立即注册</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={{flex:1}}/>
                </View>
                <IphoneModel style={{backgroundColor:'#00000000'}}/>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    logoBackground:{
        // marginTop:10,
        backgroundColor:'#00000000',
        shadowColor:'gray',
        shadowOffset:{height:2,width:2},
        shadowRadius:3,
        shadowOpacity:0.2,
        elevation: 2,
    },
    loginLogo: {
        // width: 100,
        // height: 100,
        width:width/3.3,
        height:width/3.3,
        alignItems: 'center',
        resizeMode: 'contain',
    },
});
selector = (state) => {
    return {
        registrationId: state.loginStore.registrationId,
    }
};

export default connect(selector)(Login);