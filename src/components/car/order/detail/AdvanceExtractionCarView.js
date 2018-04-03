import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import TitleBar from '../../../../widgets/TitleBar';
import {connect} from 'react-redux';
import RequestErrorView from '../../../../widgets/RequestErrorView';
import {post, isSuccess} from "../../../../common/CommonRequest"
import {showToastShort} from "../../../../common/CommonToast";
import ProductList from "./module/CarProductListView";
import LoadingView from "../../../../widgets/LoadingView";
import {
    contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../../../constraint/Colors";
import {ic_colored_tape} from "../../../../constraint/Image";
import PayPasswordView from "../../../../widgets/PayPasswordView";
import TipDialog from "../../../../widgets/dialog/TipDialog";
import {goBack, goto, gotoAndClose} from "../../../../reducers/RouterReducer";
import XImage from "../../../../widgets/XImage";
import {
    PAYMENTS_CONFIG,
} from "../../../../constraint/AssetsType";
import {checkInputEmail, checkInputIsNumber, formatMoney} from "../../../../common/StringUtil";
import {ORDER_COMPLETED} from "../../../../constraint/OrderType";
import {isTrue} from "../../../../common/AppUtil";

const width = Dimensions.get('window').width;

var orderData = null;

class NotExtractionCarView extends Component {

    constructor(props) {
        super(props);
        orderData = this.props.navigation.state.params;
        this.state = {
            isRequestError: false,
            isLoading: true,
            selectIndex: null,
            showTitle: '',
            showButton: '确定',
            data: null,
            email: ''
        };
    }

    componentDidMount() {
        this._loadCancelOrderDetail();
    }

    _loadCancelOrderDetail() {
        let requestObj = {'orderId': orderData.orderId, token: this.props.token};
        post('order/car/mentionPremiseTheCar', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                    })
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
    }

    //支付订单
    _loadPayOrder(obj) {
        let requestObj = {
            'orderId': orderData.orderId,
            token: this.props.token,
            'payPassword': obj,
            'email': this.state.email
        };
        post('order/car/payMentionPremiseTheCar', requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort('提前提车成功');
                    this.props.dispatch(gotoAndClose('CarOrderPage', ['Main', 'BuyCarIndex'], {orderType: ORDER_COMPLETED}));
                }
                else {
                    showToastShort(responseData.message);
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    render() {

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
                            shadowRadius: 5,
                            shadowOpacity: 0.2,
                            elevation: 2,
                            backgroundColor: 'white',
                            borderRadius: 5,
                            margin: 10,
                        }}>
                        <ProductList data={orderData.product}/>
                        {this.BuyerMailbox()}
                        {this.state.data === null ? <View/> : this.IntegralMessage(this.state.data)}
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: 60, width: 60,
                            marginLeft: width - 66,
                            elevation: 2,
                            marginTop: 6,
                        }}>
                        <XImage source={ic_colored_tape} style={{height: 60, width: 60}}/>
                    </View>
                </ScrollView>
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar title={'提前提车'}
                          hideRight={true}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }

    BuyerMailbox() {
        return (
            <View>
                <View style={{marginTop: 15, marginLeft: 15}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: titleTextColor}}>
                            {'买家邮箱：'}
                        </Text>
                        <View style={{
                            flex: 1,
                            borderWidth: 0.5,
                            borderColor: placeholderTextColor,
                            borderRadius: 3,
                            height: 40,
                            backgroundColor: mainBackgroundColor,
                            marginRight: 15,
                            justifyContent: 'center'
                        }}>
                            <TextInput
                                style={{padding: 5, fontSize: 13}}
                                underlineColorAndroid='transparent'
                                autoCapitalize="none"
                                placeholder={'填写您的邮箱地址'}
                                placeholdertTextColor={placeholderTextColor}
                                onChangeText={(text) => {
                                    this.setState({email: text})
                                }}>

                            </TextInput>
                        </View>
                    </View>
                    <PayPasswordView
                        ref={'PayPasswordView'}
                        pay={(password) => this._loadPayOrder(password)}
                    />
                    <TipDialog
                        ref={'TipDialog'}
                        confirmBtnText={this.state.showButton}
                        dialogMessage={this.state.showTitle}
                        onClickConfirm={this.onDeletePress.bind(this, this.state.showTitle)}/>
                </View>
            </View>
        )
    }

    IntegralMessage(data) {

        return (
            <View>
                <View style={{
                    marginLeft: 15,
                    marginRight: 15,
                    backgroundColor: placeholderTextColor,
                    height: 0.5,
                    marginTop: 15,
                }}/>
                <View style={{marginTop: 20, marginLeft: 15}}>
                    <Text style={{fontSize: 16, color: titleTextColor, marginBottom: 5}}>
                        {'支付明细：'}
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: 10,}}>
                        <Text
                            style={{
                                fontSize: 14,
                                width: 120,
                                color: contentTextColor,
                            }}>
                            {'提前提车加价10%'}
                        </Text>
                        <Text
                            style={{
                                marginLeft: 30,
                                fontSize: 14,
                                color: contentTextColor,
                            }}>
                            {formatMoney(data.amountTypePreferentialLift) + '(' + PAYMENTS_CONFIG[data.accountTypePreferentialLift].name + ')'}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 10,}}>
                        <Text
                            style={{
                                fontSize: 14,
                                width: 120,
                                color: contentTextColor,
                            }}>
                            {'支付尾款'}
                        </Text>
                        <Text
                            style={{
                                marginLeft: 30,
                                fontSize: 14,
                                color: contentTextColor,
                            }}>
                            {formatMoney(data.amountTypeBalancePayment) + '(' + PAYMENTS_CONFIG[data.accountTypeBalancePayment].name + ')'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            marginTop: 30,
                            marginLeft: 40,
                            marginRight: 50,
                            marginBottom: 30,
                            height: 35,
                            backgroundColor: mainColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 5
                        }}
                        activeOpacity={0.5}
                        onPress={() => {
                            for (let status of data.accounts) {
                                if (Number(status.available) < Number(data.amountTypeBalancePayment + data.amountTypePreferentialLift)) {
                                    showToastShort(status.accountName + '不足')
                                    return;
                                }
                            }
                            this.onPayPassword();
                        }}>
                        <Text style={{color: 'white', fontSize: 15,}}>{'确定'}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    onPayPassword() {
        if (this.state.email.length === 0) {
            showToastShort('您还没有输入邮箱');
            return;
        }
        if (!checkInputEmail(this.state.email)) {
            showToastShort('您输入的不是有效的邮箱');
            return;
        }
        isTrue(this.props.otherConfig.isSetPayPassword) ?
            this.refs.PayPasswordView.show() : (
                this.setState({
                    showTitle: '是否去设置支付密码?',
                }, () => this.refs.TipDialog.showDialog())
            )
    }

    onDeletePress = (title) => {
        if (title === '是否去设置支付密码?') {
            this.props.dispatch(goto('ResetPaymentPsw'))
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
    }
};

export default connect(selector)(NotExtractionCarView);
