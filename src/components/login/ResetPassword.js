import React, {Component} from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../../styles/login_style';
import {ic_register_background} from "../../constraint/Image";
import TitleBar from '../../widgets/TitleBar';
import {placeholderTextColor, mainBackgroundColor, mainColor} from '../../constraint/Colors';
import {post, isSuccess} from '../../common/CommonRequest';
import {showToastShort} from '../../common/CommonToast';
import {goBack} from '../../reducers/RouterReducer';
import {checkInputIsNumber, checkPhone, encryption} from '../../common/StringUtil';

var codeTime = 60;
class ResetPasswordComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verify_code: "获取验证码",
            verify_code_time: codeTime,
            isDisable: false,
            user_phone: '',
            user_psw: '',
            captha: '',
            user_confirm_psw: '',
        };

        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;
    }

    _reset() {
        if (this.state.user_phone === '') {
            showToastShort("您还没有输入手机号码...")
        }else if(!checkInputIsNumber(this.state.user_phone)){
            showToastShort("您输入的手机号码格式不正确...")
        }  else if (this.state.captha === '') {
            showToastShort("您还没有输入验证码...")
        } else if (!checkInputIsNumber(this.state.captha)) {
            showToastShort("验证码不合法...");
        } else if (this.state.user_psw === '') {
            showToastShort("您还没输入密码...")
        } else if (this.state.user_psw.length < 6) {
            showToastShort("密码要在6~20位之间哦...")
        } else if (this.state.user_confirm_psw === '') {
            showToastShort("您还没输入确认密码...")
        } else if (this.state.user_psw !== this.state.user_confirm_psw) {
            showToastShort("密码不一致...")
        } else {
            let requestObj = {
                'phone': this.state.user_phone,
                'smsCode': this.state.captha,
                'password': encryption(this.state.user_confirm_psw),
            };
            post('user/forgetPassword', requestObj,true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("找回密码成功");
                        this.props.dispatch(goBack('Login'));
                    } else if (responseData.status === 10001) {
                        this.errMsg(responseData.message)
                    } else {
                        this.errMsg("找回密码失败，请稍后再试")
                    }
                })
        }
    }

    errMsg(msg) {
        showToastShort(msg);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    _getVerifyCode = () => {
        if(this.onGetVerifyCode)return;
        if (this.state.user_phone === '') {
            showToastShort("您还没有输入手机号码...")
        }else if(!checkInputIsNumber(this.state.user_phone)){
            showToastShort("您输入的手机号码格式不正确...")
        } else{
            this.onGetVerifyCode = true;
            this.setState({isDisable: this.onGetVerifyCode});
            post('user/getForgetPasswordSmsCode', {'phone': this.state.user_phone},true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("验证码已经发送成功，请留意短信...");
                        this.countDownTimer();
                    } else {
                        this.onGetVerifyCode = false;
                        this.setState({isDisable: this.onGetVerifyCode});

                        if (responseData.status === 10001) {
                            this.onGetVerifyCode = false;
                            showToastShort(responseData.message)
                        } else {
                            showToastShort("获取验证码失败，请稍后再试")
                        }
                    }
                })
        }
    };

    countDownTimer() {
        this.timer = setInterval(() => {
            if (this.countDownTime === 0) {
                this.countDownTime = 60;
                this.onGetVerifyCode = false;
                this.setState({isDisable: this.onGetVerifyCode, verify_code: "获取验证码", verify_code_time: this.countDownTime});
                clearInterval(this.timer);
                return;
            }
            this.setState({verify_code: this.countDownTime + "秒"});
            this.countDownTime--;
        }, 1000);
    }

    render() {
        return (
            <View style={{backgroundColor: 'white', flex: 1}}>
                <TitleBar title={'找回密码'}/>
                <View style={{marginTop: 20, alignItems: 'center'}}>
                    <ImageBackground source={ic_register_background} style={styles.resetBackground} resizeMode='cover'>
                        <View style={styles.registerLayout}>
                                <View style={[styles.inputLayout]}>
                                    <Text style={styles.holderText}>手机号码:</Text>
                                    <TextInput
                                        maxLength={11}
                                        placeholder="填写您绑定的手机号码"
                                        placeholderTextColor={placeholderTextColor}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={"numeric"}
                                        style={[styles.registerInput, {marginBottom: -2}]}
                                        onChangeText={(user_phone) => this.setState({user_phone})}
                                    />
                                </View>
                                <View style={[styles.inputLayout,]}>
                                    <Text style={styles.holderText}>验证码:</Text>
                                    <TextInput
                                        maxLength={5}
                                        placeholder="填写验证码"
                                        placeholderTextColor={placeholderTextColor}
                                        underlineColorAndroid={'transparent'}
                                        keyboardType={"numeric"}
                                        style={[styles.registerInput,]}
                                        onChangeText={(captha) => this.setState({captha})}
                                    />
                                    <TouchableOpacity activeOpacity={0.7} disabled={this.state.isDisable}
                                                      style={[styles.getVerifyCode, {backgroundColor: this.state.isDisable ? placeholderTextColor : mainColor}]}
                                                      onPress={this._getVerifyCode}>
                                        <Text style={{color: 'white', fontSize: 12}}>{this.state.verify_code}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.inputLayout,]}>
                                    <Text style={styles.holderText}>设置密码:</Text>
                                    <TextInput
                                        placeholder="填写您的密码"
                                        placeholderTextColor={placeholderTextColor}
                                        underlineColorAndroid={'transparent'}
                                        style={[styles.registerInput,]}
                                        maxLength={20}
                                        onChangeText={(user_psw) => this.setState({user_psw})}
                                        secureTextEntry={true}
                                    />
                                </View>

                                <View style={[styles.inputLayout,]}>
                                    <Text style={styles.holderText}>确认密码:</Text>
                                    <TextInput
                                        placeholder="确认您的密码"
                                        maxLength={20}
                                        placeholderTextColor={placeholderTextColor}
                                        underlineColorAndroid={'transparent'}
                                        style={[styles.registerInput,]}
                                        onChangeText={(user_confirm_psw) => this.setState({user_confirm_psw})}
                                        secureTextEntry={true}
                                    />
                                </View>
                            <TouchableOpacity style={styles.register} activeOpacity={0.7} onPress={() => this._reset()}>
                                <Text style={styles.loginText}>提 交</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        )
    }
}

export default connect()(ResetPasswordComponent);