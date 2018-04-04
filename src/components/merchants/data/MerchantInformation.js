import React, {Component} from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    Text
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {getRequestFailTip, isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import {titleTextColor, placeholderTextColor, contentTextColor} from '../../../constraint/Colors';
import {checkInputIsNumber, checkPhone, checkInputEmail, replaceBlank} from '../../../common/StringUtil';
import {ic_merchant_data, ic_merchant_data_iphoneX, ic_selected, ic_un_selected} from '../../../constraint/Image';
import {goto, gotoAndClose} from '../../../reducers/RouterReducer';
import XImage from "../../../widgets/XImage";
import {APP_NAME} from "../../../constraint/Strings";

const {width, height} = Dimensions.get('window');

class MerchantInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verify_code: "获取验证码",
            verify_code_time: 60,
            isDisable: false,
            user_email: '',
            user_company_name: '',
            user_name: '',
            user_phone: '',
            code: '',
            companyCertificates: [],
            isAgreeAgreement: false,
        };
        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;
    }

    componentDidMount() {
        post('order/company/getCompanyCertificate', {token: this.props.token})
            .then((response) => {
                if (isSuccess(response)) {
                    let merchantInfo = response.result;
                    this.setState({
                        user_name: merchantInfo.applyPerson,
                        user_phone: merchantInfo.phone,
                        user_company_name: merchantInfo.name,
                        user_email: merchantInfo.email,
                        companyCertificates: merchantInfo.companyCertificates
                    })
                }
            })
    }

    _getVerifyCode = () => {
        if (this.onGetVerifyCode) return;
        if (this.state.user_phone === '') {
            showToastShort("您还没有输入手机号码...")
        } else if (!checkInputIsNumber(this.state.user_phone)) {
            showToastShort("您输入的手机号码格式不正确...")
        } else {
            this.onGetVerifyCode = true;
            this.setState({isDisable: this.onGetVerifyCode});
            post("order/company/getCompanyInCode", {token: this.props.token, phone: this.state.user_phone})
                .then((response) => {
                    if (isSuccess(response)) {
                        showToastShort("验证码已经发送成功，请留意短信...");
                        this.countDownTimer();
                    } else {
                        this.onGetVerifyCode = false;
                        this.setState({isDisable: this.onGetVerifyCode});
                        if (response.status === 10001) {
                            showToastShort(response.message)
                        } else {
                            showToastShort("获取验证码失败，请稍后再试")
                        }
                    }
                })
        }
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    }

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

    next() {
        if (replaceBlank(this.state.user_name).length === 0) {
            showToastShort("您还没输入姓名...")
        } else if (this.state.user_email === '') {
            showToastShort("您还没输入邮箱...")
        } else if (!checkInputEmail(this.state.user_email)) {
            showToastShort('您输入的不是有效的邮箱...');
        } else if (this.state.user_phone === '') {
            showToastShort("您还没输入手机号码...")
        } else if (!checkInputIsNumber(this.state.user_phone)) {
            showToastShort("您输入的手机号码格式不正确...")
        } else if (this.state.code === '') {
            showToastShort("您还没输入验证码...")
        } else if (!checkInputIsNumber(this.state.code)) {
            showToastShort("验证码不合法...");
        } else if (replaceBlank(this.state.user_company_name).length === 0) {
            showToastShort("您还没输入企业名称...")
        } else if (!this.state.isAgreeAgreement) {
            showToastShort(`亲,您还没同意《${APP_NAME}开放平台入驻商家服务协议》...`)
        } else {

            let checkVerifyCode = {
                token: this.props.token,
                phone: this.state.user_phone,
                smsCode: this.state.code
            };
            let submitInfo = {

                token: this.props.token,
                company: {
                    applyPerson: this.state.user_name,
                    phone: this.state.user_phone,
                    name: this.state.user_company_name,
                    email: this.state.user_email,
                },
                companyDocuments:[],
                legalIdentityCards:[]
            };
            let checkVerifyCodeRequest = post('order/company/checkCompanyInCode', checkVerifyCode);
            let submitInfoRequest = post('order/company/uploadData',submitInfo);

            Promise.all([checkVerifyCodeRequest,submitInfoRequest])
                .then(([checkVerifyCodeResponse,submitInfoResponse])=>{
                    if(isSuccess(checkVerifyCodeResponse) && isSuccess(submitInfoResponse)){
                        this.props.dispatch(gotoAndClose('DataAuditing', 'Main'))
                    }else{
                        if(!isSuccess(checkVerifyCodeResponse)){
                            showToastShort(getRequestFailTip(checkVerifyCodeResponse))
                        }else if(!isSuccess(submitInfoResponse)){
                            showToastShort(getRequestFailTip(submitInfoResponse));
                        }
                    }
            }).catch(e=>{
                showToastShort(getRequestFailTip());
            });

        //         .then((response) => {
        //             if (isSuccess(response)) {
        //                 this.info = {
        //                     applyPerson: this.state.user_name,
        //                     phone: this.state.user_phone,
        //                     name: this.state.user_company_name,
        //                     email: this.state.user_email,
        //                 };
        //                 this.props.dispatch(goto('MerchantUploadData', {
        //                     merchantInfo: this.info, companyCertificates: this.state.companyCertificates
        //                 }));
        //             } else {
        //                 showToastShort(response.message)
        //             }
        //         }).catch((e) => {
        //         console.warn(e.message);
        //         showToastShort(getRequestFailTip());
        //     });
        }
    }

    render() {
        return (
            <ScrollView style={{flex: 1}}>
                <ImageBackground resizeMode='stretch'
                                 source={{uri: isIphoneX() ? ic_merchant_data_iphoneX : ic_merchant_data}}
                                 style={{width: width, height: height}}>
                    <TitleBar title={'填写资料'} customBarStyle={{backgroundColor: 'transparent'}}/>
                    <View style={{flex: 1, marginHorizontal: 40}}>
                        <View style={styles.contentLayout}>
                            <View style={[styles.inputLayout, {marginTop: 10}]}>
                                <Text style={styles.holderText}>申请人:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="填写姓名"
                                    defaultValue={this.state.user_name}
                                    placeholderTextColor={placeholderTextColor}
                                    onChangeText={(user_name) => this.setState({user_name})}
                                    underlineColorAndroid={'transparent'}/>
                            </View>
                            <View style={[styles.inputLayout, {marginTop: 10}]}>
                                <Text style={styles.holderText}>联系邮箱:</Text>
                                <TextInput
                                    style={styles.input}
                                    defaultValue={this.state.user_email}
                                    placeholder="填写邮箱地址"
                                    placeholderTextColor={placeholderTextColor}
                                    onChangeText={(user_email) => this.setState({user_email})}
                                    underlineColorAndroid={'transparent'}/>
                            </View>
                            <View style={[styles.inputLayout, {marginTop: 10}]}>
                                <Text style={styles.holderText}>联系手机号码:</Text>
                                <TextInput
                                    style={styles.input}
                                    maxLength={11}
                                    keyboardType={"numeric"}
                                    defaultValue={this.state.user_phone}
                                    placeholder="填写手机号码"
                                    onChangeText={(user_phone) => this.setState({user_phone})}
                                    placeholderTextColor={placeholderTextColor}
                                    underlineColorAndroid={'transparent'}/>
                            </View>
                            <View style={[styles.inputLayout, {marginTop: 10}]}>
                                <Text style={styles.holderText}>手机验证码:</Text>
                                <View style={styles.captchaInput}>
                                    <TextInput
                                        style={{flex: 1, height: 38, fontSize: 15}}
                                        maxLength={5}
                                        keyboardType={"numeric"}
                                        placeholder="填写验证码"
                                        onChangeText={(code) => this.setState({code})}
                                        placeholderTextColor={placeholderTextColor}
                                        underlineColorAndroid={'transparent'}/>
                                    <TouchableOpacity activeOpacity={0.7} disabled={this.state.isDisable}
                                                      style={[styles.getVerifyCode]}
                                                      onPress={this._getVerifyCode}>
                                        <Text style={{
                                            color: titleTextColor,
                                            fontSize: 15
                                        }}>{this.state.verify_code}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.inputLayout, {marginTop: 10}]}>
                                <Text style={styles.holderText}>企业公司名称:</Text>
                                <TextInput
                                    style={styles.input}
                                    defaultValue={this.state.user_company_name}
                                    placeholder="填写企业公司名称"
                                    onChangeText={(user_company_name) => this.setState({user_company_name})}
                                    placeholderTextColor={placeholderTextColor}
                                    underlineColorAndroid={'transparent'}/>
                            </View>
                            <View style={{flexDirection: 'row', marginTop: 20,}}>
                                <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row',alignItems: 'center'}}
                                                  onPress={() => {
                                                      this.setState(preState => {
                                                          return {isAgreeAgreement: !this.state.isAgreeAgreement};
                                                      });
                                                  }}>
                                    <XImage source={this.state.isAgreeAgreement ? ic_selected : ic_un_selected}
                                            style={styles.agreement}/>
                                    <Text style={{fontSize: 12, color: contentTextColor}}>{'勾选即表示同意'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.dispatch(goto('Agreement', {title: `${APP_NAME}开放平台入驻商家服务协议`, url: getHost() + 'main/merchant_protocol.html'}))}>
                                    <Text style={{fontSize: 12, color: '#65BCFE',}}>《{APP_NAME}开放平台入驻商家服务协议》</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <TouchableOpacity style={styles.next_step} onPress={() => this.next()}>
                            <Text style={{fontSize: 15, color: titleTextColor, textAlign: 'right'}}>上传资料</Text>
                            {/*<Text style={{fontSize: 15, color: titleTextColor, textAlign: 'right'}}>下一步</Text>*/}
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({

    contentLayout: {
        marginTop: Platform.OS === 'android' ? height / 7 + 15 : height / 7,
        backgroundColor: 'transparent',
        flex: 1,
    },
    agreement: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
    inputLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    holderText: {
        color: titleTextColor,
        fontSize: 15,
        width: 100,
        marginRight: 5,
        textAlign: 'right',
    },
    input: {
        fontSize: 15,
        flex: 1,
        height: 38,
        justifyContent: 'center',
        borderBottomColor: "#f8b265",
        borderBottomWidth: 0.5,
    },
    captchaInput: {
        flexDirection: 'row',
        flex: 1,
        height: 35,
        justifyContent: 'center',
        borderBottomColor: "#f8b265",
        paddingBottom: 8,
        borderBottomWidth: 0.5,
    },
    getVerifyCode: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
    },
    next_step: {
        position: 'absolute',
        width: 80,
        marginTop: height / 1.5 + 10,
        alignSelf: 'flex-end',
        borderBottomColor: "#f8b265",
        paddingBottom: 5,
        borderBottomWidth: 0.5,
        backgroundColor: 'transparent'
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(MerchantInformation)