import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput, DeviceEventEmitter,
    Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import XImage from '../../../widgets/XImage';
import ChooseBankCard from '../../../widgets/ChooseBankCard';

import {
    ic_right_arrows
} from "../../../constraint/Image";
import {
    mainBackgroundColor,
    titleTextColor,
    content2TextColor,
    contentTextColor,
    placeholderTextColor
} from '../../../constraint/Colors';
import {BALANCE_ACCOUNT} from "../../../constraint/AssetsType";
import styles from '../../../styles/recharge_style';
import {goBack, goto} from "../../../reducers/RouterReducer";
import {showToastShort} from '../../../common/CommonToast';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import PayPasswordView from '../../../widgets/PayPasswordView';
import {checkInputPassword, formatMoney} from "../../../common/StringUtil";
import {isTrue} from "../../../common/AppUtil";
import DropDownDialog from "../../home/module/DropDownDialog";
import {ic_n_drop_down} from "../../../constraint/Image";

class WithdrawalsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            money: '',
            withdrawalsInfo: {},
            bankItem: {},
            minWithdrawAmount: 0,//最小提现金额
            maxWithdrawAmount: 0,//最大提现金额
            withdrawMultiple: 1,//提现基本单位
            payType: undefined,
            payTypeList: [],
            minPoundage: '',
            poundage: ''
        };
        this.assetType = this.props.navigation.state.params.assetType;
    }

    componentDidMount() {
        if (this.props.isBinding) {
            this.prepaidWithdrawPrepare();
        } else {
            this.prepaidWithdrawPrepare();
        }
        this.listener = DeviceEventEmitter.addListener('ChooseBankCard', (item) => {
            this.setState({bankItem: item})
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    prepaidWithdrawPrepare() {
        let prepaidUrl = 'user/prepaidWithdrawPrepare';
        let companyUrl = 'user/companyWithdrawPrepare';
        post(this.assetType === 'BALANCE_ACCOUNT' ? prepaidUrl : companyUrl, {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        withdrawalsInfo: responseData.result,
                        bankItem: responseData.result.bankCardList[0],
                        minWithdrawAmount: responseData.result.minWithdrawAmount,
                        withdrawMultiple: responseData.result.withdrawMultiple,
                        maxWithdrawAmount: responseData.result.maxWithdrawAmount,
                        payTypeList: responseData.result.feeAccountTypeList,
                        payType: responseData.result.feeAccountTypeList[0],
                        minPoundage: responseData.result.minPoundage,
                    })
                } else {
                    showToastShort(getRequestFailTip(responseData))
                }
            }).catch(() => {
            showToastShort(getRequestFailTip())
        })
    }

    withdrawals() {
        let {money, withdrawalsInfo, maxWithdrawAmount, minWithdrawAmount, withdrawMultiple} = this.state;
        money = parseInt(money);
        if (money === '') {
            showToastShort("您还没有输入提现金额...")
        } else if (money === 0) {
            showToastShort("您输入的提现金额不能为0")
        } else if (money % withdrawMultiple !== 0) {
            showToastShort(`您输入的提现金额必须是${withdrawMultiple}的倍数...`)
        } else if (money < minWithdrawAmount) {
            showToastShort(`您输入的提现金额必须大于最小提现金额...`)
        } else if (money > maxWithdrawAmount) {
            showToastShort(`您输入的提现金额超过最大限额${maxWithdrawAmount}`)
        } else if (money > withdrawalsInfo.availableBalance) {
            showToastShort("您输入的提现金额大于您的可用余额...")
        } else if (withdrawalsInfo.mayWithdrawAmount < money) {
            showToastShort("您的可提现金额不足")
        } else {
            if (isTrue(this.props.otherConfig.isSetPayPassword)) {
                this.refs.PayPasswordView.show();
            } else {
                this.props.dispatch(goto('ResetPaymentPsw'))
            }
        }
    }

    pay(obj) {
        let requestObj = {
            'token': this.props.token,
            'bankCardId': this.state.bankItem.bankCardId,
            'amount': this.state.money,
            'paymentPassword': obj,
            'feeAccountType': this.state.payType !== undefined ? this.state.payType.accountType : ''
        };
        let prepaidUrl = 'user/applyPrepaidWithdraw';
        let companyUrl = 'user/applyCompanyWithdraw';

        post(this.assetType === 'BALANCE_ACCOUNT' ? prepaidUrl : companyUrl, requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort(responseData.message);
                    this.props.dispatch(goBack());
                } else {
                    this.errMsg(responseData);
                }
            }).catch((e) => {
            this.errMsg();
        })
    }

    errMsg(responseData) {
        if (responseData) {
            showToastShort(getRequestFailTip(responseData));
        }
        else {
            showToastShort(getRequestFailTip());
        }
    }

    replaceStr(str) {
        if (str !== '' && str !== undefined) {
            let newStr = str.replace(str.substring(4, str.length - 4), '****');
            return newStr;
        }
        return ''
    }

    allWithdraw() {
        let {withdrawalsInfo, mayWithdrawAmount, maxWithdrawAmount, minWithdrawAmount, withdrawMultiple} = this.state;
        if (withdrawalsInfo.mayWithdrawAmount > maxWithdrawAmount) {
            this.setState({money: maxWithdrawAmount})
        } else if (withdrawalsInfo.mayWithdrawAmount > minWithdrawAmount) {
            this.setState({money: (parseInt(withdrawalsInfo.mayWithdrawAmount / withdrawMultiple) * withdrawMultiple).toString()})
        } else {
            // this.setState({money: withdrawalsInfo.availableBalance.toString()})
            showToastShort('您的余额不足以提现');
        }
    }

    _getBankHeader(bankCardList, bankView) {
        if (bankCardList) {
            return <TouchableOpacity activeOpacity={0.7} onPress={() => {
                this.refs.ChooseBankCard.show()
            }}>
                <View style={{marginTop: 30, marginLeft: 30, flexDirection: 'row', alignItems: 'center'}}>
                    {bankView}
                    <View style={{flex: 1}}/>
                    <XImage source={ic_right_arrows} style={[styles.rightArrowsStyle]}/>
                </View>
            </TouchableOpacity>
        } else {
            return <View style={{marginTop: 30, marginLeft: 30, flexDirection: 'row', alignItems: 'center'}}>
                {bankView}
            </View>
        }
    }

    changeMoney(text) {
        this.setState({money: checkInputPassword(text)});
        let poundage = Number(this.state.minPoundage);
        if (this.state.payType) {
            if (poundage < Number(text * this.state.payType.value)) {
                this.setState({poundage: Number(text * this.state.payType.value)});
            } else {
                this.setState({poundage: poundage})
            }
        }
    }

    render() {
        let {money, withdrawalsInfo, bankItem, maxWithdrawAmount, minWithdrawAmount, withdrawMultiple, payTypeList} = this.state;
        let bankCardList = withdrawalsInfo.bankCardList;
        let bankView = (bankCardList === undefined || bankCardList.length === 0) ?
            (<Text style={{color: titleTextColor, fontSize: 16, alignItems: 'center'}}>选择银行卡</Text>) :
            (  <View>
                <Text style={{color: titleTextColor, fontSize: 16}}>到账银行卡</Text>
                <View style={{marginTop: 5}}>
                    <Text style={{color: '#65BCFE', fontSize: 14}}>
                        {bankItem.bankName + ' (' + this.replaceStr(bankItem.bankCardNo) + ')'}
                    </Text>
                    {/*<Text*/}
                    {/*style={{*/}
                    {/*color: placeholderTextColor,*/}
                    {/*fontSize: 12,*/}
                    {/*marginTop: 5*/}
                    {/*}}>{'提现手续费' + withdrawalsInfo.withdrawPoundageRate * 100 + '%'}</Text>*/}
                </View>
            </View>);
        let rateView = payTypeList.length > 0 ? (
            <View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{color: titleTextColor, fontSize: 16}}>手续费:</Text>
                    <Text style={{
                        fontSize: 16, marginLeft: 10, color: titleTextColor
                    }}>{this.state.poundage !== '' ? this.state.poundage : this.state.minPoundage}</Text>
                </View>
                <View style={{flexDirection: 'row', marginVertical: 15, alignItems: 'center'}}>
                    <Text
                        style={{color: titleTextColor, fontSize: 16, textAlignVertical: 'center'}}>支付方式:</Text>
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
                                if (payTypeList.length === 0) showToastShort('暂无支付类型选择');
                                else this.refs.DropDownDialog.show(x, y, width + 40, height + 10);
                            });
                        }}>
                        <XImage style={{height: 13, width: 24, resizeMode: 'center'}} source={ic_n_drop_down}/>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                </View></View>) : null;
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'提  现'} hideRight={false}
                          customRightView={() => (<Text style={{color: 'white', fontSize: 15}}>提现记录</Text>)}
                          onRightViewClick={() => this.props.dispatch(goto('WithdrawalsRecord', this.assetType))}/>
                <View style={styles.container}>
                    {this._getBankHeader(bankCardList, bankView)}
                    <View style={styles.line}/>
                    <View style={{marginLeft: 30}}>
                        <Text style={{color: titleTextColor, fontSize: 16}}>提现金额</Text>
                        <View style={{height: 100, alignItems: 'center', flexDirection: 'row', paddingBottom: 5}}>
                            <Text style={styles.symbol}>￥</Text>
                            <View style={{flex: 1, height: 80, justifyContent: 'center'}}>
                                {this.state.money.length > 0 ? null : <Text style={{
                                    color: placeholderTextColor,
                                    fontSize: 28,
                                }}>请输入提现金额</Text>}
                                <TextInput
                                    keyboardType={"numeric"}
                                    style={{
                                        width: Dimensions.get('window').width * 0.72,
                                        position: 'absolute',
                                        marginRight: 30,
                                        fontSize: 45
                                    }}
                                    defaultValue={money.toString()}
                                    underlineColorAndroid={'transparent'}
                                    value={money.toString()}
                                    onChangeText={(text) => this.changeMoney(text)}
                                />
                            </View>
                        </View>
                        <View style={styles.inputLine}/>
                        <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 15}}>
                            <Text style={{color: content2TextColor, fontSize: 15}}>可提现金额:</Text>
                            <Text style={{
                                color: contentTextColor, fontSize: 15, marginLeft: 5
                            }}>{formatMoney(withdrawalsInfo.mayWithdrawAmount, false)} </Text>
                            <TouchableOpacity
                                onPress={() => this.allWithdraw()}>
                                <Text style={{color: '#65BCFE', fontSize: 15, marginLeft: 15}}>全部提现</Text>
                            </TouchableOpacity>
                        </View>
                        {rateView}
                        <Text style={{
                            color: placeholderTextColor,
                            fontSize: 15,
                            marginRight: 30
                        }}>注:提现金额大于或等于{minWithdrawAmount}元,提现金额以{withdrawMultiple}元为基础单位</Text>
                    </View>
                    <TouchableOpacity style={styles.recharge} onPress={() => this.withdrawals()}>
                        <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>确认提现</Text>
                    </TouchableOpacity>
                </View>
                <PayPasswordView
                    ref={'PayPasswordView'}
                    pay={(password) => this.pay(password)}/>
                <ChooseBankCard data={bankCardList} ref={'ChooseBankCard'} dispatch={this.props.dispatch}/>
                <DropDownDialog ref={'DropDownDialog'} selectValue={(payType) => this.setState({payType})}
                                data={payTypeList}/>
            </View>
        )
    }
}

selector = (state) => {
    return {
        otherConfig: state.loginStore.otherConfig,
        token: state.loginStore.token,
    }
};

export default connect(selector)(WithdrawalsComponent)

