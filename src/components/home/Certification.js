import React, {Component} from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import TitleBar from '../../widgets/TitleBar';
import {mainColor, placeholderTextColor, mainBackgroundColor, titleTextColor} from '../../constraint/Colors';
import {post,isSuccess,} from '../../common/CommonRequest';
import {showToastShort} from '../../common/CommonToast';
import {goBack} from '../../reducers/RouterReducer';
import {saveSingleOtherConfig} from "../../reducers/LoginReducer";
import {checkInputIsNumber} from "../../common/StringUtil";

var codeTime = 60;
class Certification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verify_code: "获取验证码",
            verify_code_time: codeTime,
            isDisable: false,
            user_name: '',
            user_idNumber: '',
            user_captcha: '',
        };

        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;
    }

    _submit() {
        if (this.state.user_name === '') {
            showToastShort("您还没有输入姓名...")
        }else if (this.state.user_idNumber === '') {
            showToastShort("您还没有输入身份证号...")
        }else if (this.state.user_captcha === '') {
            showToastShort("您还没有输入验证码...")
        } else if (!checkInputIsNumber(this.state.user_captcha)) {
            showToastShort("验证码不合法...");
        } else {
            let requestObj = {
                'phone': this.props.userInfo.phone,
                'smsCode': this.state.user_captcha,
                'idCard': this.state.user_idNumber,
                'realName': this.state.user_name,
                token:this.props.token,
            };
            post('user/realNameAuth', requestObj,true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("提交成功");
                        this.props.dispatch(saveSingleOtherConfig('isRealNameAuth','Y'));
                        this.props.dispatch(goBack());
                    } else if (responseData.status === 10001) {
                        this.errMsg(responseData.message)
                    } else {
                        this.errMsg("提交失败，请稍后再试")
                    }
                }).catch(e=>{
            });
        }
    }

    errMsg(msg) {
        showToastShort(msg);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    _getVerifyCode = () => {
        if (this.onGetVerifyCode) return;
        this.onGetVerifyCode = true;
        this.setState({isDisable: this.onGetVerifyCode});
        let requestObj = {
            'phone': this.props.userInfo.phone,
            token:this.props.token,
        };
        post('user/sendRealNameSmsCode', requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort("验证码已经发送成功，请留意短信...");
                    this.countDownTimer();
                } else {
                    this.onGetVerifyCode = false;
                    this.setState({isDisable: this.onGetVerifyCode});

                    if (responseData.status === 10001) {
                        showToastShort(responseData.message)
                    } else {
                        showToastShort("获取验证码失败，请稍后再试")
                    }
                }
            });
    };

    countDownTimer() {
        this.timer = setInterval(() => {
            if (this.countDownTime === 0) {
                this.countDownTime = 60;
                this.onGetVerifyCode = false;
                this.setState({
                    isDisable: this.onGetVerifyCode,
                    verify_code: "获取验证码",
                    verify_code_time: this.countDownTime
                });
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
                <TitleBar title={'实名认证'} hideRight={true}/>
                <View style={styles.container}>
                    <View style={styles.inputLayout}>
                        <Text style={styles.holderText}>姓名：</Text>
                        <TextInput
                            placeholder="填写您的姓名"
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            style={styles.inputText}
                            onChangeText={(user_name) => this.setState({user_name})}
                        />
                    </View>
                    <View style={styles.inputLayout}>
                        <Text style={styles.holderText}>身份证号：</Text>
                        <TextInput
                            maxLength={18}
                            placeholder="填写您的身份证号"
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            style={styles.inputText}
                            onChangeText={(user_idNumber) => this.setState({user_idNumber})}
                        />
                    </View>
                    <View style={styles.inputLayout}>
                        <Text style={styles.holderText}>手机号码：</Text>
                        <TextInput
                            maxLength={11}
                            placeholder="填写绑定的手机号码"
                            keyboardType={"numeric"}
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            style={styles.inputText}
                            value={this.props.userInfo.phone}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputLayout}>
                        <Text style={styles.holderText}>验证码：</Text>
                        <TextInput
                            maxLength={5}
                            placeholder="填写验证码"
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            keyboardType={"numeric"}
                            style={styles.inputText}
                            onChangeText={(user_captcha) => this.setState({user_captcha})}
                        />
                        <TouchableOpacity
                            activeOpacity={0.7} disabled={this.state.isDisable}
                            style={[styles.getVerifyCode, {backgroundColor: this.state.isDisable ? placeholderTextColor : mainColor}]}
                            onPress={this._getVerifyCode}>
                            <Text style={{color: 'white', fontSize: 12}}>{this.state.verify_code}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.confirmTouch}
                        activeOpacity={0.7}
                        onPress={() => this._submit()}>
                        <Text style={{fontSize: 18, color: '#fff'}}>提交认证</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 20,
    },
    inputLayout:{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        borderBottomColor: placeholderTextColor,
        borderBottomWidth: 0.5,
        paddingLeft:10,
        paddingBottom: 5,
    },
    holderText: {
        color: titleTextColor,
        fontSize: 16,
        width:90,
    },
    inputText: {
        fontSize: 16,
        flex: 1,
        height: 40,
    },
    getVerifyCode: {
        backgroundColor: mainColor,
        minWidth: 80,
        borderRadius: 3,
        paddingVertical:5,
        paddingHorizontal:15,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
    },
    confirmTouch: {
        backgroundColor: mainColor,
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:20,
        marginVertical:20,
    },
});

selector = (state) => {
    return {
        userInfo: state.userInfoStore.userInfo,
        token: state.loginStore.token
    }
}

export default connect(selector)(Certification);