import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import RequestErrorView from '../../../widgets/RequestErrorView';
import {post, getRequestFailTip, isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import SelectAddress from "../module/selectaddress/index";
import ProductList from "./module/ProductListView";
import IntegralMessage from "./module/IntegralMessage";
import {ic_colored_tape} from "../../../constraint/Image";
import LoadingView from "../../../widgets/LoadingView";
import {saveAddress, saveTotalAmount, saveTotalPrice} from '../../../reducers/CacheReducer';
import XImage from "../../../widgets/XImage";
import BaseComponent from "../../../widgets/BaseComponent";

const width = Dimensions.get('window').width;

//界面传参：products:{productIds:[{productSkuId: skuId, quantity: 'count'}],number:'2',total:'23'}
var products;

class ConfirmOrderView extends BaseComponent {

    constructor(props) {
        super(props);
        products = this.props.navigation.state.params.products;
        this.removeShoppingCart = this.props.navigation.state.params.removeShoppingCart;
        this.state = {
            isRequestError: false,
            isLoading: true,
            data: null,
            addressData: null,
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
        var productArr = [];
        products.productIds.map(item => {
            productArr.push({"id": item.productSkuId});
        })
        let requestObj = {'products': productArr, token: this.props.token};
        post('order/createOrderDetail', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.props.dispatch(saveTotalAmount(products.number));
                    this.props.dispatch(saveTotalPrice(products.total));
                    this.props.dispatch(saveAddress(responseData.result.address));
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                        addressData: responseData.result.address
                    })
                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            }).catch((e) => {
            this._errorMsg(e);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(getRequestFailTip(msg));
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
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadOrderDetail();
            }}/>
        ) : (
            <View style={styles.container}>
                <ScrollView
                    ref="scrollView">
                    <View
                        style={styles.ViewStyle}>
                        <SelectAddress data={address}/>
                        <ProductList data={this.state.data} products={products}/>
                        <IntegralMessage data={this.state.data} products={products} removeShoppingCart={this.removeShoppingCart}/>
                    </View>
                </ScrollView>
            </View>);
        return (
            <View style={styles.container}>
                <TitleBar title={'确认订单'}/>
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
        backgroundColor: 'white',
    }
});

selector = (state) => {
    return {
        nav: state.nav,
        token: state.loginStore.token,
        address: state.cacheStore.defaultAddress,
    }
};

export default connect(selector)(ConfirmOrderView);
