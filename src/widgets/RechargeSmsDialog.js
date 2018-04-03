import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    TextInput,
    DeviceEventEmitter
} from 'react-native';

import {titleTextColor, mainColor, placeholderTextColor, mainBackgroundColor} from "../constraint/Colors";

const {width, height} = Dimensions.get('window');
const navigatorH = 64; // navigator height
const [aWidth, aHeight] = [width, 314];
const [left, top] = [0, 0];
const [middleLeft] = [(width - aWidth) / 2, (height - aHeight) / 2 - navigatorH];
import {isSuccess, post} from "../common/CommonRequest";
import {showToastShort} from "../common/CommonToast";
import {checkInputIsNumber} from "../common/StringUtil";

var codeTime = 60;
export default class RechargeSmsDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            opacity: new Animated.Value(0),
            hide: true,
            code: '',
            verifyCodeTips: "获取验证码",
            verify_code_time: codeTime,
            isDisable: false,
        };
        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;
    }

    _onPressConfirm = () => {
        if (this.state.code === '') {
            showToastShort("请输入验证码");
        } else if (!checkInputIsNumber(this.state.code)) {
            showToastShort("验证码不合法");
        } else {
            DeviceEventEmitter.emit('code', this.state.code);
            this.dismiss()
        }
    };

    _getVerifyCode = () => {
        if (this.onGetVerifyCode) return;
        this.onGetVerifyCode = true;
        this.setState({isDisable: this.onGetVerifyCode});
        let requestObj = {
            token: this.props.token,
            'memberRechargeId': this.props.memberRechargeId
        };

        post('user/allScoreReSms', requestObj,true)
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

    componentWillUnmount() {
        clearInterval(this.timer);
    };

    _countDownTimer() {
        this.timer = setInterval(() => {
            if (this.countDownTime === 0) {
                this.clearTimer();
                return;
            }
            this.setState({verifyCodeTips: this.countDownTime + "秒"});
            this.countDownTime--;
        }, 1000);
    }

    render() {
        let content = this.state.hide ? null : ( <View style={[styles.container]}>
            <Animated.View style={styles.mask}>
                <Text style={styles.mask} onPress={this.dismiss.bind(this)}/>
            </Animated.View>

            <Animated.View style={
                [styles.tip, {
                    transform: [{
                        translateY: this.state.offset.interpolate({
                            inputRange: [0, 1],
                            outputRange: [height / 2, (height / 2 - 60)]
                        }),
                    }]
                }]
            }>
                <View style={{marginHorizontal: 10, backgroundColor: 'white', borderRadius: 5}}>
                    <View style={{marginTop: 30, marginHorizontal: 30}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.text}>{'银行卡绑定手机号:'}</Text>
                            <Text style={{color: titleTextColor, fontSize: 16}}>{this.props.data.bankCardPhone}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 20, alignItems: 'center'}}>
                            <Text style={styles.text}>{'验证码:'}</Text>
                            <View style={styles.textInputStyle}>
                                <TextInput
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    placeholder="填写手机验证码"
                                    placeholderTextColor={placeholderTextColor}
                                    style={{flex: 1, paddingHorizontal: 5, fontSize: 15}}
                                    autoFocus={true}
                                    autoCapitalize="none"
                                    maxLength={6}
                                    onChangeText={(code) => {
                                        this.setState({code: code})
                                    }}
                                />
                            </View>
                            <TouchableOpacity style={[styles.verifyCode, {backgroundColor: this.state.isDisable ? placeholderTextColor : mainColor}]} onPress={() => this._getVerifyCode()}
                                              disabled={this.state.isDisable}>
                                <Text style={{color: 'white', fontSize: 14}}>{this.state.verifyCodeTips}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={styles.recharge}
                                      onPress={() => this._onPressConfirm()}>
                        <Text style={{
                            color: 'white',
                            textAlign: 'center',
                            fontSize: 17
                        }}>{'确  认'}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </View>);
        return content;
    }

    //显示动画
    in() {
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.spring,
                    duration: 250,
                    toValue: 0.8,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.spring,
                    duration: 250,
                    toValue: 1,
                }
            )
        ]).start();
    }

    //隐藏动画
    out() {
        Animated.parallel([
            Animated.timing(this.state.opacity,
                {
                    // easing: Easing.linear,
                    duration: 0,
                    toValue: 0,
                }
            ),
            Animated.timing(this.state.offset,
                {
                    // easing: Easing.linear,
                    duration: 0,
                    toValue: 0,
                }
            )
        ]).start();

        setTimeout(() => this.setState({hide: true}), 0.00001);
    }

    clearTimer() {
        this.countDownTime = 60;
        this.onGetVerifyCode = false;
        this.setState({isDisable: this.onGetVerifyCode, verifyCodeTips: "获取验证码", verify_code_time: this.countDownTime});
        clearInterval(this.timer);
    }

    //取消
    dismiss(event) {
        if (!this.state.hide) {
            this.clearTimer();
            this.out();
        }
    }

    show(title) {
        if (this.state.hide) {
            this.onGetVerifyCode = true;
            this.setState({hide: false, title: title, isDisable: this.onGetVerifyCode}, this.in);
            this._countDownTimer();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
        elevation: 5,
    },
    mask: {
        justifyContent: "center",
        backgroundColor: "#383838",
        opacity: 0.3,
        position: "absolute",
        width: width,
        height: height,
        left: left,
        top: top,
    },
    tip: {
        width: aWidth,
        height: 250,
        left: middleLeft,
        backgroundColor: 'transparent'
    },
    text: {
        color: titleTextColor,
        fontSize: 16,
        marginRight: 10
    },
    textInputStyle: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        borderRadius: 3,
        height: 40,
        backgroundColor: mainBackgroundColor,
    },
    verifyCode: {
        height: 40,
        width: 100,
        backgroundColor: mainColor,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    recharge: {
        backgroundColor: mainColor,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width - 160,
        borderRadius: 5,
        marginTop: 20,
        marginBottom: 30
    },
});

