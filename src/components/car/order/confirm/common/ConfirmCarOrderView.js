import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';

import TitleBar from '../../../../../widgets/TitleBar';
import {connect} from 'react-redux';
import RequestErrorView from '../../../../../widgets/RequestErrorView';
import {post, isSuccess, getHost} from "../../../../../common/CommonRequest"
import {showToastShort} from "../../../../../common/CommonToast";
import ProductCarList from "./module/ProductCarListView";
import IntegralCarMessage from "./module/IntegralCarMessage";
import {ic_colored_tape} from "../../../../../constraint/Image";
import LoadingView from "../../../../../widgets/LoadingView";
import { showLoadingDialog} from "../../../../../reducers/CacheReducer";
import {goBack, goto, gotoAndClose} from "../../../../../reducers/RouterReducer";
import XImage from "../../../../../widgets/XImage";
import BaseComponent from "../../../../../widgets/BaseComponent";
import {FAMOUS_CAR} from "../../../../../constraint/ProductType";

const width = Dimensions.get('window').width;

var nativeParams;
var productSkuId;

class ConfirmCarOrderView extends BaseComponent {

    constructor(props) {
        super(props);
        nativeParams = this.props.nativeParams;
        productSkuId = this.props.navigation.state.params.productSkuId;
        this.state = {
            isRequestError: false,
            isLoading: true,
            showTitle: '',
            showButton: '确定',
            data: null,
            orderPays: undefined,
            totalPrice:''
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
        post('order/car/createOrderDetail', {'productSkuId': productSkuId, token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                        totalPrice:responseData.result.productSkus[0].salePrice
                    })
                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            })
            .catch((e) => {
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
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadOrderDetail();
            }}/>
        ) : (

            <View style={styles.container}>
                <ScrollView>
                    <View
                        style={styles.ViewStyle}>
                        <ProductCarList data={this.state.data}/>
                        <IntegralCarMessage data={this.state.data}
                                            onBuyCarPress={() => this.props.dispatch(goto('Agreement',{url:getHost()+'main/protocol.html',title:'购车业务服务条款'}))}
                                            onPayPress={(orderPays) => {
                                                this.props.dispatch(goto('CartDepositPaymentDetailView',{orderData:{orderPays:orderPays,productSkuId:productSkuId,totalPrice:this.state.totalPrice,payType:FAMOUS_CAR}}))
                                            }}/>
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
                <TitleBar title={'确认订单'}
                          hideRight={true}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
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
    }
});

selector = (state) => {
    return {
        nav: state.nav,
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
        product: state.cacheStore.defaultProduct,
    }
};

export default connect(selector)(ConfirmCarOrderView);
