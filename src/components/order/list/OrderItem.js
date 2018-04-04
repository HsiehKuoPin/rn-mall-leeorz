/**
 * Created by lan on 2017/11/15.
 */
import React, {Component} from 'react';
import {
    Image,
    View,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Text,
    StyleSheet,
} from "react-native";

import OrderItemBottom from './OrderItemBottom'
import {
    titleTextColor,
    placeholderTextColor,
    mainColor,
    content2TextColor, priceColor,
} from "../../../constraint/Colors";

import {
    emptyImgUrl,
    ic_right_arrows
} from "../../../constraint/Image";
import {connect} from "react-redux";
import {goto} from "../../../reducers/RouterReducer";
import {getOrderStatusText, ORDER_COMBO} from "../../../constraint/OrderType";
import XImage from "../../../widgets/XImage";
import {formatMoney} from "../../../common/StringUtil";

const screenW = Dimensions.get('window').width;

/**
 * 封装我的订单 公共部分
 */
class OrderItemComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data} = this.props;
        // let contentView = data.orderItems.length > 1?(<MultiProductView data={data.orderItems}/>):(<SingleProductView data={data.orderItems[0]}/>);
        let contentView = null;
        if (data.orderItems.length > 1) {
            contentView = data.orderType === ORDER_COMBO ? <SingleProductView data={data}/> :
                <MultiProductView data={data}/>
        } else if (data.orderItems.length === 1) {
            contentView = <SingleProductView data={data}/>
        }
        return (

            <TouchableOpacity activeOpacity={0.7}
                              style={styles.cellStyle}
                              onPress={() => this.props.dispatch(goto('OrderDetail', {orderId: data.id}))}>
                <View style={{justifyContent: 'space-between', flexDirection: "row"}}>
                    <Text style={styles.orderStoreName}>{data.merchant}</Text>
                    <Text style={styles.orderStatusTip}>{getOrderStatusText(data.status)}</Text>
                </View>
                {contentView}
                <OrderItemBottom order={data}/>
            </TouchableOpacity>
        )
    }
}

/**
 * 多个商品
 */
class MultiProductView extends Component {
    constructor(props) {
        super(props);
    }

    _renderItem(item) {
        return (<View>
            <TouchableOpacity disabled={true}>
                <View style={[styles.productImageLayout, {margin: 5}]}>
                    <Image source={{uri: item.imgUrl ? item.imgUrl : emptyImgUrl}}
                           style={styles.productImage}/>
                </View>
                <View style={styles.productCount}>
                    <Text style={{
                        color: 'white',
                        fontSize: 12,
                        alignItems: 'center',
                        backgroundColor: '#00000000',
                    }}>{item.quantity}</Text>
                </View>

            </TouchableOpacity>
        </View>);
    }

    render() {
        let {data} = this.props;
        return (
            <View>
                <View style={styles.line}/>
                <FlatList
                    style={{margin: 10}}
                    data={data.orderItems}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    renderItem={({item, index}) =>
                        this._renderItem(item)
                    }
                />

                <View style={styles.line}/>
                <View style={{justifyContent: 'space-between', flexDirection: "row", marginVertical: 10}}>
                    <View style={{flex: 1}}/>
                    <Text style={styles.multiProductBottomInfo}>共{data.quantity}件商品 合计<Text
                        style={styles.price}>￥{data.amount}</Text></Text>
                </View>
                <View style={styles.line}/>
            </View>
        )
    }
}


/**
 * 单个商品
 */
class SingleProductView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data} = this.props;
        let itemData = data.orderItems[0];
        let skuArr = data.orderType === ORDER_COMBO ? [] : itemData.productSkuSpecProperty.split(',');
        return (
            <View>
                <View style={styles.line}/>
                <View style={{flexDirection: 'row', paddingVertical: 10, paddingLeft: 10, alignItems: 'center'}}>
                    <View style={styles.productImageLayout}>
                        <XImage uri={data.orderType === ORDER_COMBO ? data.imgUrl : itemData.imgUrl}
                                style={styles.productImage}/>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{marginLeft: 10, flex: 1,}}>
                            <Text style={styles.singleProductName}
                                  numberOfLines={1}>{data.orderType === ORDER_COMBO ? data.merchant : itemData.productName}</Text>
                            <View style={{flex: 1}}>
                                {skuArr.map((item, index) => <Text key={index}
                                                                   style={styles.singleProductSku}>{item}</Text>)}
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5}}>
                                <Text style={{fontSize: 14, color: priceColor, flex: 1}}
                                      numberOfLines={1}>{formatMoney(data.orderType === ORDER_COMBO ? data.amount : itemData.amount)}</Text>
                                <Text style={{fontSize: 16, color: '#333333'}}
                                      numberOfLines={1}>x {data.orderType === ORDER_COMBO ? data.quantity : itemData.quantity}</Text>
                            </View>
                        </View>
                    </View>
                    <Image source={ic_right_arrows} style={styles.rightArrowsStyle}/>
                </View>
                <View style={styles.line}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    flatListStyle: {
        backgroundColor: '#f1f1f1',
    },
    line: {
        backgroundColor: placeholderTextColor,
        height: 0.5,
        marginHorizontal: 10
    },
    cellStyle: {
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 4, width: 4},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    viewStyle: {
        width: screenW - 20,
        height: 140,
        justifyContent: 'center',
    },
    rightArrowsStyle: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        marginRight: 10,
        padding: 5,
    },
    productCount: {
        borderRadius: 10,
        minWidth: 20,
        minHeight: 20,
        backgroundColor: mainColor,
        paddingLeft: 3,
        paddingRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
    },
    price: {
        fontSize: 16,
        color: priceColor,
        marginVertical: 5,
        marginRight: 5
    },
    multiProductBottomInfo: {
        color: titleTextColor,
        fontSize: 16,
        paddingRight: 10,
    },
    singleProductSku: {
        marginTop: 3,
        fontSize: 12,
        color: content2TextColor
    },
    singleProductName: {
        fontSize: 14,
        color: titleTextColor,
        marginBottom: 3
    },
    productImageLayout: {
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        marginLeft: 10,
        width: (screenW - 26) / 4.5,
        height: (screenW - 26) / 4.5,

    },
    productImage: {
        borderRadius: 3,
        width: (screenW - 30) / 4.5,
        height: (screenW - 30) / 4.5,
        // resizeMode: 'contain'
        resizeMode: 'cover'
    },
    orderStoreName: {
        backgroundColor: '#00000000',
        color: '#181818',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    orderStatusTip: {
        backgroundColor: '#00000000',
        fontSize: 14,
        color: mainColor,
        paddingHorizontal: 10,
        paddingVertical: 10
    }
});


export default connect()(OrderItemComponent);