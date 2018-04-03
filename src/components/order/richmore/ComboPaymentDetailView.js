import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import {post, isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import PaymentMessage from "./module/PaymentMessage"
import {mainColor} from "../../../constraint/Colors";
import PayPasswordView from "../../../widgets/PayPasswordView";
import TipDialog from "../../../widgets/dialog/TipDialog";
import {goBack, goto, gotoAndClose} from "../../../reducers/RouterReducer";
import {ORDER_APPROVED} from "../../../constraint/OrderType";
import {isTrue} from "../../../common/AppUtil";

var orderData;
class ComboPaymentDetailView extends Component {

    constructor(props) {
        super(props);
        orderData = this.props.navigation.state.params.orderData;
        this.state = {
            data: null,
            showTitle: '',
            showButton: '确定',
        }
    }

    componentDidMount() {
        if (this.props.password !== undefined)
        {
            if (this.props.password.length === 6)
            {
                this._loadPayOrder();
            }
        }
    }

    //支付订单

    _loadPayOrder(password) {
        let requestObj = {
            'comboId': orderData.comboId,
            'address': orderData.address,
            token: this.props.token,
            'payPassword': password
        };
        post('order/combo/createOrder', requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort('下单成功');
                    this.props.dispatch(gotoAndClose('MyOrder','Main',{orderType:ORDER_APPROVED}));
                } else {
                    showToastShort(responseData.message)
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    _keyExtractor = (item, index) => index;

    render() {

        return (
            <View style={styles.container}>
                <TitleBar title={'付款详情'}
                          hideRight={true}/>
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
                        <PaymentMessage data={orderData}/>
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
                    height: 35,
                    backgroundColor: mainColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5
                }}
                activeOpacity={0.7}
                onPress={() => {
                    this.onPayPassword();
                }}>
                <Text style={{color: 'white', fontSize: 15,}}>{'确认支付'}</Text>
            </TouchableOpacity>
        );
    }

    onPayPassword() {

        isTrue(this.props.otherConfig.isSetPayPassword)?
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
        resizeMode: 'contain',
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig:state.loginStore.otherConfig,
    }
};

export default connect(selector)(ComboPaymentDetailView);