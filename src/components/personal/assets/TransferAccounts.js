import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';

import {
    mainColor,
    mainBackgroundColor,
    titleTextColor,
    placeholderTextColor, content2TextColor
} from '../../../constraint/Colors';
import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {
    checkInputIsFloatNumber, checkInputIsNumber, checkInputLegal, checkInputMoney, checkPhone,
    formatInputNumber, formatMoney, hidePhone
} from '../../../common/StringUtil';
import {ic_n_drop_down} from "../../../constraint/Image";
import {showToastShort} from '../../../common/CommonToast';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import {goBack, goto} from '../../../reducers/RouterReducer';
import DropDownDialog from "../../home/module/DropDownDialog";

let width = Dimensions.get('window').width;
import PayPasswordView from '../../../widgets/PayPasswordView';
import {
    BALANCE_ACCOUNT,
    CONSUMER_COUPON_ACCOUNT, getAssetTypeName, JADE_INTEGRAL_ACCOUNT, K_INTEGRAL_ACCOUNT,
    PLATINUM_INTEGRAL_ACCOUNT
} from "../../../constraint/AssetsType";
import {isTrue} from "../../../common/AppUtil";
import {CommonStyles} from "../../../styles/CommonStyles";
import XImage from "../../../widgets/XImage";

class TransferAccounts extends Component {

    constructor(props) {
        super(props);
        this.type = this.props.navigation.state.params.type;
        this.assetName = getAssetTypeName(this.type);
        this.content = `您还没输入${this.assetName}...`;

        this.availableScore = this.props.assetInfo[this.type].available;
        switch (this.type) {
            case CONSUMER_COUPON_ACCOUNT:
                this.url = 'user/consumerCouponTransfer';
                break;
            case  JADE_INTEGRAL_ACCOUNT:
                this.url = 'user/jadeIntegralTransfer';
                this.poundageUrl = 'user/jadeIntegralTransferPaymentList';
                break;
            case PLATINUM_INTEGRAL_ACCOUNT:
                this.url = 'user/platinumIntegralTransfer';
                break;
            case K_INTEGRAL_ACCOUNT:
                this.url = 'user/KIntegralTransfer';
                break;
            case BALANCE_ACCOUNT:
                this.url = 'user/balanceTransfer';
                this.poundageUrl = 'user/balanceTransferPaymentList';
                break;

        }

        this.state = {
            isFindUser: null,
            account: '',
            loginName: null,
            realName: null,
            memberId: '',
            phone: '',
            consumer: '',
            remark: '',
            title: `${this.assetName}转账`,
            placeholderText: `填写您要转账的${this.assetName}`,
            // commitText: `${this.assetName}转账`,
            tipText: `${this.assetName}:`,
            inputLength: 0,
            maxInputLength: 10,
            payType: {},
            payTypeList: []
        };
    }

    componentDidMount() {
        if (this.type === JADE_INTEGRAL_ACCOUNT || this.type === BALANCE_ACCOUNT) {
            post(this.poundageUrl)
                .then((response) => {
                    if (isSuccess(response)) {
                        this.setState({payTypeList: response.result, payType: response.result[0]})
                    } else {
                        showToastShort(response.message)
                    }
                })
        }
    }

    transfer() {
        if (!this._checkInputAccount()) return;
        if (this.state.account === this.props.userInfo.phone || this.state.account.toUpperCase() === this.props.userInfo.name.toUpperCase()) {
            showToastShort("您不能给自己转账...")
        } else if (this.state.consumer === '') {
            showToastShort(this.content);
        } else if (!checkInputIsFloatNumber(this.state.consumer)) {
            showToastShort('您输入的转账金额有误');
            this.setState({consumer: ''})
        } else if (Number(this.state.consumer) > Number(this.availableScore)) {
            showToastShort('您输入的可用金额不足...');
        } else {
            if (isTrue(this.props.otherConfig.isSetPayPassword)) {
                this.refs.PayPasswordView.show()
            } else {
                this.props.dispatch(goto('ResetPaymentPsw'))
            }
        }
    }

    _checkInputAccount(showToast = true) {
        if (this.state.account === '') {
            if (showToast) showToastShort("您还没有输入到账账号...");
            return false;
        } else if (this.state.account.length < 2) {
            if (showToast) showToastShort("您输入的到账账号长度不能小于2个字符...");
            return false;
        } else if (checkInputLegal(this.state.account)) {
            if (showToast) showToastShort("您输入的到账账号不合法...");
            return false;
        }
        return true;
    }

