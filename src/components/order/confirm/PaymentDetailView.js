import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList,
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import {post, isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import PaymentMessage from "./module/PaymentMessage"
import {mainColor} from "../../../constraint/Colors";
import TipDialog from "../../../widgets/dialog/TipDialog";
import PayPasswordView from "../../../widgets/PayPasswordView";
import LoadingView from "../../../widgets/LoadingView";
import RequestErrorView from '../../../widgets/RequestErrorView';
import {placeholderTextColor, titleTextColor} from "../../../constraint/Colors";
import {
    ic_pay_blance, ic_selected,
    ic_un_selected
} from "../../../constraint/Image";
import {goBack, goto, gotoAndClose} from "../../../reducers/RouterReducer";
import XImage from "../../../widgets/XImage";
import {ORDER_APPROVED} from "../../../constraint/OrderType";
import {isTrue} from "../../../common/AppUtil";

var orderId = null;

class PaymentDetailView extends Component {

    constructor(props) {
        super(props);
        orderId = this.props.navigation.state.params.orderId;
        this.state = {
            showPayPassword: false,
            isRequestError: false,
            isLoading: true,
            data: null,
            showTitle: '',
            showButton: '确定',
            selectIndex: 0,
        }
    }

    componentDidMount() {
        this._loadPaymentDetail();
    }

    _loadPaymentDetail() {
        let requestObj = {'orderId': orderId, token: this.props.token};
        post('order/payOrderDetail', requestObj)
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

    //支付订单

    _loadPayOrder(obj) {
        let requestObj = {
            'orderId': orderId,
            token: this.props.token,
            'payPassword': obj
        };
        let url = 'order/payOrder';
        post(url, requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort('生成订单');
                    this.props.dispatch(gotoAndClose('MyOrder', 'Main', {orderType: ORDER_APPROVED}));
                }
                else {
                    showToastShort(responseData.message);
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
    }

    _keyExtractor = (item, index) => item.payType;

    render() {

        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadPaymentDetail();
            }}/>
        ) : (
            <View>
                <ScrollView>
                    <View
                        style={{
                            shadowColor: 'gray',
                            shadowOffset: {height: 2, width: 2},
                            shadowRadius: 5,
                            shadowOpacity: 0.2,
                            elevation: 2,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 5,
                            margin: 10,
                        }}>
                        <PaymentMessage data={this.state.data}/>
                        {this.state.data === null ? null : this.state.data.total === undefined ? <View/> :
                            this.selectPaymentMode()}
                        {this.confirmPayment()}

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
                </ScrollView>

            </View>
        )
        return (
            <View style={styles.container}>
                <TitleBar title={'付款详情'}
                          hideRight={true}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }

    selectPaymentMode() {

        var data = [
            {"image": ic_pay_blance, "payType": "消费余额支付"},
            // {"image": ic_pay_wechat, "payType": "微信支付"},
            // {"image": ic_pay_alipay, "payType": "支付宝支付"},
            // {"image": ic_pay_bankCard, "payType": "银行卡支付"},
        ];

        return (

            <View>
                <View style={{justifyContent: 'center'}}>
                    <Text style={{
                        padding: 15,
                        fontSize: 16,
                        color: titleTextColor
                    }}>选择支付方式:
                    </Text>
                    <View style={{
                        marginLeft: 10,
                        marginRight: 10,
                        backgroundColor: placeholderTextColor,
                        height: 0.5
                    }}/>
                </View>
                <FlatList horizontal={false}
                          data={data}
                          showsHorizontalScrollIndicator={false}
                          numColumns={1}
                          extraData={this.state.selectIndex}
                          keyExtractor={this._keyExtractor}
                          renderItem={({item, index}) =>
                              <View>
                                  <TouchableOpacity
                                      activeOpacity={0.5}
                                      onPress={() => {
                                          if (this.state.selectIndex !== index) {
                                              this.setState({selectIndex: index});
                                              this.setState({payDisable: false});
                                          }
                                      }}>
                                      <View
                                          key={index}
                                          style={styles.viewStyle}>

                                          <XImage source={item.image}
                                                  style={styles.imageStyle}/>
                                          <Text style={{
                                              fontSize: 14,
                                              color: titleTextColor
                                          }}>{item.payType}</Text>
                                          <View style={{flex: 1}}/>
                                          <XImage
                                              source={this.state.selectIndex === index ? ic_selected : ic_un_selected}
                                              style={{width: 15, height: 15, marginRight: 30}}/>
                                      </View>
                                  </TouchableOpacity>
                                  <View style={{
                                      marginLeft: 10,
                                      marginRight: 10,
                                      backgroundColor: placeholderTextColor,
                                      height: 0.5
                                  }}/>
                              </View>
                          }
                />
                <View style={{flex: 1}}/>
            </View>
        );
    }

    confirmPayment() {

        return (
            <TouchableOpacity
                style={{
                    marginTop: 30,
                    marginLeft: 40,
                    marginRight: 50,
                    marginBottom: 30,
                    height: 40,
                    backgroundColor: this.state.data !== null ? (this.state.data.total === undefined ? mainColor : this.state.payDisable ? 'gray' : mainColor) : (this.state.payDisable ? 'gray' : mainColor),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5
                }}
                activeOpacity={0.7}
                disabled={this.state.data !== null ? (this.state.data.total === undefined ? false : this.state.payDisable) : this.state.payDisable}
                onPress={() => {
                    this.onPayPassword();
                }}>
                <Text style={{color: 'white', fontSize: 15,}}>{'确认支付'}</Text>
            </TouchableOpacity>
        );
    }

    onPayPassword() {

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
    ViewStyle: {
        margin: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: 'white',
        borderRadius: 6,
        shadowColor: '#c7c7c7',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 4
    },
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    imageStyle: {
        margin: 20,
        width: 26,
        height: 26,
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
    }
};

export default connect(selector)(PaymentDetailView);