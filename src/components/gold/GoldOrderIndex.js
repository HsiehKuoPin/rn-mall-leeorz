import React, {Component} from 'react';
import {
    ScrollView,
    View,
} from 'react-native';

import {connect} from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TitleBar from '../../widgets/TitleBar';
import TabViewBar from '../../components/common/TabViewBar';
import {ORDER_DEPOSIT, ORDER_RECORD} from "../../constraint/OrderType";
import GoldDeposit from "./module/GoldDeposit";
import GoldRecord from "./module/GoldRecord";
import {mainBackgroundColor} from "../../constraint/Colors";

class GoldOrderIndex extends Component {
    constructor(props) {
        super(props);
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

    render() {
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                <TitleBar title={'开店定货'}/>
                <ScrollableTabView
                    ref='ScrollableTabView'
                    initialPage={this.pageIndex}
                    renderTabBar={() =>
                        <TabViewBar isShowLine={true}/>}>
                    <GoldDeposit tabLabel='定金' orderType={ORDER_DEPOSIT}/>
                    <GoldRecord tabLabel='记录' orderType={ORDER_RECORD}/>
                </ScrollableTabView>
            </View>
        )
    }
}

selector = (state) => {
    return {
        nav: state.nav,
    }
};

export default connect(selector)(GoldOrderIndex);

