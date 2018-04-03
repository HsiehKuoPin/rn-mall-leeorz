import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    DeviceEventEmitter, Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import XImage from '../../../widgets/XImage';
import {
    mainBackgroundColor, titleTextColor,
    content2TextColor, contentTextColor,
    placeholderTextColor, mainColor
} from '../../../constraint/Colors';
import styles from '../../../styles/recharge_style';
import {showToastShort} from '../../../common/CommonToast';
import {ic_right_arrows} from "../../../constraint/Image";
import ChooseBankCard from '../../../widgets/ChooseBankCard';

const {width} = Dimensions.get('window');
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest'
import RechargeSmsDialog from '../../../widgets/RechargeSmsDialog'
import {goBack, goto} from "../../../reducers/RouterReducer";
import {formatMoney} from "../../../common/StringUtil";

const OPEN_CARD = 'OPEN_CARD';
const RECHARGE_CREATE_ORDER = 'RECHARGE_CREATE_ORDER';
class RechargeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectIndex: null,
            withdrawAmountList: [],
            bankCardList: [],
            bankItem: {},
            memberRechargeId: ''
        }
    }

    componentDidMount() {
        if (this.props.isBinding) {
            this.loadRecharge();
        } else {
            this.loadRecharge();
        }
        this.listener = DeviceEventEmitter.addListener('ChooseBankCard', (item) => {
            this.setState({bankItem: item})
        });
        this.codeListener = DeviceEventEmitter.addListener('code', (code) => {
            if (code) {
                this.rechargeOrder(code);
            }
        });
    }

    componentWillUnmount() {
        this.listener.remove();
        this.codeListener.remove();
    }

    loadRecharge() {
        post('user/allScoreRechargePrepare', {token: this.props.token},true)
            .then((responseData) => {

                if (isSuccess(responseData)) {
                    this.setState({
                        withdrawAmountList: responseData.result.withdrawAmountList,
                        bankCardList: responseData.result.bankCardList,
                        bankItem: responseData.result.bankCardList[0]
                    })
                } else {
                    this.errMsg(responseData)
                }
            }).catch((e) => {
            this.errMsg();
        })
    };

    errMsg(responseData) {
        if (responseData) {
            showToastShort(getRequestFailTip(responseData));
        }
        else {
            showToastShort(getRequestFailTip());
        }
    }

    recharge() {
        if (this.state.bankCardList.length === 0) {
            showToastShort('您还没有选择需要充值的银行卡...')
        } else if (this.state.selectIndex === null) {
            showToastShort('您还没有选择充值金额...')
        } else {
            this.createRechargeOrder();
        }
    }

    createRechargeOrder() {
        let requestObj = {
            token: this.props.token,
            bankCardId: this.state.bankItem.bankCardId,
            amount: this.state.withdrawAmountList[this.state.selectIndex]
        };
        post('user/allScoreRechargeCreateOrder', requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    if(responseData.result.type === OPEN_CARD){
                        this.props.dispatch(goto('CommonWebView',{html:responseData.result.html}))
                    }else if(responseData.result.type === RECHARGE_CREATE_ORDER){
                        this.setState({memberRechargeId: responseData.result.memberRechargeId});
                        this.refs.RechargeSmsDialog.show();
                    }
                } else {
                    showToastShort(getRequestFailTip(responseData))
                }
            })
    }

    rechargeOrder(code) {
        let requestObj = {
            token: this.props.token,
            memberRechargeId: this.state.memberRechargeId,
            smsCode: code
        };
        post('user/allScoreRechargeByOrderId', requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort(responseData.message);
                    this.props.dispatch(goBack());
                } else {
                    showToastShort(getRequestFailTip(responseData))
                }
            })
    }

    _keyExtractor = (item, index) => index;

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.itemContain, {borderColor: (this.state.selectIndex === index ? mainColor : content2TextColor)}]}
                onPress={() => {
                    if (this.state.selectIndex !== index) {
                        this.setState({selectIndex: index})
                    }
                }}>
                <Text style={{
                    fontSize: 17,
                    color: (this.state.selectIndex === index ? mainColor : contentTextColor)
                }}>{item}<Text style={{fontSize:12}}>元</Text></Text>
            </TouchableOpacity>
        )
    };

    replaceStr(str) {
        if (str !== undefined) {
            let newStr = str.replace(str.substring(4, str.length - 4), '**** ****');
            return newStr;
        }
        return '';
    }

    render() {
        let bankView = this.state.bankCardList.length === 0 ?
            (<Text style={{color: titleTextColor, fontSize: 16, alignItems: 'center'}}>选择银行卡</Text>) :
            ( <View style={{marginLeft: 0,}}>
                <Text style={{color: '#65BCFE', fontSize: 16}}>
                    {this.state.bankItem.bankName}</Text>
                <Text style={{color: '#65BCFE', fontSize: 16}}>
                    {this.replaceStr(this.state.bankItem.bankCardNo)}</Text>
                <Text style={{color: placeholderTextColor, fontSize: 16, marginTop: 10}}>支付银行卡</Text>
            </View>);

        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'充  值'} hideRight={true}/>
                <View style={styles.container}>
                    <TouchableOpacity activeOpacity={0.7} style={{
                        flexDirection: 'row', marginTop: 30,
                        marginLeft: 20, alignItems: 'center'
                    }}
                                      onPress={() => {
                                          this.state.bankCardList.length === 0 ? this.props.dispatch(goto('BindingBankCard')) : this.refs.ChooseBankCard.show()
                                      }}>
                        {bankView}
                        <View style={{flex: 1}}/>
                        <XImage source={ic_right_arrows} style={[styles.rightArrowsStyle]}/>
                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: placeholderTextColor, width: width - 40, height: 0.5, marginTop: 20,
                        marginBottom: 20
                    }}/>
                    <View style={{marginLeft: 20}}>
                        <Text style={{color: titleTextColor, fontSize: 16,marginBottom:5,}}>充值金额</Text>
                        <FlatList
                            data={this.state.withdrawAmountList}
                            numColumns={3}
                            extraData={this.state.selectIndex}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}/>
                    </View>
                    <TouchableOpacity style={[styles.recharge,
                        // {backgroundColor:'gray'}
                        ]} activeOpacity={0.7} onPress={() => {
                        // showToastShort('敬请期待');
                        this.recharge()
                    }}>
                        <Text style={{color: 'white', fontSize: 17, alignSelf: 'center'}}>确认充值</Text>
                    </TouchableOpacity>
                </View>
                <ChooseBankCard data={this.state.bankCardList} ref={'ChooseBankCard'} dispatch={this.props.dispatch}/>
                <RechargeSmsDialog
                    ref={'RechargeSmsDialog'} data={this.state.bankItem} memberRechargeId={this.state.memberRechargeId}
                    token={this.props.token}/>
            </View>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(RechargeComponent)