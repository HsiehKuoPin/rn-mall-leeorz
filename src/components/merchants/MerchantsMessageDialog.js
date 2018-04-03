import React, {Component} from 'react';
import {
    View, TouchableOpacity, StyleSheet, Text, Dimensions, TextInput
} from 'react-native';

import {content2TextColor, mainColor, placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import XImage from "../../widgets/XImage";
import {ic_cancelPay_cross} from "../../constraint/Image";
import {showToastShort} from "../../common/CommonToast";
import {isSuccess, post} from "../../common/CommonRequest";
import {isIPhone5} from "../../common/AppUtil";
import {checkInputIsNumber} from "../../common/StringUtil";

const {width, height} = Dimensions.get('window');

export default class MerchantsMessageDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            showView: true,
            verifyCodeTips: "获取验证码",
            verify_code_time: 60,
            isDisable: false,
            new_phone: '',
            verify_code: '',
            merchantsMessage: null
        };

        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;
    }

    dismiss() {
        this.setState({
            isVisible: false,
            showView: true
        });
    }

    show() {
        this.setState({
            isVisible: true,
            showView: true
        });
    }

    //发送验证码
    _getVerifyCode = () => {
        if (this.onGetVerifyCode) return;
        this.onGetVerifyCode = true;
        this.setState({isDisable: this.onGetVerifyCode});
        let requestObj = {token: this.props.token, 'phone': this.props.phone};
        post('order/company/getCompanyAccountCode', requestObj, true)
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

    //验证验证码
    _checkVerifyCode = () => {
        if (this.state.verify_code === ''){
            showToastShort("您还没有输入验证码...");
            return;
        } else if (!checkInputIsNumber(this.state.verify_code)) {
            showToastShort("验证码不合法...");
            return;
        }
        let requestObj = {token: this.props.token, 'phone': this.props.phone, 'smsCode': this.state.verify_code};
        post('order/company/checkCompanyAccountCode', requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        merchantsMessage: responseData.result,
                        showView: false
                    })
                } else {
                    showToastShort(responseData.message)
                }
            });
    }

    //倒计时
    _countDownTimer() {
        this.timer = setInterval(() => {
            if (this.countDownTime === 0) {
                this.countDownTime = 60;
                this.onGetVerifyCode = false;
                this.setState({
                    isDisable: this.onGetVerifyCode,
                    verifyCodeTips: "获取验证码",
                    verify_code_time: this.countDownTime
                });
                clearInterval(this.timer);
                return;
            }
            this.setState({verifyCodeTips: this.countDownTime + "秒"});
            this.countDownTime--;
        }, 1000);
    }

    render() {
        return (
            <View style={{position: 'absolute'}}>
                {
                    !this.state.isVisible ? null :
                        <View style={styles.container}>
                            {this.state.showView ? this.renderCode() : this.renderMessage()}
                        </View>
                }
            </View>
        );
    }

    renderCode() {
        return (
            <View style={styles.containerView}>
                <View style={{
                    width: width - (isIPhone5() ? 60 : 100),
                    height: 200,
                    marginLeft: isIPhone5() ? 30 : 50,
                    marginRight: isIPhone5() ? 30 : 50,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    justifyContent: 'center',
                    marginTop: (height - 200) / 2 - 88
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10}}>
                        <Text style={{color: titleTextColor, fontSize: 18, textAlign: 'center', flex: 1}}>验证码</Text>
                        <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center'}}
                                          onPress={() => this.dismiss()}>
                            <XImage source={ic_cancelPay_cross}
                                    style={{width: 15, height: 15}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputLayout}>
                        <TextInput
                            maxLength={5}
                            placeholder="填写验证码"
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            keyboardType={"numeric"}
                            style={styles.input}
                            onChangeText={(verify_code) => this.setState({verify_code})}
                        />
                        <TouchableOpacity activeOpacity={0.7} disabled={this.state.isDisable}
                                          style={[styles.getVerifyCode, {backgroundColor: this.state.isDisable ? placeholderTextColor : mainColor}]}
                                          onPress={this._getVerifyCode}>
                            <Text style={{color: 'white', fontSize: 12}}>{this.state.verifyCodeTips}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}
                                      style={styles.buttonStyle}
                                      onPress={this._checkVerifyCode}>
                        <Text style={{color: 'white', fontSize: 15}}>{'查看'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderMessage() {
        return (
            <View style={styles.containerView}>
                <View style={{
                    width: width - (isIPhone5() ? 60 : 100),
                    height: 200,
                    marginLeft: isIPhone5() ? 30 : 50,
                    marginRight: isIPhone5() ? 30 : 50,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    justifyContent: 'center',
                    marginTop: (height - 200) / 2 - 88
                }}>
                    <View style={{marginHorizontal: 30, marginVertical: 10, backgroundColor: 'white'}}>
                        <Text style={styles.textStyle}>
                            <Text style={[styles.textStyle, {color: content2TextColor}]}>商家管理后台接口：</Text>
                            {this.state.merchantsMessage.companyLink}
                        </Text>
                        <Text style={styles.textStyle}>
                            <Text style={[styles.textStyle, {color: content2TextColor}]}>登录账号：</Text>
                            {this.state.merchantsMessage.account}
                        </Text>
                        {/*<Text style={styles.textStyle}>*/}
                            {/*<Text style={[styles.textStyle, {color: content2TextColor}]}>初始密码：</Text>*/}
                            {/*{'123456'}*/}
                        {/*</Text>*/}
                    </View>
                    <TouchableOpacity activeOpacity={0.7}
                                      style={[styles.buttonStyle, {marginTop: 10}]}
                                      onPress={() => this.dismiss()}>
                        <Text style={{color: 'white', fontSize: 15}}>{'确定'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        height: height,
        width: width,
    },
    containerView: {
        position: "absolute",
        height: height,
    },
    inputLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginHorizontal: 25,
        borderBottomColor: placeholderTextColor,
        paddingBottom: 5,
        borderBottomWidth: 0.5,
    },
    input: {
        fontSize: 15,
        flex: 1,
    },
    getVerifyCode: {
        width: 80,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
    },
    buttonStyle: {
        marginHorizontal: 25,
        marginVertical: 30,
        height: 35,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainColor
    },
    textStyle: {
        marginTop: 10,
        fontSize: 15,
        color: titleTextColor
    },
});
