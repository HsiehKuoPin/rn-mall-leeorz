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
import {checkInputMoney, formatMoney} from "../../../common/StringUtil";
import {isTrue} from "../../../common/AppUtil";
import {getAssetTypeName, JADE_INTEGRAL_ACCOUNT} from "../../../constraint/AssetsType";

const USE_JADE_INTEGRAL_ACCOUNT = 20000;
class EntrepreneurshipCouponRecharge extends Component {

    constructor(props) {
        super(props);
        this.state = {
            money: '100000',
        }

        this.assetType = this.props.navigation.state.params.assetType;
        this.assetName = getAssetTypeName(this.assetType);
    }

    recharge() {
         if(USE_JADE_INTEGRAL_ACCOUNT > Number(this.props.assetInfo.JADE_INTEGRAL_ACCOUNT.available)){
            showToastShort(`您的可用${getAssetTypeName(JADE_INTEGRAL_ACCOUNT)}不足,请重新输入...`)
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
        let requestObj = {
            'token': this.props.token,
            'payPassword': obj
        };
        post("user/entrepreneurshipCouponRecharge", requestObj, true)
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
                <TitleBar title={'申请创业补贴'}/>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', marginTop: 30, marginLeft: 30}}>
                        <Text style={{color: titleTextColor, fontSize: 16}}>可申请额度</Text>
                    </View>
                    <View style={{marginLeft: 30}}>
                        <View style={{flexDirection:'row',paddingVertical:30,}}>
                            <Text style={styles.symbol}>￥</Text>
                            <TextInput
                                editable={false}
                                keyboardType={"numeric"}
                                style={styles.inputLayout}
                                underlineColorAndroid={'transparent'}
                                value={formatMoney(this.state.money,false)}
                                onChangeText={(text) => this.setState({money: checkInputMoney(text)})}
                            />
                        </View>
                        <View style={styles.inputLine}/>
                        <View style={{ marginTop: 15}}>
                            <Text style={{
                                color: content2TextColor,
                                fontSize: 15
                            }}>使用{getAssetTypeName(JADE_INTEGRAL_ACCOUNT)}:{formatMoney(USE_JADE_INTEGRAL_ACCOUNT,false)}</Text>
                            <Text style={{
                                color: content2TextColor,
                                fontSize: 15,
                                marginTop:5,
                            }}>可用{getAssetTypeName(JADE_INTEGRAL_ACCOUNT)}: {formatMoney(this.props.assetInfo.JADE_INTEGRAL_ACCOUNT.available,false)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.recharge} onPress={() => this.recharge()}>
                        <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>立刻申请</Text>
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

export default connect(selector)(EntrepreneurshipCouponRecharge)