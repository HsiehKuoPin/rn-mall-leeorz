import React, {Component} from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import TitleBar from '../../../../widgets/TitleBar'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import CarPurchaseDetails from './CarOrderList'
import TabViewBar from '../../../common/TabViewBar'
import {mainBackgroundColor} from "../../../../constraint/Colors";
import {connect} from "react-redux";
import {ORDER_COMPLETED, ORDER_TO_CHOOSE, PREMISE_CAR} from "../../../../constraint/OrderType";

class CarOrderPage extends Component {

    constructor(props) {
        super(props);
        this.pageIndex = 0;
        if(this.props.navigation.state.params){
            switch (this.props.navigation.state.params.orderType) {
                case ORDER_TO_CHOOSE:
                    this.pageIndex = 0;
                    break;
                case PREMISE_CAR:
                    this.pageIndex = 1;
                    break;
                case ORDER_COMPLETED:
                    this.pageIndex = 2;
                    break;
                default:
                    this.pageIndex = 0;
                    break;
            }
        }

    }


    render() {
        return (
            <View style={styles.container}>

                <TitleBar title={'购车记录'}/>
                <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                    <ScrollableTabView
                        initialPage={this.pageIndex}
                        renderTabBar={() => <TabViewBar isShowLine={true}/>}>
                        <CarPurchaseDetails tabLabel='未选择' emptyListTip={'你还没有未选择订单'} orderType={ORDER_TO_CHOOSE}/>
                        <CarPurchaseDetails tabLabel='提  车' emptyListTip={'你还没有提车订单'} orderType={PREMISE_CAR}/>
                        <CarPurchaseDetails tabLabel='已完成' emptyListTip={'你还没有已完成订单'} orderType={ORDER_COMPLETED}/>
                    </ScrollableTabView>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
})

selector = (state) => {
    return {
        nav: state.nav,
    }
};
export default connect(selector)(CarOrderPage);



