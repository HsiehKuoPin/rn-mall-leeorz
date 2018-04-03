import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

import TitleBar from '../../widgets/TitleBar';
import {connect} from 'react-redux';
import {post, isSuccess} from "../../common/CommonRequest"
import {showToastShort} from "../../common/CommonToast";
import {content2TextColor, mainColor} from "../../constraint/Colors";
import TipDialog from "../../widgets/dialog/TipDialog";
import PayPasswordView from "../../widgets/PayPasswordView";
import {placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import {goto,goBack} from "../../reducers/RouterReducer";
import {isTrue} from "../../common/AppUtil";
import {formatMoney} from "../../common/StringUtil";
import {PAYMENTS_CONFIG} from "../../constraint/AssetsType";

var data = null;

class VentureFundPaymentDetail extends Component {

    constructor(props) {
        super(props);
        data = this.props.navigation.state.params;
        this.state = {
            showPayPassword: false,
            data: null,
            showTitle: '',
            showButton: '确定',
        }

    }

    //支付订单

    _loadPayOrder(pass) {
        let requestObj = {
            token: this.props.token,
            'payPassword': pass
        };
        let url = 'order/company/createEntrepreneurshipOrder';
        post(url, requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort(responseData.message);
                    this.props.dispatch(goBack());
                }
                else {
                    showToastShort(responseData.message);
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TitleBar title={'付款详情'}
                          hideRight={true}/>
                <ScrollView>
                    <View
                        style={styles.ViewStyle}>
                        {this.paymentMessage()}
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

    paymentMessage() {
        return (
            <View>
                <Text style={{
                    marginTop: 20,
                    marginLeft: 20,
                    fontSize: 15,
                    color: titleTextColor,
                }}>支付明细:</Text>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flexDirection: 'column', marginLeft: 20,}}>
                        <Text style={{
                            marginTop: 10,
                            fontSize: 13,
                            color: content2TextColor,
                        }}>
                            {PAYMENTS_CONFIG[data.accountType].name + '支付'}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'column', marginLeft: 30,}}>
                        <Text style={{
                            textAlign: 'left',
                            marginTop: 10,
                            fontSize: 13,
                            color: content2TextColor,
                        }}>
                            {formatMoney(data.payAmountLabel, false)}
                        </Text>
                    </View>
                </View>
                <View style={styles.lineStyle}/>
            </View>
        )
    }

    confirmPayment() {

        return (
            <TouchableOpacity
                style={styles.buttonStyle}
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
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        margin: 10,
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
    },
    lineStyle: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: placeholderTextColor,
        height: 0.5
    },
    InputLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 10,
    },
    RecommendName: {
        fontSize: 15,
        flex: 1,
        justifyContent: 'center',
        color: 'black',
        paddingLeft: 15,
    },
    holderText: {
        marginLeft: 10,
        color: titleTextColor,
        fontSize: 14,
        width: 90,
    },
    buttonStyle: {
        marginTop: 30,
        marginLeft: 40,
        marginRight: 50,
        marginBottom: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: mainColor
    },
    registerInput: {
        fontSize: 14,
        flex: 1,
        padding: 0,
        height: 30,
        justifyContent: 'center'
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
    }
};

export default connect(selector)(VentureFundPaymentDetail);