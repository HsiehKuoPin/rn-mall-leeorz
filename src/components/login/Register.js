import React, {Component} from 'react';
import {
    TextInput,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../../styles/login_style';
import {ic_selected, ic_un_selected,
} from "../../constraint/Image";
import TitleBar from '../../widgets/TitleBar';
import {
    mainColor,
    placeholderTextColor,
    mainBackgroundColor,
    titleTextColor,
    contentTextColor
} from '../../constraint/Colors';
import {showToastShort} from '../../common/CommonToast';
import {post, isSuccess, getHost} from '../../common/CommonRequest';
import {goto, gotoAndClose} from '../../reducers/RouterReducer';
import {checkInputIsNumber, checkPhone, encryption} from '../../common/StringUtil';
import XImage from "../../widgets/XImage";

const {width} = Dimensions.get('window');

class RegisterComponent extends Component {

    constructor(props) {
        super(props);

        this.recommendAccount = '';

        if (this.props.navigation.state.params !== undefined) {
            let {phone,memberId} = this.props.navigation.state.params;
            if(phone){
                this.recommendAccount = phone;
            }else if(memberId){
                this.recommendAccount = memberId;
            }

        }

        this.state = {
            isFindUser: true,
            verify_code: "获取验证码",
            verify_code_time: 60,
            isDisable: false,
            recommend_input: this.recommendAccount,//推荐人的手机或者昵称
            recommendPhone:null,//推荐人手机号码
            recommend_login_name: '',//推荐人用户名
            user_name: '',
            user_phone: '',
            captha: '',
            user_psw: '',
            user_confirm_psw: '',
            isAgreeAgreement: true
        };

        this.onGetVerifyCode = false;
        this.countDownTime = this.state.verify_code_time;

    }

    componentDidMount() {
        if (this.recommendAccount) {
            this._findUserName(this.recommendAccount)
        }
    }

    _register() {
        // 平台会员账号手机号为18888888888
        if (this.state.recommend_input === '') {
            showToastShort("您还没输入推荐人信息...")
        } else if (this.state.recommend_input.length < 2) {
            showToastShort("您输入的推荐人信息长度不能小于2个字符...");
        } else if (this.state.user_name === '') {
            showToastShort("您还没输入用户名...")
        } else if (checkInputIsNumber(this.state.user_name)) {
            showToastShort("用户名不能为纯数字...")
        } else if (this.state.user_phone === '') {
            showToastShort("您还没有输入手机号码...")
        } else if (!checkInputIsNumber(this.state.user_phone)) {
            showToastShort("您输入的手机号码格式不正确...")
        } else if (this.state.captha === '') {
            showToastShort("您还没有输入验证码...")
        } else if (!checkInputIsNumber(this.state.captha)) {
            showToastShort("验证码不合法...");
        } else if (this.state.user_psw === '') {
            showToastShort("您还没输入密码...")
        } else if (this.state.user_psw.length < 6) {
            showToastShort("密码要在6~20位之间哦...")
        } else if (this.state.user_confirm_psw === '') {
            showToastShort("您还没输入确认密码...")
        } else if (this.state.user_confirm_psw.length < 6) {
            showToastShort("密码要在6~20位之间哦...")
        } else if (this.state.user_psw !== this.state.user_confirm_psw) {
            showToastShort("密码不一致...")
        } else if (!this.state.isAgreeAgreement) {
            showToastShort("亲,您还没同意《 用户注册服务协议》...")
        } else {
            let requestObj = {
                'recommendPhone': this.state.recommendPhone,
                'loginName': this.state.user_name,
                'phone': this.state.user_phone,
                'smsCode': this.state.captha,
                'password': encryption(this.state.user_confirm_psw),
            };
            post('user/toRegister', requestObj, true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("注册成功");
                        // this.props.dispatch(goBack('Login'));
                        this.props.dispatch(gotoAndClose('Login', ['Main']))
                    } else if (responseData.status === 10001) {
                        this.errMsg(responseData.message)
                    } else {
                        this.errMsg("注册失败，请稍后再试")
                    }
                }).catch((e) => {
                this.errMsg(e.message);
            });
        }
    }

    errMsg(msg) {
        showToastShort(msg);
    }

    _findUserName(input) {
        post('user/getRecommend', {'recommend': input})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let {loginName,name,phone} = responseData.result;
                    this.setState({recommendPhone:phone,recommend_login_name: name?name:loginName, isFindUser: true})
                } else {
                    this.setState({recommend_login_name: '推荐人不存在', isFindUser: false})
                }
            })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
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
            post('user/getRegisterSmsCode', {'phone': this.state.user_phone}, true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        showToastShort("验证码已经发送成功，请留意短信...");
                        this.countDownTimer();
                    } else if (responseData.status === 10001) {
                        this.onGetVerifyCode = false;
                        showToastShort(responseData.message)
                    } else {
                        this.onGetVerifyCode = false;
                        this.setState({isDisable: this.onGetVerifyCode});
                        showToastShort("获取验证码失败，请稍后再试")
                    }
                })
        }
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
                <TitleBar title={'注  册'} hideRight={true}/>
                <View style={{marginTop: 20, alignItems: 'center'}}>
                    <View
                                     style={styles.registerBackground}>
                        <View style={styles.registerLayout}>
                            <View style={Styles.InputLayout}>
                                <Text style={styles.holderText}>推荐人:</Text>
                                <TextInput
                                    maxLength={16}
                                    editable={!this.recommendAccount}
                                    defaultValue={this.recommendAccount ? this.recommendAccount : ''}
                                    placeholder="可填会员ID,用户昵称和手机号码"
                                    placeholderTextColor={placeholderTextColor}
                                    underlineColorAndroid={'transparent'}
                                    // keyboardType={"numeric"}
                                    onBlur={() => {
                                        let input = this.state.recommend_input;
                                        if (input.length >= 2 && input.length <= 16) {
                                            this._findUserName(input);
                                        }
                                    }}
                                    style={[styles.registerInput,]}
                                    onChangeText={(recommend_input) => {
                                        if (recommend_input.length < 2) {
                                            this.setState({recommend_input, recommend_login_name: ''})
                                        } else {
                                            this.setState({recommend_input})
                                        }

                                    }}
                                />
                            </View>

                            <View style={[Styles.InputLayout, {paddingBottom: 10}]}>
                                <Text style={[styles.holderText, {width: 90}]}>推荐人昵称:</Text>
                                <Text
                                    style={[Styles.RecommendName, {backgroundColor: '#00000000',color: this.state.isFindUser ? titleTextColor : 'red'}]}>{this.state.recommend_login_name}</Text>
                            </View>

                            <View style={Styles.InputLayout}>
                                <Text style={styles.holderText}>用户昵称:</Text>
                                <TextInput
                                    maxLength={16}
                                    autoCorrect={false}
                                    placeholder="设置你的用户昵称"
                                    placeholderTextColor={placeholderTextColor}
                                    underlineColorAndroid={'transparent'}
                                    style={[styles.registerInput,]}
                                    onChangeText={(user_name) => this.setState({user_name})}
                                />
                            </View>

                            <View style={Styles.InputLayout}>
                                <Text style={styles.holderText}>手机号码:</Text>
                                <TextInput
                                    maxLength={11}
                                    placeholder="填写您的手机号码"
                                    placeholderTextColor={placeholderTextColor}
                                    underlineColorAndroid={'transparent'}
                                    keyboardType={"numeric"}
                                    style={[styles.registerInput,]}
                                    onChangeText={(user_phone) => this.setState({user_phone})}
                                />
                            </View>
                            <View style={Styles.InputLayout}>
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
                                                  style={[Styles.getVerifyCode, {backgroundColor: this.state.isDisable ? placeholderTextColor : mainColor}]}
                                                  onPress={this._getVerifyCode}>
                                    <Text style={{color: 'white', fontSize: 12}}>{this.state.verify_code}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={Styles.InputLayout}>
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
                            <View style={Styles.InputLayout}>
                                <Text style={styles.holderText}>确认密码:</Text>
                                <TextInput
                                    placeholder="确认您的密码"
                                    placeholderTextColor={placeholderTextColor}
                                    underlineColorAndroid={'transparent'}
                                    style={[styles.registerInput,]}
                                    maxLength={20}
                                    onChangeText={(user_confirm_psw) => this.setState({user_confirm_psw})}
                                    secureTextEntry={true}
                                />
                            </View>

                            {/*<View style={{flexDirection: 'row', marginTop: 20, alignSelf: 'flex-start'}}>*/}
                                {/*<TouchableOpacity activeOpacity={1} style={{flexDirection: 'row',}}*/}
                                                  {/*onPress={() => {*/}
                                    {/*this.setState(preState => {*/}
                                        {/*return {isAgreeAgreement: !preState.isAgreeAgreement};*/}
                                    {/*});*/}
                                {/*}}>*/}
                                    {/*<XImage source={this.state.isAgreeAgreement ? ic_selected : ic_un_selected}*/}
                                            {/*style={Styles.agreement}*/}
                                    {/*/>*/}
                                    {/*<Text style={[Styles.protocol, {marginLeft: 5,color:contentTextColor}]}>{'勾选即表示同意'}</Text>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity activeOpacity={0.7}*/}
                                                  {/*onPress={() => this.props.dispatch(goto('Agreement', {title: ' 用户注册服务协议', url: getHost() + 'main/register_protocol.html'}))}>*/}
                                    {/*<Text style={Styles.protocol}>《用户注册服务协议》</Text>*/}
                                {/*</TouchableOpacity>*/}
                            {/*</View>*/}
                            <TouchableOpacity style={styles.register} activeOpacity={0.7}
                                              onPress={() => this._register()}>
                                <Text style={styles.loginText}>提 交</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    InputLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13,
        borderBottomColor: placeholderTextColor,
        paddingBottom: 5,
        borderBottomWidth: 0.5,
    },
    RecommendName: {
        fontSize: 14,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        color: 'black',
        paddingLeft: 15,
    },
    getVerifyCode: {
        width: 80,
        borderRadius: 3,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30,
    },
    BackgroundContent: {
        width: width - 30,
        height: (width - 30) / 0.772511848,
    },
    agreement: {
        width: 15,
        height: 15,
    },
    protocol: {
        fontSize: 12,
        color: '#65BCFE',
        backgroundColor: 'transparent'
    }
});

export default connect()(RegisterComponent);