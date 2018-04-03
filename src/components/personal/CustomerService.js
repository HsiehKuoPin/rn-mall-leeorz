import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';

import {connect} from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TitleBar from '../../widgets/TitleBar'
import TabViewBar from '../common/TabViewBar';
import {mainBackgroundColor} from "../../constraint/Colors";
import ServiceOrder from './service/ServiceOrder'
let navigation = null;

class CustomerService extends Component {

    constructor(props) {
        super(props);
        navigation = this.props.navigation;
    }

    render() {
        let order = navigation.state.params? navigation.state.params : '';

        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'售后管理'}
                          hideRight={true}
                />
                <ScrollableTabView renderTabBar={() => <TabViewBar underlineWidth={60}/>}>
                    <ServiceOrder tabLabel='售后申请' isApplyDetailList={true} orderId={order.orderId}/>
                    <ServiceOrder tabLabel='申请记录' isApplyDetailList={false}/>
                </ScrollableTabView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
});

export default connect()(CustomerService)