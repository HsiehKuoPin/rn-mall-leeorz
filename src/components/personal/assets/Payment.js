import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {
    mainBackgroundColor,
    titleTextColor,
    content2TextColor,
    contentTextColor,
    placeholderTextColor
} from '../../../constraint/Colors';
import styles from '../../../styles/recharge_style';
import {goBack, goto} from "../../../reducers/RouterReducer";
import {showToastShort} from '../../../common/CommonToast';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import PayPasswordView from '../../../widgets/PayPasswordView';
import {isTrue} from "../../../common/AppUtil";
import {formatMoney, hidePhone} from "../../../common/StringUtil";
import TipDialog from "../../../widgets/dialog/TipDialog";
import DropDownDialog from "../../home/module/DropDownDialog";
import {ic_n_drop_down} from "../../../constraint/Image";
import XImage from '../../../widgets/XImage';

let money;

class Payment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            money: '',
            remark: '',
            userName: '',
            memberId: '',
            inputLength: 0,
            maxInputLength: 10,
            payType: undefined,
            payTypeList: []
        }
    }

    componentDidMount() {
        if (this.props.navigation.state.params !== undefined) {
            // this.setState({
            //     userName: this.props.navigation.state.params.userName,
            //     memberId:this.props.navigation.state.params.memberId,
            // });
            let userName = this.props.navigation.state.params.userName;
            let memberId = this.props.navigation.state.params.memberId;

            money = Number(this.props.navigation.state.params.money);

            this._findUser(memberId);
        }
        post('user/balanceTransferPaymentList')
            .then((response) => {
                if (isSuccess(response)) {
                    this.setState({payTypeList: response.result, payType: response.result[0]})
                } else {
                    showToastShort(response.message)
                }
            })
    }

    _findUser(memberId) {
        post('user/getRecommend', {recommend: memberId}, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let {name, memberId, phone, loginName} = responseData.result;
                    let showName = name ? name : loginName;
                    this.setState({userName: showName, memberId: memberId, phone: phone});
                } else {
                    this.tipDialog.showDialog();
                }
            })
    }

    payment() {
        if (this.state.money === '' && money <= 0) {
            showToastShort("您还没有输入付款金额...")
        } else if (this.props.navigation.state.params.memberId === this.props.userInfo.memberId) {
            showToastShort("您不能转账给自己...")
        } else {
            if (!isTrue(this.props.otherConfig.isSetPayPassword)) {
                this.props.dispatch(goto('ResetPaymentPsw'))
            } else {
                this.refs.PayPasswordView.show();
            }
        }
    }

    pay(obj) {
        let requestObj = {
            'token': this.props.token,
            'memberId': this.props.navigation.state.params.memberId,
            'amount': money > 0 ? money.toString() : this.state.money,
            'comment': this.state.remark,
            'payPassword': obj,
            'feeAccountType': this.state.payType !== undefined ? this.state.payType.accountType : ''
        };
        post('user/balanceTransfer', requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort("付款成功...");
                    this.props.dispatch(goBack());
                } else {
                    this.errMsg(responseData);
                }
            }).catch((e) => {
            this.errMsg();
        });
    }

    errMsg(responseData) {
        if (responseData) {
            showToastShort(getRequestFailTip(responseData));
        }
        else {
            showToastShort(getRequestFailTip());
        }
    }

    render() {
        let rateView = this.state.payTypeList.length > 0 ? (<View>
            <View style={{flexDirection: 'row'}}>
                <Text style={{color: titleTextColor, fontSize: 16}}>手续费:</Text>
                <Text style={{
                    fontSize: 16, marginLeft: 10, color: titleTextColor
                }}>{money > 0 ? Number(money * this.state.payType.value) : Number(this.state.money) > 0 ? Number(this.state.money * this.state.payType.value) : '0'}</Text>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 15}}>
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
                            if (this.state.payTypeList.length === 0) showToastShort('暂无支付类型选择');
                            else this.refs.DropDownDialog.show(x, y, width + 40, height + 10);
                        });
                    }}>
                    <XImage style={{height: 13, width: 24, resizeMode: 'center'}} source={ic_n_drop_down}/>
                </TouchableOpacity>
                <View style={{flex: 1}}/>
            </View>
        </View>) : null;
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'付 款'}/>
                <View style={styles.paymentContain}>
                    <View style={{flexDirection: 'row', marginTop: 30, marginLeft: 30}}>
                        <Text style={{color: titleTextColor, fontSize: 16}}>收款人信息</Text>
                        <View>
                            <Text style={{
                                color: content2TextColor,
                                fontSize: 14,
                                marginLeft: 15
                            }}>真实姓名:{this.state.userName}</Text>
                            <Text style={{
                                color: content2TextColor,
                                fontSize: 14,
                                marginLeft: 15,
                                marginTop: 4,
                            }}>会员ID:{this.state.memberId}</Text>
                            <Text style={{
                                color: content2TextColor,
                                fontSize: 14,
                                marginLeft: 15,
                                marginTop: 4,
                            }}>手机号码:{hidePhone(this.state.phone)}</Text>
                        </View>
                    </View>
                    <View style={styles.line}/>
                    <View style={{marginLeft: 30}}>
                        <Text style={{color: titleTextColor, fontSize: 16}}>付款金额</Text>
                        <View style={{height: 120}}>
                            <Text style={styles.symbol}>￥</Text>
                            <TextInput
                                keyboardType={"numeric"}
                                style={styles.inputLayout}
                                editable={money === 0}
                                defaultValue={money > 0 ? money.toString() : ''}
                                underlineColorAndroid={'transparent'}
                                onChangeText={(money) => this.setState({money})}
                            />
                        </View>
                        <View style={styles.inputLine}/>
                        <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 15}}>
                            <Text style={{color: content2TextColor, fontSize: 15}}>可用余额: </Text>
                            <Text style={{
                                color: contentTextColor,
                                fontSize: 15
                            }}>{formatMoney(this.props.userInfo.accountBalance, false)}</Text>
                        </View>
                        {rateView}
                        <View style={{flexDirection: 'row', marginTop: 10, alignItems: 'center'}}>
                            <Text style={{color: titleTextColor, fontSize: 16}}>备注:</Text>
                            <View style={styles.inputLayout2}>
                                <TextInput
                                    style={{flex: 1, paddingLeft: 5}}
                                    placeholder="非必填选项"
                                    maxLength={this.state.maxInputLength}
                                    placeholderTextColor={placeholderTextColor}
                                    underlineColorAndroid={'transparent'}
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
                    </View>
                    <TouchableOpacity style={styles.recharge} onPress={() => this.payment()}>
                        <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>确认付款</Text>
                    </TouchableOpacity>
                </View>
                <PayPasswordView
                    ref={'PayPasswordView'}
                    pay={(password) => this.pay(password)}
                />
                <TipDialog
                    dialogMessage={'查询不到该会员ID!'}
                    ref={tipDialog => this.tipDialog = tipDialog}
                    hideCancelBtn={true}
                    onClickConfirm={() => {
                        this.props.dispatch(goBack())
                    }}/>
                <DropDownDialog ref={'DropDownDialog'} selectValue={(payType) => this.setState({payType})}
                                data={this.state.payTypeList}/>
            </View>
        )
    }
}

selector = (state) => {
    return {
        userInfo: state.userInfoStore.userInfo,
        otherConfig: state.loginStore.otherConfig,
        token: state.loginStore.token,
    }
};

export default connect(selector)(Payment)