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
import {
    ic_evaluated, ic_delivered, ic_not_pay, ic_refund, ic_waiting,
    ic_my_orderBG
} from "../../../../../constraint/Image";
import {goto} from "../../../../../reducers/RouterReducer";
import {connect} from 'react-redux';
import {ORDER_APPRAISE, ORDER_APPROVED, ORDER_CREATED, ORDER_SENT} from "../../../../../constraint/OrderType";
import XImage from "../../../../../widgets/XImage";
import TintImage from "../../../../../widgets/TintImage";

let {width} = Dimensions.get('window');
class OrderComponent extends Component {
    render() {
        let {userInfo} = this.props;
        return (
            <View style={styles.orderContainer}>
                <Image source={{uri:ic_my_orderBG}} style={styles.orderBg}/>
                {this.orderItem("待付款", ic_not_pay,userInfo.orderCreated)}
                {this.orderItem("待发货", ic_waiting, userInfo.orderApproved)}
                {this.orderItem("待收货", ic_delivered, userInfo.orderSent)}
                {this.orderItem("待评价", ic_evaluated, userInfo.orderAppraise)}
                {this.orderItem("退款/售后", ic_refund, 0)}
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
                    <TintImage style={styles.orderItemImage}
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
    }
})

export default connect()(OrderComponent);