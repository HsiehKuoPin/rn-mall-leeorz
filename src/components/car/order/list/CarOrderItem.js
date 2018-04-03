/**
 * Created by lan on 2017/11/15.
 */
import React, {Component} from 'react';
import {
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import {connect} from 'react-redux';
import {goto} from '../../../../reducers/RouterReducer';
const screenW = Dimensions.get('window').width;
import {titleTextColor, placeholderTextColor, contentTextColor, mainColor} from "../../../../constraint/Colors";
import {
    complete_the_lift, ic_advanced,
    ic_break_promise,
    ic_right_arrows
} from "../../../../constraint/Image";
import XImage from "../../../../widgets/XImage";
import {
    getCarOrderStatusText,
    MENTION_THE_PREMISE_CAR, ORDER_COMPLETED, ORDER_HAS_DEFAULTED,
    ORDER_HAS_PAYMENT
} from "../../../../constraint/OrderType";
import {isIPhone5} from "../../../../common/AppUtil";
import {formatMoney} from "../../../../common/StringUtil";

class CarOrderItem extends Component {

    render() {
        let item = this.props.data;
        // let listState = this.props.listState;
        let specificationArray = item.productSkuSpecProperty.split(',');

        let carOrderList = (
            <View style={styles.viewStyle}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.props.dispatch(goto('OrderCarDetail', item.id))}>
                    <View style={{marginTop:12}}>
                        <Text style={styles.carBuying}>{getCarOrderStatusText(item.orderStatus)}</Text>
                    </View>
                    <Text style={{backgroundColor: placeholderTextColor, height: 0.5, marginHorizontal: 10,marginTop:12}}/>

                    <View style={{flexDirection: 'column',paddingBottom:15}}>
                        <Text numberOfLines={1} style={styles.nameStyle}>{item.productName}</Text>
                        <View style={{flexDirection: 'row',}}>
                            <View style={styles.leftStyle}>
                                <Text numberOfLines={1} style={styles.unifiedStyle}>{'商品总价:' + formatMoney(item.amount,false)}</Text>
                                <Text numberOfLines={1} style={styles.unifiedStyle}>{'订单号:' + item.id}</Text>
                                <Text numberOfLines={1} style={styles.unifiedStyle}>{'下单时间:' + item.createTime}</Text>
                                {specificationArray.map((item, index) => {return (<Text style={styles.unifiedStyle} key={index}>{item}</Text>)})}
                            </View>

                            <View style={styles.rightStyle}>
                                <XImage uri={item.imgUrl}
                                        style={styles.imageStyle}/>
                                <Image source={ic_right_arrows} style={styles.rightArrowsStyle}/>
                                {/*<View style={{flex: 1, alignItems: 'flex-start',}}>{*/}
                                {/*item.orderPays.map((item, index) => {*/}
                                {/*return (<Text style={{*/}
                                {/*fontSize: 15,*/}
                                {/*marginLeft: -30,*/}
                                {/*color: mainColor,*/}
                                {/*marginTop:10,*/}
                                {/*}} key={index}>{item}</Text>)*/}
                                {/*})*/}
                                {/*}*/}
                                {/*</View>*/}
                            </View>
                        </View>
                    </View>


                    {item.orderStatus === ORDER_HAS_PAYMENT? (
                        //支付尾款
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => this.props.dispatch(goto('CartFinalPaymentDetail', {orderId:item.id}))}>
                            <View style={{
                                borderRadius: 5, marginHorizontal: 30, paddingVertical: 10, marginTop: 15,
                                marginBottom: 20, backgroundColor: mainColor
                            }}>
                                <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
                                    支付尾款
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : this._orderStatus(item.orderStatus,item.operStatus)}
                </TouchableOpacity>
            </View>
        );

        return (
            <View style={{flex: 1}}>
                {carOrderList}
            </View>
        );
    }

    _orderStatus(status,operStatus){
        return<Image source={status === ORDER_HAS_DEFAULTED ? ic_break_promise : status === ORDER_COMPLETED ? (operStatus === MENTION_THE_PREMISE_CAR ? ic_advanced : complete_the_lift) : null}
                     style={{
                         marginLeft: isIPhone5() ? screenW * 0.6 : screenW * 0.7,
                         width: 100,
                         height: 100,
                         resizeMode: 'contain',
                         marginTop: -20,
                         position: 'absolute'
                     }}/>
    };
}

const styles = StyleSheet.create({
    viewStyle: {
        marginTop:5,
        marginBottom:5,
        marginHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 5,
        shadowOpacity: 0.2,
        elevation: 2,
        flex: 1,
    },

    rightStyle: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },

    leftStyle: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
    },

    imageStyle: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },

    nameStyle: {
        fontSize: 18,
        color: titleTextColor,
        marginTop: 12,
        marginHorizontal: 10,
        flex: 1,
    },
    unifiedStyle: {
        fontSize: 15,
        color: contentTextColor,
        marginTop: 10,
    },
    carBuying: {
        color: titleTextColor,
        fontSize: 16,
        paddingHorizontal: 10,
    },
    rightArrowsStyle: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 10,
        // marginTop:85
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default connect()(CarOrderItem);