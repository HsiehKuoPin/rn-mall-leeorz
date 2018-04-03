import React, { Component } from 'react';
import {
    View,
    DeviceEventEmitter
} from 'react-native';

import LFlatList from '../../../widgets/LFlatList';
import {connect} from 'react-redux';
import EmptyView from '../../common/empty/EmptyView'
import OrderItem from '../service/OrderItem'
import {mainBackgroundColor} from "../../../constraint/Colors";
import {getRequestFailTip,isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";

class ServiceOrder extends Component {
    constructor(props) {
        super(props);
        this.token = this.props.token;
        this.isApplyDetailList = this.props.isApplyDetailList;
        this.orderId = this.props.orderId
    }

    componentDidMount(){
        this.listener =  DeviceEventEmitter.addListener('UPDATESERVICELIST',()=>{
            if(this.refs.serviceOrder) {
                this.refs.serviceOrder.reset();
            }
        })
    };

    componentWillUnmount(){
        if(this.listener){
            this.listener.remove();
        }
    }

    _getOrderList(callback,options,pageNo = 1){

        let requestObj = {'pageNo':pageNo,
            'pageSize':20,
            token: this.token};
        let requestUrl = (this.isApplyDetailList?'order/applyDetailList':'order/afterSaleList');
        post(requestUrl, this.isApplyDetailList?{...requestObj,'orderId':this.orderId}:requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let data = this.isApplyDetailList?responseData.result.orderList.data:responseData.result.data;
                    callback(data, {isShowFirstLoadView: false,haveNext: (pageNo < responseData.result.pageCount),});

                }else {
                    showToastShort(getRequestFailTip(responseData));
                    callback([], {isShowFirstLoadView: false,requestError:true,});
                } }).catch((e) => {
                    showToastShort(getRequestFailTip());
                    console.warn(e.message);
                    callback([], {isShowFirstLoadView: false,requestError:true,});
        });
    }

    _onRefresh(callback, options) {
        this._getOrderList(callback,options);
    }

    _onLoadMore(page = 1, callback, options) {
        this._getOrderList(callback,options,page);
    }

    render(){
        return(
            <View style={{flex:1,backgroundColor:mainBackgroundColor}}>
                <LFlatList
                    ref={'serviceOrder'}
                    onLoadMore={this._onLoadMore.bind(this)}
                    onRefreshing={this._onRefresh.bind(this)}
                    pagination={true}
                    refreshable={true}
                    withSections={false}
                    isMounted={false}
                    emptyView={()=><EmptyView emptyTip={'您没有售后订单!'}/>}
                    ListHeaderComponent={() => <View style={{height: 5}}/>}
                    isShowFirstLoadView={true}
                    enableEmptySections={true}
                    renderItem={({item, index}) => <OrderItem key={index} data={item} isApplyDetailList={this.isApplyDetailList}/>}
                />
            </View>
        )
    }
}

selector=(state)=>{
    return {
        token:state.loginStore.token
    }
};
export default connect(selector)(ServiceOrder);
