import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import RequestErrorView from '../../../widgets/RequestErrorView';
import {post, getRequestFailTip,isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import SelectAddress from "../module/selectaddress/style1/SelectAddress";
import ProductList from "./module/ProductList"
import {ic_colored_tape} from "../../../constraint/Image";
import LoadingView from "../../../widgets/LoadingView";
import {goto} from "../../../reducers/RouterReducer";
import XImage from "../../../widgets/XImage";
import BaseComponent from "../../../widgets/BaseComponent";
import {
    contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor, priceColor,
} from "../../../constraint/Colors";
import {saveAddress, showLoadingDialog} from "../../../reducers/CacheReducer";
import {BALANCE_ACCOUNT, JADE_INTEGRAL_ACCOUNT} from "../../../constraint/AssetsType";
import {formatMoney} from "../../../common/StringUtil";

const width = Dimensions.get('window').width;

var nativeParams;
var comboId;

class ConfirmOrderView extends BaseComponent {

    constructor(props) {
        super(props);
        nativeParams = this.props.nativeParams;
        comboId = this.props.navigation.state.params;
        this.state = {
            isRequestError: false,
            isLoading: true,
            showTitle: '',
            showButton: '确定',
            data: null,
            addressData: null,
            quantity: 0
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.isResume(nextProps) && this.isUserTokenChange(nextProps)) {
            this._loadOrderDetail();

        }
    }

    componentDidMount() {
        this._loadOrderDetail();
    }

    _loadOrderDetail() {
        post('order/combo/createOrderDetail', {'comboId': comboId, token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.props.dispatch(saveAddress(responseData.result.address));
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                        addressData: responseData.result.address
                    })
                    let amount = 0;
                    this.state.data.comboSkuList.map(items => {
                        amount += Number(items.quantity);
                    });
                    this.setState({
                        quantity: amount
                    })
                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    showToastShort(getRequestFailTip(responseData));
                }
                else {
                    this._errorMsg(responseData.message);
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
        this.props.dispatch(showLoadingDialog(false))
    }

    render() {

        let {address} = this.props;
        if (this.state.addressData === null) {
            address = null;
        } else {
            if (!address) {
                address = this.state.addressData;
            }
        }

        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadOrderDetail();
            }}/>
        ) : (

            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View
                        style={{
                            shadowColor: 'gray',
                            shadowOffset: {height: 2, width: 2},
                            shadowRadius: 3,
                            shadowOpacity: 0.2,
                            elevation: 2,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 5,
                            margin: 10,
                        }}>
                        <SelectAddress data={address}/>
                        <ProductList data={this.state.data !== null ? this.state.data.comboSkuList : null}/>
                        {this.state.data !== null ? (this.state.data.combo !== null ? this.integralMessage() :
                            null) : null}
                        {this.confirmPayment()}
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: 60, width: 60,
                            marginLeft: width - 66,
                            elevation: 4,
                            marginTop: 6,
                        }}>
                        <XImage source={ic_colored_tape} style={{height: 60, width: 60}}/>
                    </View>
                </ScrollView>
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar title={'确认订单'}
                          hideRight={true}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }

    integralMessage() {
        return (
            <View>
                <View style={styles.lineStyle}/>
                <View style={{flexDirection: 'row', justifyContent: 'center', margin: 15, marginTop: 0}}>
                    <Text style={{color: contentTextColor}}>
                        合计：共 {this.state.quantity} 件
                    </Text>
                    <View style={{flex: 1}}/>
                    <Text style={{color: priceColor}}>
                        {formatMoney(this.state.data.combo.price)}
                    </Text>
                </View>
                <View style={styles.lineStyle}/>
                {
                    this.state.data.accounts === null ? <View/> : this.state.data.accounts.map((item, index) => {
                        return <View key={index} style={{margin: 10, marginTop: 0}}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: contentTextColor,
                                }}>可用{item.accountName}：{formatMoney(item.available,false)}</Text>
                        </View>
                    })
                }
                <View style={[styles.lineStyle, {marginTop: 5}]}/>
                <View style={{margin: 15, marginTop: 0}}>
                    <Text style={{color: contentTextColor}}>
                        使用余额：{formatMoney(this.state.data.combo.balancePay,false)}
                    </Text>
                    <Text style={{marginTop: 10, color: contentTextColor}}>
                        使用玉积分：{formatMoney(this.state.data.combo.jadeIntegralPay,false)}
                    </Text>
                </View>
            </View>
        );
    }

    confirmPayment() {
        return (
            <View>
                <TouchableOpacity
                    style={{
                        marginTop: 30,
                        marginLeft: 40,
                        marginRight: 50,
                        marginBottom: 30,
                        height: 35,
                        backgroundColor: this.state.data !== null ? (this.state.data.total === undefined ? mainColor : this.state.payDisable ? 'gray' : mainColor) : (this.state.payDisable ? 'gray' : mainColor),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5
                    }}
                    activeOpacity={0.7}
                    disabled={this.state.data !== null ? (this.state.data.total === undefined ? false : this.state.payDisable) : this.state.payDisable}
                    onPress={() => {
                        let {address} = this.props;
                        if (!address.id) {
                            showToastShort('收货地址不能为空');
                            return;
                        }
                        let orderPays = [];
                        for (let item of this.state.data.accounts) {
                            if (item.accountType === BALANCE_ACCOUNT) {
                                if (Number(item.available) < Number(this.state.data.combo.balancePay)) {
                                    showToastShort('可用' + item.accountName + '不足');
                                    return;
                                }
                                orderPays.push({'accountType':BALANCE_ACCOUNT,'available':this.state.data.combo.balancePay})
                            }
                            else if (item.accountType === JADE_INTEGRAL_ACCOUNT) {
                                if (Number(item.available) < Number(this.state.data.combo.jadeIntegralPay)) {
                                    showToastShort('可用' + item.accountName + '不足');
                                    return;
                                }
                                orderPays.push({'accountType':JADE_INTEGRAL_ACCOUNT,'available':this.state.data.combo.jadeIntegralPay})
                            }
                        }
                        this.props.dispatch(goto('ComboPaymentDetail',{orderData:{orderPays:orderPays,address:address,comboId:comboId,totalPrice:this.state.data.combo.price}}))
                    }}>
                    <Text style={{color: 'white', fontSize: 15,}}>{'前往支付'}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor,
    },
    lineStyle: {
        margin: 15,
        marginTop: 0,
        backgroundColor: placeholderTextColor,
        height: 0.5
    }
});

selector = (state) => {
    return {
        nav: state.nav,
        otherConfig: state.loginStore.otherConfig,
        token: state.loginStore.token,
        address: state.cacheStore.defaultAddress,
    }
};

export default connect(selector)(ConfirmOrderView);
