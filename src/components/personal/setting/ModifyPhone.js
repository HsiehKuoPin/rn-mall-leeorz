import React, {Component} from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import TitleBar from "../../../widgets/TitleBar";
import {mainBackgroundColor, mainColor, placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {goto} from "../../../reducers/RouterReducer";
import {isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import {checkInputIsNumber} from "../../../common/StringUtil";

const {width} = Dimensions.get('window');

class ModifyPhone extends Component{
    constructor(props) {
        super(props);
        this.state = {
            verifyCodeTips: "获取验证码",
            verify_code_time: 60,
            isDisable: false,
            old_phone: '',
            verify_code: '',
        };

        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;
    }

    _getVerifyCode = () => {
        if(this.onGetVerifyCode)return;
        this.onGetVerifyCode = true;
        this.setState({isDisable: this.onGetVerifyCode});
        post('user/sendEditPhoneSmsCode', {token:this.props.token},true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort("验证码已经发送成功，请留意短信...");
                    this._countDownTimer();
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

    //倒计时
    _countDownTimer() {
        this.timer = setInterval(() => {
            if (this.countDownTime === 0) {
                this.countDownTime = 60;
                this.onGetVerifyCode = false;
                this.setState({isDisable: this.onGetVerifyCode, verifyCodeTips: "获取验证码", verify_code_time: this.countDownTime});
                clearInterval(this.timer);
                return;
            }
            this.setState({verifyCodeTips: this.countDownTime + "秒"});
            this.countDownTime--;
        }, 1000);
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    };

    _next = () => {
        if (this.state.verify_code === ''){
            showToastShort("您还没有输入验证码...");
        } else if (!checkInputIsNumber(this.state.verify_code)) {
            showToastShort("验证码不合法...");
        } else {
            let requestObj = {token:this.props.token, 'smsCode':this.state.verify_code};
            post('user/checkOldPhone', requestObj)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        this.props.dispatch(goto('NextModifyPhone'));
                    } else {
                        if (responseData.status === 10001) {
                            showToastShort(responseData.message);
                        } else {
                            showToastShort("获取验证码失败，请稍后再试");
                        }
                    }
                });
        }
    };

    render(){
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1,}}>
                <TitleBar title={'修改手机号码'}/>
                <View style={{marginTop: 10,backgroundColor: 'white', borderRadius: 5, marginHorizontal: 10,}}>

                    <View style={styles.itemLayout}>
                        <View style={styles.inputLayout}>
                            <Text style={styles.holderText}>原手机号码:</Text>
                            <TextInput
                                underlineColorAndroid={'transparent'}
                                style={[styles.input,]}
                                value={this.props.userInfo.phone}
                                editable={false}
                            />
                        </View>

                        <View style={styles.inputLayout}>
                            <Text style={styles.holderText}>验证码:</Text>
                            <TextInput
                                maxLength={5}
                                placeholder="填写验证码"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                keyboardType={"numeric"}
                                style={[styles.input,]}
                                onChangeText={(verify_code) => this.setState({verify_code})}
                            />
                            <TouchableOpacity activeOpacity={0.7} disabled={this.state.isDisable}
                                              style={[styles.getVerifyCode, {backgroundColor: this.state.isDisable ? placeholderTextColor : mainColor}]}
                                              onPress={this._getVerifyCode}>
                                <Text style={{color: 'white', fontSize: 12}}>{this.state.verifyCodeTips}</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.tipsText}>一个手机号只能绑定一个账号</Text>

                        <TouchableOpacity style={styles.buttonStyle} activeOpacity={0.7}
                                          onPress={() => this._next()}>
                            <Text style={styles.buttonText}>下一步</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    inputLayout:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
        borderBottomColor: placeholderTextColor,
        paddingBottom: 5,
        borderBottomWidth: 0.5,
    },
    itemLayout:{
        marginTop: 10,
        paddingLeft:20,
        paddingRight:20,
    },
    getVerifyCode: {
        width: 80,
        borderRadius: 3,
        paddingTop:5,
        paddingBottom:5,
        alignItems: 'center',
        justifyContent: 'center',
        height:30,
    },
    holderText: {
        color: titleTextColor,
        fontSize: 15,
        width:90,
    },
    tipsText: {
        color: placeholderTextColor,
        fontSize: 14,
        marginTop:20,
    },
    buttonStyle: {
        backgroundColor: mainColor,
        width: width * 0.7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: (width - width * 0.7 - 60) / 2
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    input: {
        fontSize: 16,
        flex: 1,
        height: 40,
    },
});

selector = (state) => {
    return {
        userInfo: state.userInfoStore.userInfo,
        token: state.loginStore.token,
    }
};

export default connect(selector)(ModifyPhone);