import React, {Component} from 'react';
import {
    View,
} from 'react-native';

import LFlatList from '../../../../widgets/LFlatList';
import CarOrderItem from './CarOrderItem'
import EmptyView from '../../../common/empty/EmptyView';
import {connect} from 'react-redux';
import {showToastShort} from "../../../../common/CommonToast";
import {getRequestFailTip, isSuccess, post} from "../../../../common/CommonRequest";
import {saveToken} from "../../../../reducers/LoginReducer";
import BaseComponent from "../../../../widgets/BaseComponent";
import {FAMOUS_CAR} from "../../../../constraint/ProductType";

class CarOrderList extends BaseComponent {
    constructor(props){
        super(props)
    };

    static defaultProps = {
        emptyListTip:'',
    };

    componentWillReceiveProps(nextProps){
        if(this.isUserTokenChange(nextProps) && nextProps.token){
            if(this.refs.LFlatList){
                this.refs.LFlatList.reset()
            }
        }
    }

    _getOrderList(callback, options,page = 1){
        let requestObj = {token: this.props.token,orderStatusType:this.props.orderType,type:FAMOUS_CAR,pageNo:page,pageSize:10};
        post('order/car/orderList', requestObj)
            .then((response) => {
                if (isSuccess(response)) {
                    let listResult = response.result.orderList;
                    callback(listResult.data, {isShowFirstLoadView: false, haveNext:listResult.pageNo < listResult.pageCount});
                } else if(this.checkUserTokenValid({response,title:'您的登录已失效'})){
                    this._errorMsg(response);
                }
            }).catch((e) => {
                showToastShort(getRequestFailTip());
        });
    }

    _onRefresh(callback, options) {
        this._getOrderList(callback,options);
    };

    _onLoadMore(page = 1, callback, options) {
        this._getOrderList(callback,options,page);
    };

    render(){
        return (
            <View style={{flex:1}}>
                <LFlatList
                    ref={'LFlatList'}
                    onLoadMore={this._onLoadMore.bind(this)}
                    onRefreshing={this._onRefresh.bind(this)}
                    pagination={true}
                    refreshable={true}
                    emptyView={()=><EmptyView emptyTip={this.props.emptyListTip}/>}
                    ListHeaderComponent={() => <View style={{height: 5}}/>}
                    withSections={false}
                    isMounted={false}
                    isShowFirstLoadView={true}
                    enableEmptySections={true}
                    renderItem={({item,key}) =>
                        <View key={key}>
                            <CarOrderItem data={item} listState = {this.props.orderType}/>
                        </View>
                    }
                />
            </View>
        )
    }
}

selector=(state)=>{
    return {
        token: state.loginStore.token
    }
};

export default connect(selector)(CarOrderList);