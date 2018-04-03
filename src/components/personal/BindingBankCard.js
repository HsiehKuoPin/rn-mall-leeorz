import React, {Component} from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Keyboard
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../widgets/TitleBar';
import {mainBackgroundColor, mainColor, placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import {isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import {goBack} from "../../reducers/RouterReducer";
import {saveSingleOtherConfig} from "../../reducers/LoginReducer";
import Region from "../../widgets/Region";
import {checkInputIsNumber, checkPhone} from "../../common/StringUtil";

var codeTime = 60;

class BindingBankCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verifyCodeTips: "获取验证码",
            verify_code_time: codeTime,
            isDisable: false,
            bankCard_num: '',
            bankCard_name: '',
            cardType: '',
            bankNo: '',
            phone: '',
            verify_code: '',
            branch_bank: '',
            addresses: undefined,
            user_area: '',
        };

        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;
    }

    _onEndEditing() {
        if (this.state.bankCard_num !== '') {
            let requestObj = {'bankCardNo': this.state.bankCard_num, token: this.props.token,};
            post('user/queryBankCard', requestObj)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        this.setState({
                            bankCard_name: responseData.result.bankName,
                            cardType: responseData.result.cardType,
                            bankNo: responseData.result.bankNo
                        })
                    } else {
                        showToastShort(responseData.message);
                    }
                })
        }
    }

    _getVerifyCode = () => {
        if (this.state.phone.length === 0) {
            showToastShort("请输入手机号码...");
            return;
        }else if(!checkInputIsNumber(this.state.phone)){
            showToastShort("您输入的手机号码格式不正确...");
            return;
        }
        if (this.onGetVerifyCode) return;
        this.onGetVerifyCode = true;
        this.setState({isDisable: this.onGetVerifyCode});
        let requestObj = {token: this.props.token, 'phone': this.state.phone};
        post('user/sendBindBankCardSmsCode', requestObj, true)
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

    componentWillUnmount() {
        clearInterval(this.timer);
    };

    _submit = () => {
        if (this.state.bankCard_num.replace(/\s+/g, '').length === 0) {
            showToastShort("您还没有输入银行卡号...")
        } else if (!checkInputIsNumber(this.state.bankCard_num)) {
            showToastShort("银行卡号不合法...");
        } else if (this.state.phone.replace(/\s+/g, '').length === 0) {
            showToastShort("您还没填写预留手机号...")
        }else if(!checkInputIsNumber(this.state.phone)){
            showToastShort("您输入的手机号码格式不正确...")
        }  else if (this.state.verify_code.replace(/\s+/g, '').length === 0) {
            showToastShort("您还没输入验证码...")
        } else if (!checkInputIsNumber(this.state.verify_code)) {
            showToastShort("验证码不合法...");
        } else if (this.state.user_area.replace(/\s+/g, '').length === 0) {
            showToastShort("您还没有选择地区...");
        } else if (this.state.branch_bank.replace(/\s+/g, '').length === 0) {
            showToastShort("您还没填写银行卡支行...")
        } else {
            let requestObj = {
                token: this.props.token,
                'smsCode': this.state.verify_code,
                'bankCardNo': this.state.bankCard_num,
                'bankNo': this.state.bankNo,
                'bankName': this.state.bankCard_name,
                'bankAddress': this.state.branch_bank,
                'bankCardPhone': this.state.phone,
                'provinceCode': this.state.addresses.province.id,
                'cityCode': this.state.addresses.city.id,
                'zoneCode': this.state.addresses.area.id,
                'bankCardType': this.state.cardType,
            };
            post('user/bindBankCard', requestObj, true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("绑定成功");
                        this.props.dispatch(saveSingleOtherConfig('isBindBankCard', 'Y'));
                        this.props.dispatch(goBack());
                    } else if (responseData.status === 10001) {
                        showToastShort(responseData.message)
                    } else {
                        showToastShort("绑定失败，请稍后再试")
                    }
                });
        }
    };

    lostBlur() {
        Keyboard.dismiss();
        this.refs.Region.show();
    };

    render() {
        return (
            <View style={styles.container}>
                <TitleBar
                    title={'绑定银行卡'}
                    hideRight={true}
                    isWhiteBackIco={true}
                    customBarStyle={{backgroundColor: mainColor}}
                    customBarTextStyle={{color: 'white'}}/>
                <ScrollView>
                    <View style={[styles.ViewStyle, {marginBottom: 0}]}>
                        <View style={styles.viewStyle}>
                            <Text style={styles.textStyle}>卡号:</Text>
                            <TextInput
                                keyboardType={"numeric"}
                                placeholder="填写银行卡"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                style={styles.registerInput}
                                onEndEditing={() => this._onEndEditing()}
                                onChangeText={(bankCard_num) => this.setState({bankCard_num})}
                            />
                        </View>
                        <View
                            style={{
                                marginLeft: 15,
                                marginRight: 15,
                                backgroundColor: placeholderTextColor,
                                height: 0.5
                            }}/>
                        <View style={styles.viewStyle}>
                            <Text style={styles.textStyle}>{'卡所属银行: ' + this.state.bankCard_name}</Text>
                            <Text style={styles.selectStyle}>{}</Text>
                        </View>
                    </View>
                    <View style={styles.ViewStyle}>
                        <View style={styles.viewStyle}>
                            <Text style={styles.textStyle}>手机号:</Text>
                            <TextInput
                                maxLength={11}
                                placeholder="填写您的银行预留手机号码"
                                keyboardType={"numeric"}
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                style={styles.registerInput}
                                onChangeText={(phone) => this.setState({phone})}
                            />
                        </View>
                        <View
                            style={{
                                marginLeft: 15,
                                marginRight: 15,
                                backgroundColor: placeholderTextColor,
                                height: 0.5
                            }}/>
                        <View style={[styles.viewStyle,]}>
                            <Text style={styles.textStyle}>验证码:</Text>
                            <TextInput
                                maxLength={5}
                                placeholder="填写手机验证码"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                keyboardType={"numeric"}
                                style={styles.codeInput}
                                onChangeText={(verify_code) => this.setState({verify_code})}
                            />
                            <TouchableOpacity activeOpacity={0.7} disabled={this.state.isDisable}
                                              style={[styles.getVerifyCode, {backgroundColor: this.state.isDisable ? placeholderTextColor : mainColor}]}
                                              onPress={()=>this._getVerifyCode()}>
                                <Text style={{color: 'white', fontSize: 12}}>{this.state.verifyCodeTips}</Text>
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                marginLeft: 15,
                                marginRight: 15,
                                backgroundColor: placeholderTextColor,
                                height: 0.5
                            }}/>
                        <View style={styles.viewStyle}>
                            <Text style={styles.textStyle}>开户省市区:</Text>
                            <Text style={styles.selectStyle}
                                  suppressHighlighting={true}
                                  onPress={
                                      this.lostBlur.bind(this)
                                  }>{this.state.user_area !== '' ? this.state.user_area : '\u2000\u2000' + '省份' + '\u2000\u2000' + '城市' + '\u2000\u2000' + '县区'}</Text>
                        </View>
                        <View
                            style={{
                                marginLeft: 15,
                                marginRight: 15,
                                backgroundColor: placeholderTextColor,
                                height: 0.5
                            }}/>
                        <View style={styles.viewStyle}>
                            <Text style={styles.textStyle}>卡所属支行:</Text>
                            <TextInput
                                placeholder="填写银行卡所属支行"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                style={styles.registerInput}
                                onChangeText={(branch_bank) => this.setState({branch_bank})}
                            />
                        </View>
                        <View
                            style={{
                                marginLeft: 15,
                                marginRight: 15,
                                backgroundColor: placeholderTextColor,
                                height: 0.5
                            }}/>
                        <Text style={{
                            fontSize: 12,
                            color: placeholderTextColor,
                            marginTop: 15,
                            marginLeft: 25,
                            marginRight: 25
                        }}>注：请务必填写正确的支行名称，否则将银行打款失败</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.touchCommit}
                            onPress={() => this._submit()}>
                            <Text style={{fontSize: 16, color: '#fff'}}>确认绑定</Text>

                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <Region ref={'Region'}
                        onSurePress={(value) => {
                            this.setState({
                                addresses: value,
                                user_area: value.province.name + value.city.name + value.area.name
                            })
                        }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    ViewStyle: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2
    },
    viewStyle: {
        margin: 10,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 14,
        marginLeft: 10,
        marginRight: 15,
        color: titleTextColor
    },
    registerInput: {
        fontSize: 14,
        flex: 1,
        height: 40,
    },
    codeInput: {
        fontSize: 14,
        flex: 1,
        padding: 0,
        height: 40,
        justifyContent: 'center'
    },
    selectStyle: {
        flex: 1,
        fontSize: 14,
        paddingTop: 10,
        paddingBottom: 10,
    },
    touchCommit: {
        backgroundColor: mainColor,
        margin: 20,
        marginLeft: 45,
        marginRight: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 40

    },
    getVerifyCode: {
        width: 80,
        height: 30,
        borderRadius: 3,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token
    }
};

export default connect(selector)(BindingBankCard);