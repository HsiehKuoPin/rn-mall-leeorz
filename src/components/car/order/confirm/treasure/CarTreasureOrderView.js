import React, {Component} from 'react';
import {
    ScrollView,
    View,
} from 'react-native';

import {connect} from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TitleBar from '../../../../../widgets/TitleBar';
import TabViewBar from '../../../../common/TabViewBar';
import {mainBackgroundColor} from "../../../../../constraint/Colors";
import {getRequestFailTip, isSuccess, post} from "../../../../../common/CommonRequest";
import OrderDeposit from "./module/OrderDeposit";
import OrderRecord from "./module/OrderRecord";
import {ORDER_DEPOSIT, ORDER_RECORD} from "../../../../../constraint/OrderType";
import BaseComponent from "../../../../../widgets/BaseComponent";
import {showToastShort} from "../../../../../common/CommonToast";

class CarTreasureOrderView extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            data: null
        };
        this.pageIndex = 0;
        if(this.props.navigation.state.params){
            switch (this.props.navigation.state.params.orderType) {
                case ORDER_DEPOSIT:
                    this.pageIndex = 0;
                    break;
                case ORDER_RECORD:
                    this.pageIndex = 1;
                    break;
                default:
                    this.pageIndex = 0;
                    break;
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.isResume(nextProps) && this.isUserTokenChange(nextProps)){
            this._loadOrderDetail();

        }
    }

    componentDidMount() {
        this._loadOrderDetail();
    }

    _loadOrderDetail() {
        post('order/car/createCarOrderDetail', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        data: responseData.result,
                    })
                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            })
            .catch((e) => {
                this._errorMsg(e.message);
            });
    }

    _errorMsg(e){
        showToastShort(getRequestFailTip(e));
    }

    render() {
        let contentView = this.state.isLoading?null: <ScrollableTabView
            ref='ScrollableTabView'
            initialPage={this.pageIndex}
            renderTabBar={() =>
                <TabViewBar isShowLine={true}/>}>
            <OrderDeposit tabLabel='定金' orderType={ORDER_DEPOSIT}
                          data={this.state.data}/>
            <OrderRecord tabLabel='记录' orderType={ORDER_RECORD}/>
        </ScrollableTabView>;
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                <TitleBar title={'车宝定购'}/>
                {contentView}
            </View>
        )
    }
}

selector = (state) => {
    return {
        nav: state.nav,
        token: state.loginStore.token,
    }
};

export default connect(selector)(CarTreasureOrderView);

