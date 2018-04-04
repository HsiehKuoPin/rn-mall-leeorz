import React, {Component} from 'react';
import {
    View,
} from 'react-native';

import {connect} from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TitleBar from '../../widgets/TitleBar';
import OrderList from './list/OrderList'
import TabViewBar from '../common/TabViewBar'

import {mainBackgroundColor} from "../../constraint/Colors";
import {ORDER_ALL, ORDER_APPRAISE, ORDER_APPROVED, ORDER_CREATED, ORDER_SENT} from "../../constraint/OrderType";


var pageIndex = 0;
class MyOrder extends Component {
    constructor(props){
        super(props);
        let orderType = '';
        if(this.props.navigation.state.params){
            orderType = this.props.navigation.state.params.orderType;
        }
        switch (orderType){
            case ORDER_CREATED: pageIndex = 1;break;
            case ORDER_APPROVED: pageIndex = 2;break;
            case ORDER_SENT: pageIndex = 3;break;
            case ORDER_APPRAISE: pageIndex = 4;break;
            default:pageIndex = 0;break;
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                <TitleBar title={'订单列表'}/>
                    <ScrollableTabView
                        ref='ScrollableTabView'
                        initialPage={pageIndex}
                        renderTabBar={() => <TabViewBar isShowLine={false}/>}>
                        <OrderList tabLabel='全部' orderType={ORDER_ALL}/>
                        <OrderList tabLabel='待付款' orderType={ORDER_CREATED}/>
                        <OrderList tabLabel='待发货' orderType={ORDER_APPROVED}/>
                        <OrderList tabLabel='待收货' orderType={ORDER_SENT}/>
                        <OrderList tabLabel='待评价' orderType={ORDER_APPRAISE}/>
                    </ScrollableTabView>
            </View>
        )
    }
}


export default connect()(MyOrder);

