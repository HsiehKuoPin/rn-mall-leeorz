import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import {mainColor, titleTextColor} from '../../../../../constraint/Colors';

import {goto} from "../../../../../reducers/RouterReducer";
import {connect} from 'react-redux';
import {ORDER_APPRAISE, ORDER_APPROVED, ORDER_CREATED, ORDER_SENT} from "../../../../../constraint/OrderType";
import XImage from "../../../../../widgets/XImage";
import TintImage from "../../../../../widgets/TintImage";
import {CommonStyles} from "../../../../../styles/CommonStyles";
import {OrderIcon} from "../../../../../../resources/order/style2/index";
import {
    ic_order_customer_service,
    ic_order_wait_comment, ic_order_wait_delivery, ic_order_wait_pay,
    ic_order_wait_received
} from "../../../../../../resources/index";

let {width} = Dimensions.get('window');
class OrderComponent extends Component {
    render() {
        let {userInfo} = this.props;
        return (
            <View style={{backgroundColor:'white'}}>
                <View style={styles.allAsset}>
                    <Text style={styles.allAssetLeft}>我的订单</Text>
                    <TouchableOpacity activeOpacity={0.7} style={{height:30,alignItems:'center',justifyContent:'center'}} onPress={() => this.props.dispatch(goto('MyOrder'))}>
                        <Text style={styles.moreAssetRight}>全部订单</Text>
                    </TouchableOpacity>
                </View>
                <View style={CommonStyles.vline}/>
                <View style={styles.orderContainer}>
                    {this.orderItem("待付款", ic_order_wait_pay,userInfo.orderCreated)}
                    {this.orderItem("待发货", ic_order_wait_delivery, userInfo.orderApproved)}
                    {this.orderItem("待收货", ic_order_wait_received, userInfo.orderSent)}
                    {this.orderItem("待评价", ic_order_wait_comment, userInfo.orderAppraise)}
                    {this.orderItem("退款/售后", ic_order_customer_service, 0)}
                </View>
            </View>

        )
    }

    gotoOrder(orderStatusName) {
        if (orderStatusName === '退款/售后') {
            this.props.dispatch(goto('CustomerService'));
        } else if (orderStatusName === '待付款') {
            this.props.dispatch(goto('MyOrder', {orderType: ORDER_CREATED}));
        } else if (orderStatusName === '待发货') {
            this.props.dispatch(goto('MyOrder', {orderType: ORDER_APPROVED}));
        } else if (orderStatusName === '待收货') {
            this.props.dispatch(goto('MyOrder', {orderType: ORDER_SENT}));
        } else if (orderStatusName === '待评价') {
            this.props.dispatch(goto('MyOrder', {orderType: ORDER_APPRAISE}));
        }
    }

    orderItem(orderStatusName, img, orderCount) {
        let orderCountView = (orderCount === 0 || orderCount === '' || orderCount === undefined) ? null : (<View style={{alignItems: 'center'}}>
            <View style={styles.orderItemCount}>
                <Text style={{
                    color: 'white',
                    fontSize: 10,
                    marginTop: -3,
                    alignItems: 'center',
                    backgroundColor: '#00000000',
                }}>{orderCount}</Text>
            </View>
        </View>);
        return <View style={{flex: 1, alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={0.7} style={styles.orderItem}
                              onPress={() => this.gotoOrder(orderStatusName)}>
                <View style={{width: 70, flexDirection: 'row', justifyContent: 'center'}}>
                    <XImage style={styles.orderItemImage}
                           source={img}/>
                    {orderCountView}
                </View>
                <Text numberOfLines={1} style={styles.orderItemText}>{orderStatusName}</Text>
            </TouchableOpacity>
        </View>;
    }
}

const styles = StyleSheet.create({
    orderContainer: {
        flex: 1,
        height: 100,
        flexDirection: 'row',
    },
    orderItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderItemImage: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    orderItemText: {
        backgroundColor:'#00000000',
        color: titleTextColor,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        marginTop: 5,
    },
    orderItemCount: {
        borderRadius: 8,
        minWidth: 16,
        minHeight: 16,
        backgroundColor: mainColor,
        marginTop: -3,
        paddingLeft: 3,
        paddingRight: 3,
        alignItems: 'center',
        justifyContent:'center',
        position: 'absolute',
    },
    orderBg:{
        position:'absolute',
        bottom:0,
        width:width - 20,
        height:(width - 20)*0.15129,
        borderRadius:5
    },
    allAsset: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
    },
    allAssetLeft: {
        paddingLeft: 10,
        flex: 1,
        color: 'black',
        fontSize: 15
    },
    moreAssetRight: {
        marginRight: 10,
        color: '#65BCFE',
        fontSize: 13
    },
})

export default connect()(OrderComponent);