    pay(obj) {
        let requestObj = {
            'token': this.props.token,
            'inMemberInfo': this.type === BALANCE_ACCOUNT ? null : this.state.loginName,
            'memberId': this.type === BALANCE_ACCOUNT ? this.state.memberId : null,
            'amount': this.state.consumer,
            'comment': this.state.remark,
            'payPassword': obj,
            'feeAccountType': this.state.payType !== undefined ? this.state.payType.accountType : ''
        };
        post(this.url, requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort("转账成功...");
                    DeviceEventEmitter.emit('TRANSACTION_HISTORY_LIST_UPDATE');
                    this.props.dispatch(goBack());
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
        });
    }

    _findUserName(showToast = false) {
        if (this.state.isFindUser) return;
        if (!this._checkInputAccount(showToast)) return;
        post('user/getRecommend', {recommend: this.state.account}, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let {name, memberId, phone, loginName} = responseData.result;
                    this.setState({
                        loginName: loginName,
                        realName: name,
                        memberId: memberId,
                        phone: phone,
                        isFindUser: true
                    });
                } else {
                    this.setState({isFindUser: false});
                }
            })
    }

    _renderUserInfo() {
        if (this.state.isFindUser) {
            return <View>
                <View style={CommonStyles.vline}/>
                <View style={styles.checkUserInfoLayout}>
                    <Text style={styles.userInfo} numberOfLines={1}>会员ID: {this.state.memberId}</Text>
                    <Text style={styles.userInfo}
                          numberOfLines={2}>真实姓名: {(this.state.realName === null || this.state.realName === '') ?
                        <Text style={styles.userInfoNoFount}>该账号未实名认证,请确认到账账户无误</Text> :
                        <Text>{this.state.realName}<Text style={styles.userInfoReal}>(已实名认证)</Text></Text>}</Text>
                    <Text style={styles.userInfo} numberOfLines={1}>手机号码: {hidePhone(this.state.phone)}</Text>
                </View>
            </View>
        } else if (this.state.isFindUser === false) {
            return <View>
                <View style={CommonStyles.vline}/>
                <View style={styles.checkUserInfoLayout}>
                    <Text style={[styles.userInfo, {color: 'red'}]} numberOfLines={1}>未找到对应用户</Text>
                </View>
            </View>
        }

    }

    render() {
        let jadeView = this.type === JADE_INTEGRAL_ACCOUNT || this.type === BALANCE_ACCOUNT ? (this.state.payTypeList.length > 0 ? (
            <View>
                <View style={CommonStyles.vline}/>
                <View style={[styles.itemContain, {flexDirection: 'row'}]}>
                    <Text style={styles.tipText}>手续费:</Text>
                    <View style={{flex: 1}}>
                        <Text style={{
                            fontSize: 16,
                            textAlignVertical: 'center',
                            marginLeft: 10,
                            color: titleTextColor
                        }}>{Number(this.state.consumer) > 0 ? Number(this.state.consumer * this.state.payType.value) : '0'}</Text>
                    </View>
                </View>
                <View style={CommonStyles.vline}/>
                <View style={[styles.itemContain, {flexDirection: 'row', marginVertical: 10}]}>
                    <Text style={styles.tipText}>支付方式:</Text>
                    <View ref={'dropDown'} style={styles.textCon}>
                        <Text numberOfLines={1}
                              style={{
                                  fontSize: 16,
                                  marginLeft: 10,
                                  color: this.state.payType === '' ? placeholderTextColor : titleTextColor
                              }}>
                            {this.state.payType === undefined ? '选择支付类型' : this.state.payType.accountDesc}
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.dropDown}
                        onPress={() => {
                            this.refs.dropDown.measureInWindow((x, y, width, height) => {
                                if (this.state.payTypeList.length === 0) showToastShort('暂无支付类型选择');
                                else this.refs.DropDownDialog.show(x, y, width + 40, height + 10);
                            });
                        }}>
                        <XImage style={{height: 13, width: 24, resizeMode: 'center'}} source={ic_n_drop_down}/>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                </View>
            </View>) : null) : null;
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={this.state.title} hideRight={true}/>
                <View style={styles.container}>
                    <View style={[styles.itemContain]}>
                        <Text style={styles.tipText}>到账账号:</Text>
                        <TextInput
                            style={[styles.inputLayout, styles.inputText]}
                            maxLength={16}
                            placeholder="可填会员ID,用户昵称和手机号码"
                            placeholderTextColor={placeholderTextColor}
                            underlineColorAndroid={'transparent'}
                            value={this.state.account}
                            onChangeText={(account) => {
                                this.setState({account, isFindUser: null})
                            }}
                            onBlur={() => {
                                let input = this.state.account;
                                if (input.length >= 2 && input.length <= 16) {
                                    this._findUserName();
                                }
                            }}
                        />
                        <TouchableOpacity activeOpacity={0.7} style={styles.checkBtn}
                                          onPress={() => this._findUserName(true)}>
                            <Text style={{color: 'white', fontSize: 12}}>查询</Text>
                        </TouchableOpacity>
                    </View>
                    {this._renderUserInfo()}
                    <View style={CommonStyles.vline}/>
                    {/*<View style={[styles.itemContain]}>*/}
                    <Text style={styles.inputMoneyText}>转账金额:</Text>
                    <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>

                        {this.state.consumer.length > 0 ? null : <Text style={[styles.inputMoney, {
                            color: placeholderTextColor,
                            height: 28,
                            fontSize: 24,
                        }]}>{this.state.placeholderText}</Text>}
                        <TextInput
                            style={[styles.inputMoney, {fontSize: 45, position: 'absolute',}]}
                            keyboardType={"numeric"}
                            underlineColorAndroid={'transparent'}
                            value={this.state.consumer}
                            onChangeText={(text) => this.setState({consumer: checkInputMoney(text)})}
                        />
                    </View>
                    {jadeView}
                    {/*</View>*/}
                    <View style={CommonStyles.vline}/>
                    <View style={styles.itemContain}>
                        <Text style={styles.tipText}>备注:</Text>
                        <View style={[styles.inputLayout, {flexDirection: 'row', justifyContent: 'space-between'}]}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="非必填选项"
                                placeholderTextColor={placeholderTextColor}
                                underlineColorAndroid={'transparent'}
                                maxLength={this.state.maxInputLength}
                                onChangeText={(remark) => this.setState({
                                    remark,
                                    inputLength: remark.length,
                                })}
                            />
                            <Text style={{
                                alignSelf: 'center',
                                paddingRight: 10,
                                color: placeholderTextColor
                            }}>{this.state.inputLength + '/' + this.state.maxInputLength}</Text>
                        </View>
                    </View>
                    <View style={CommonStyles.vline}/>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={styles.transfer} onPress={() => this.transfer()}>
                    <Text style={{color: 'white', fontSize: 17}}>确认转账</Text>
                </TouchableOpacity>
                <PayPasswordView
                    ref={'PayPasswordView'}
                    pay={(password) => this.pay(password)}
                />
                <DropDownDialog ref={'DropDownDialog'} selectValue={(payType) => this.setState({payType})}
                                data={this.state.payTypeList}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    checkBtn: {
        backgroundColor: mainColor,
        height: 25,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2.5,
        marginRight: 10,
    },
    container: {
        backgroundColor: 'white',
        marginTop: 20,
        alignItems: 'center',
    },
    checkUserInfoLayout: {
        width: width,
        paddingLeft: 20,
        paddingBottom: 5,
    },
    itemContain: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    tipText: {
        fontSize: 15,
        width: width * 0.22,
        textAlign: 'right',
        color: titleTextColor,
    },
    inputMoneyText: {
        width: width * 0.22,
        alignSelf: 'flex-start',
        fontSize: 15,
        color: titleTextColor,
        marginTop: 15,
        textAlign: 'right',
    },
    inputMoney: {
        height: 100,
        width: width * 0.8,
        fontSize: 30,
        padding: 0,
        paddingLeft: 5,

    },
    inputLayout: {
        padding: 0,
        height: 50,
        marginLeft: 10,
        marginRight: 15,
        flex: 1,
    },
    inputText: {
        fontSize: 14,
        flex: 1,
        padding: 0,
        paddingLeft: 5,
    },
    userInfo: {
        marginLeft: 10,
        marginRight: 15,
        fontSize: 12,
        marginTop: 5,
        color: titleTextColor,
    },
    userInfoNoFount: {
        fontSize: 12,
        color: 'red',
    },
    userInfoReal: {
        fontSize: 12,
        color: 'green',
    },
    transfer: {
        backgroundColor: mainColor,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',

        width: width - 100,
        borderRadius: 5,
        marginTop: 30,
        marginHorizontal: 50,
    },
    dropDown: {
        backgroundColor: mainColor,
        height: 40,
        width: 40,
        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textCon: {
        flex: 1,
        height: 40,
        backgroundColor: mainBackgroundColor,
        borderRadius: 6,
        borderColor: placeholderTextColor,
        borderWidth: 0.5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        justifyContent: 'center',
        marginLeft: 10,
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
        userInfo: state.userInfoStore.userInfo,
        assetInfo: state.userInfoStore.assetInfo
    }
};

export default connect(selector)(TransferAccounts)