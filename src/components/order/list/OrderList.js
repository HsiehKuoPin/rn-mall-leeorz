import React, {Component} from 'react';
import {
    View,
    DeviceEventEmitter,
    Dimensions
} from 'react-native';

import LFlatList from '../../../widgets/LFlatList';
import {connect} from 'react-redux';
import OrderItem from './OrderItem'
import EmptyView from '../../common/empty/EmptyView'

import {mainBackgroundColor} from "../../../constraint/Colors";
import {getRequestFailTip, post, isSuccess} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import RequestErrorView from "../../../widgets/RequestErrorView";
import BaseComponent from "../../../widgets/BaseComponent";

class OrderList extends BaseComponent {

    constructor(props) {
        super(props);
        this.orderType = this.props.orderType;
        this.token = this.props.token;

        this.state = {
            isRequestFail: false,
            showDialog: false,
            dialogMessage: '',

        };
        this.orderList = [];
        this.deleteOrderId = '';
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(this.orderType, (data) => {
            // console.warn(JSON.stringify(data));
            if (data.type === 'delete') {
                this._removeOrder(data)
            } else {//刷新当前页面
                if (this.refs.orderList) {
                    this.refs.orderList.reset();
                }
            }
        })
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    _getOrderList(callback, options, pageNo = 1) {
        let requestObj = {
            'orderStatusType': this.orderType,
            'pageNo': pageNo,
            'pageSize': 20, token: this.token
        };

        post('order/orderList', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let data = responseData.result.orderList.data;
                    let pageCount = responseData.result.orderList.pageCount;
                    this.orderList.push(...data);
                    callback(data, {isShowFirstLoadView: false, haveNext: (pageNo < pageCount),});

                } else if (this.checkUserTokenValid({title: '您的登录已经失效'})) {
                    if (pageNo === 1) {
                        this.setState({
                            isRequestFail: true,
                        });
                    }
                    showToastShort(getRequestFailTip(responseData));
                    callback(data, {isShowFirstLoadView: false, requestError: true,});
                }
            }).catch((e) => {
            if (pageNo === 1) {
                this.setState({
                    isRequestFail: true,
                });
            } else {
                console.warn(e.message);
                callback(data, {isShowFirstLoadView: false, requestError: true,});
            }

        });
    }

    _onRefresh(callback, options) {
        this._getOrderList(callback, options);
    }

    _onLoadMore(page = 1, callback, options) {
        this._getOrderList(callback, options, page);
    }

    _removeOrder(data) {
        this.deleteOrderId = data.orderId;
        // console.warn(this.deleteOrderId);
        let newOrderList = [];
        this.orderList.map(item => {
            // console.warn('item.id:',item.id);
            if (item.id !== this.deleteOrderId) {
                newOrderList.push(item);
            }
        });

        this.orderList = newOrderList;
        if (this.refs.orderList) {
            this.refs.orderList.updateDataSource(newOrderList)
        }
    }

    render() {
        let showView = this.state.isRequestFail ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestFail: false})
            }}/>) : (
                <LFlatList
                    ref={'orderList'}
                    ListHeaderComponent={() => <View style={{height: 5}}/>}
                    // ListFooterComponent={()=><View style={{height:5}}/>}
                    onLoadMore={this._onLoadMore.bind(this)}
                    onRefreshing={this._onRefresh.bind(this)}
                    pagination={true}
                    refreshable={true}
                    withSections={false}
                    isMounted={false}
                    emptyView={() => <EmptyView emptyTip={'您还没有订单!'}/>}
                    isShowFirstLoadView={true}
                    enableEmptySections={true}
                    initialNumToRender={3}
                    renderItem={({item, key}) => <OrderItem key={key} data={item}/>}
                />

        );
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {showView}
            </View>
        )
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token
    }
};
export default connect(selector)(OrderList);
