import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    DeviceEventEmitter
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
import {showToastShort} from '../../../common/CommonToast';
import {goBack, goto} from '../../../reducers/RouterReducer';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import PayPasswordView from '../../../widgets/PayPasswordView';
import {checkInputMoney} from "../../../common/StringUtil";
import {isTrue} from "../../../common/AppUtil";
import {BALANCE_ACCOUNT, getAssetTypeName, PLATINUM_INTEGRAL_ACCOUNT} from "../../../constraint/AssetsType";

class PlatinumRecharge extends Component {

    constructor(props) {
        super(props);
        this.state = {
            money: '',
        }
    }

    recharge() {
        if (this.state.money === '') {
            showToastShort(`您还没有输入充值的${getAssetTypeName(PLATINUM_INTEGRAL_ACCOUNT)}...`)
        } else if (Number(this.state.money) < 0.01) {
            showToastShort(`充值${getAssetTypeName(PLATINUM_INTEGRAL_ACCOUNT)}最少0.01元,请重新输入...`)
        } else if (Number(this.state.money) > Number(this.props.assetInfo.BALANCE_ACCOUNT.available)){
            showToastShort(`您的可用${getAssetTypeName(BALANCE_ACCOUNT)}不足,请重新输入...`)
        } else {
            if (!isTrue(this.props.otherConfig.isSetPayPassword)) {
                this.props.dispatch(goto('ResetPaymentPsw'))
            } else {
                this.refs.PayPasswordView.show()
            }
        }
    }

    pay(obj) {
        let amount = Number(this.state.money);
        amount = amount ? (!isNaN(amount) ? amount.toFixed(2) : amount) : '';
        let requestObj = {
            'token': this.props.token,
            'amount': amount.toString(),
            'payPassword': obj
        };
        post("user/platinumIntegralRecharge", requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort("充值成功...");
                    DeviceEventEmitter.emit('TRANSACTION_HISTORY_LIST_UPDATE');
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
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'充值白金积分'}/>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', marginTop: 30, marginLeft: 30}}>
                        <Text style={{color: titleTextColor, fontSize: 16}}>充值白金积分金额</Text>
                    </View>
                    <View style={{marginLeft: 30}}>
                        <View style={{flexDirection:'row',paddingVertical:30,}}>
                            <Text style={styles.symbol}>￥</Text>
                            <TextInput
                                keyboardType={"numeric"}
                                style={styles.inputLayout}
                                underlineColorAndroid={'transparent'}
                                value={this.state.money}
                                onChangeText={(text) => this.setState({money: checkInputMoney(text)})}
                            />
                        </View>
                        <View style={styles.inputLine}/>
                        <View style={{flexDirection: 'row', marginTop: 15}}>
                            <Text style={{
                                color: content2TextColor,
                                fontSize: 15
                            }}>可用余额: {Number(this.props.assetInfo.BALANCE_ACCOUNT.available).toFixed(2)}</Text>
                        </View>
                        <Text style={{color: placeholderTextColor, fontSize: 12, marginTop: 5}}>注: 充值白金积分只能用余额充值</Text>
                    </View>
                    <TouchableOpacity style={styles.recharge} onPress={() => this.recharge()}>
                        <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>确 认 充 值</Text>
                    </TouchableOpacity>
                </View>
                <PayPasswordView
                    ref={'PayPasswordView'}
                    pay={(password) => this.pay(password)}
                />
            </View>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
        assetInfo: state.userInfoStore.assetInfo
    }
};

export default connect(selector)(PlatinumRecharge)