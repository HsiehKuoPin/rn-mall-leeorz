import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';

import TitleBar from '../../../../widgets/TitleBar';
import {connect} from 'react-redux';
import RequestErrorView from '../../../../widgets/RequestErrorView';
import {post, isSuccess} from "../../../../common/CommonRequest"
import {showToastShort} from "../../../../common/CommonToast";
import ProductList from "./module/CarProductListView";
import LoadingView from "../../../../widgets/LoadingView";
import {content2TextColor, contentTextColor, mainColor, titleTextColor} from "../../../../constraint/Colors";
import {ic_colored_tape} from "../../../../constraint/Image";
import PayPasswordView from "../../../../widgets/PayPasswordView";
import TipDialog from "../../../../widgets/dialog/TipDialog";
import {goBack, goto} from "../../../../reducers/RouterReducer";
import XImage from "../../../../widgets/XImage";
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
            data: null
        };
    }

    componentDidMount() {
        this._loadCancelOrderDetail();
    }

    _loadCancelOrderDetail() {
        let requestObj = {'orderId': orderData.orderId, token: this.props.token};
        post('order/car/cancelOrderDetail', requestObj)
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
            'orderId': orderData.orderId,
            token: this.props.token,
            'payPassword': obj
        };
        post('order/car/cancelOrder', requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort('取消提车成功');
                    this.props.dispatch(goBack('Main'));
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
                        {this.state.data === null ? <View/> : this.IntegralMessage(this.state.data)}
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: 60, width: 60,
                            marginLeft: width - 73,
                            elevation: 4,
                            marginTop: 14,
                        }}>
                        <XImage source={ic_colored_tape} style={{height: 60, width: 60}}/>
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
        return (
            <View style={styles.container}>
                <TitleBar title={'不提车'}
                          hideRight={true}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }

    IntegralMessage(data) {

        return (
            <View>
                <View style={{marginTop: 20, marginLeft: 15}}>
                    <Text style={{fontSize: 16, color: titleTextColor, marginBottom: 5}}>
                        {'不提车将退回以下资金：'}
                    </Text>
                    {
                        data.amount.length === 0 ? <View/> : data.amount.map((item, index) => {
                            return <Text
                                style={{
                                    marginTop: 10,
                                    fontSize: 14,
                                    color: contentTextColor,
                                    lineHeight: 20,
                                }}
                                key={index}>
                                {item}
                            </Text>
                        })
                    }
                    <Text style={{
                        marginTop: 10,
                        fontSize: 12,
                        color: content2TextColor,
                        lineHeight: 20,
                    }}
                          numberOfLines={2}>
                        {'不提车将视为违约，扣除10%的保证金和定金，退回资金将为两个月周期支付到客户账号。'}
                    </Text>
                    <TouchableOpacity
                        style={{
                            marginTop: 30,
                            marginLeft: 40,
                            marginRight: 50,
                            marginBottom: 30,
                            height: 35,
                            backgroundColor:mainColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 8
                        }}
                        activeOpacity={0.7}
                        onPress={() => {
                            this.onPayPassword();
                        }}>
                        <Text style={{color: 'white', fontSize: 15,}}>{'确定'}</Text>
                    </TouchableOpacity>
                </View>

            </View>
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
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig:state.loginStore.otherConfig,
    }
};

export default connect(selector)(NotExtractionCarView);
