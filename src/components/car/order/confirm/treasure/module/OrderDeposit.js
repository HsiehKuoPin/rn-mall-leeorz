import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';

import {connect} from 'react-redux';
import {mainColor, placeholderTextColor, titleTextColor} from "../../../../../../constraint/Colors";
import {formatMoney} from "../../../../../../common/StringUtil";
import XImage from "../../../../../../widgets/XImage";
import {ic_right_arrows} from "../../../../../../constraint/Image";
import {PAYMENTS_CONFIG} from "../../../../../../constraint/AssetsType";
import CarTypeDialog from "../CarTypeDialog"
import {goto} from "../../../../../../reducers/RouterReducer";
import {CAR_TREASURE_TO_ORDER} from "../../../../../../constraint/ProductType";
import {showToastShort} from "../../../../../../common/CommonToast";
import IphoneModel from "../../../../../../widgets/IphoneModel";

const width = Dimensions.get('window').width;

class OrderDeposit extends Component {
    constructor(props) {
        super(props);
        this.newOrderTypes = [];
        this._initOrderPayment();
        this.state = {
            selectOrderType: this.newOrderTypes.length > 0 ? this.newOrderTypes[0] : {}
        };
    };

    _initOrderPayment = () => {
        this.props.data.productSkus.map(productSkuItem => {
            let newOrderPays = [];
            productSkuItem.productSkuPayWays.map((skuPayWayItem) => {
                let paymentConfigItem = PAYMENTS_CONFIG[skuPayWayItem.accountType];
                let totalPrice = productSkuItem.salePrice;
                let {accountType} = skuPayWayItem;
                newOrderPays.push({
                    name: paymentConfigItem.name,
                    accountType,
                    amount: parseFloat(skuPayWayItem.maxRatio * 0.01 * paymentConfigItem.ratio * totalPrice).toFixed(2),
                    ratio: paymentConfigItem.ratio,
                });
            });
            this.newOrderTypes.push({
                'productName': productSkuItem.productName,
                'imgUrl': productSkuItem.imgUrl,
                'salePrice': productSkuItem.salePrice,
                'productSkuId': productSkuItem.id,
                'newOrderPays': newOrderPays
            })

            this.newOrderTypes.map(orderItem => {
                let amount = 0;
                for (let item of orderItem.newOrderPays) {
                    amount += Number(item.amount);
                }
                Object.assign(orderItem, {'depositPrice': Number(amount).toFixed(2)})
            })
        });
    }

    componentWillReceiveProps() {
        this.newOrderPays = [];
        this._initOrderPayment();

    }

    /**
     * 获取积分数据
     * @returns {null}
     * @private
     */
    _getIntegralView() {
        if (!this.state.selectOrderType.newOrderPays) return null;
        let result = [];
        this.state.selectOrderType.newOrderPays.map((item, index) => {
            result.push(<View key={index}>
                <View style={styles.lineStyle}/>
                <View style={styles.viewStyle}>
                    <Text style={styles.leftTextStyle}>{item.name}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.rightTextStyle}>{formatMoney(item.amount, false)}</Text>
                </View>
            </View>)
        });
        return result;
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.backgroundStyle}>
                        {
                            this.props.data === null ? [] : this.props.data.accounts.map((item, index) => {
                                return <View key={index}>
                                    <View style={[styles.lineStyle, {height: index === 0 ? 0 : 0.5}]}/>
                                    <View
                                        style={styles.viewStyle}>
                                        <Text
                                            style={styles.leftTextStyle}>{item.accountName}</Text>
                                        <View style={{flex: 1}}/>
                                        <Text
                                            style={styles.rightTextStyle}>{formatMoney(item.available, false)}</Text>
                                    </View>
                                </View>
                            })
                        }
                    </View>
                    <View style={[styles.backgroundStyle, {marginBottom: 10}]}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.viewStyle} onPress={() => {
                            this.refs.CarTypeDialog.show()
                        }}>
                            <Text style={styles.leftTextStyle}>汽车型号</Text>
                            <View style={{flex: 1}}/>
                            <Text style={{
                                marginRight: 10,
                                fontSize: 14,
                                textAlign: 'right',
                                color: titleTextColor,
                                marginLeft: 10,
                                width: width - 20 - 30 - 70 - 20,
                            }} numberOfLines={1}>{this.state.selectOrderType.productName}</Text>
                            <XImage style={{width: 7, height: 15}} source={ic_right_arrows}/>
                        </TouchableOpacity>
                        <View style={styles.lineStyle}/>
                        <View style={styles.viewStyle}>
                            <Text style={styles.leftTextStyle}>价格</Text>
                            <View style={{flex: 1}}/>
                            <Text
                                style={styles.rightTextStyle}>{formatMoney(this.state.selectOrderType.salePrice)}</Text>
                        </View>
                        <View style={styles.lineStyle}/>
                        <View style={styles.viewStyle}>
                            <Text style={styles.leftTextStyle}>定金</Text>
                            <View style={{flex: 1}}/>
                            <Text
                                style={styles.rightTextStyle}>{formatMoney(this.state.selectOrderType.depositPrice)}</Text>
                        </View>
                        {this._getIntegralView()}
                    </View>
                    <CarTypeDialog data={this.newOrderTypes} ref={'CarTypeDialog'}
                                   selectItem={(item) => {
                                       this.setState({selectOrderType: item})
                                   }}/>
                </ScrollView>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.buttonStyle}
                    onPress={() => {
                        for (let item of this.state.selectOrderType.newOrderPays) {
                            for (let status of this.props.data.accounts) {
                                if (status.accountType === item.accountType) {
                                    if (Number(item.amount).toFixed(2) < 0) {
                                        showToastShort(status.accountName + '异常');
                                        return;
                                    }
                                    else if (Number(status.available) < Number(item.amount)) {
                                        showToastShort(status.accountName + '不足');
                                        return;
                                    }
                                }
                            }
                        }
                        this.props.dispatch(goto('CartDepositPaymentDetailView', {
                            orderData: {
                                orderPays: this.state.selectOrderType.newOrderPays,
                                productSkuId: this.state.selectOrderType.productSkuId,
                                totalPrice: this.state.selectOrderType.depositPrice,
                                payType: CAR_TREASURE_TO_ORDER
                            }
                        }))
                    }}>
                    <Text style={{paddingVertical: 12, fontSize: 15, color: 'white'}}>立即下定</Text>
                </TouchableOpacity>
                <IphoneModel/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    backgroundStyle: {
        margin: 10,
        marginBottom: 0,
        backgroundColor: 'white',
        borderRadius: 6,
        shadowColor: '#c7c7c7',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 15,
        marginLeft: 15,
        marginRight: 15,
    },
    lineStyle: {
        marginLeft: 15,
        marginRight: 15,
        backgroundColor: placeholderTextColor,
        height: 0.5
    },
    leftTextStyle: {
        fontSize: 14,
        color: titleTextColor,
    },
    rightTextStyle: {
        fontSize: 14,
        color: titleTextColor,
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainColor,
        elevation: 5
    }
});

export default connect()(OrderDeposit);