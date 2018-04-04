import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

import {connect} from 'react-redux';
import {goto} from '../../../../reducers/RouterReducer';
import {showToastShort} from "../../../../common/CommonToast";
import {post,isSuccess} from "../../../../common/CommonRequest";
import {
    contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor, priceColor,
} from "../../../../constraint/Colors";
import {
    BALANCE_ACCOUNT, PAYMENTS_CONFIG,
} from "../../../../constraint/AssetsType";
import {formatMoney} from "../../../../common/StringUtil";
import {OIL_CARD} from "../../../../constraint/ProductType";
import {removeShoppingCartProductList} from "../../../../reducers/ShoppingCartReducer";

class IntegralMessage extends Component {

    constructor(props) {
        super(props);
        this.product = null;
        this.newOrderPays = [];
        this._initOrderPayment(this.props.product, this.props.totalPrice);
        this.state = {
            user_message: '',
        };

        this.products = this.props.products;
    }

    _initOrderPayment = (productList, totalPrice) => {

        productList.map(productItem => {
            this.props.data.productSkus.map(skusItem => {
                if (productItem.productSkuId === skusItem.id) {
                    skusItem.quantity = productItem.quantity;
                }
            })
        });
        this.props.data.productSkus.map(productSkuItem => {
            productSkuItem.productSkuPayWays.map((skuPayWayItem) => {
                let paymentConfigItem = PAYMENTS_CONFIG[skuPayWayItem.accountType];
                let find = false;
                for (let payItem of this.newOrderPays) {
                    if (payItem.accountType === skuPayWayItem.accountType) {
                        payItem.price += parseFloat(skuPayWayItem.maxPay * paymentConfigItem.ratio * productSkuItem.quantity);
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    let {accountType} = skuPayWayItem;
                    this.newOrderPays.push({
                        name: paymentConfigItem.name,
                        accountType,
                        price: parseFloat(skuPayWayItem.maxPay * paymentConfigItem.ratio * productSkuItem.quantity),
                        ratio: paymentConfigItem.ratio,
                    });
                }
            });
        });

        let account = {}
        this.props.data.accounts.map(item => Object.assign(account, {[item.accountType]: item.available}));

        let finalPaymentPrice = totalPrice;
        this.newOrderPays.map((item, index) => {
            if (this.newOrderPays.length === 1) {
                item.price = totalPrice * item.ratio;
            } else {
                if (index < (this.newOrderPays.length - 1)) {
                    if (Number(account[item.accountType]) < Number(item.price)) {
                        item.price = account[item.accountType] * item.ratio;
                        finalPaymentPrice -= account[item.accountType] / item.ratio;
                    } else {
                        if (Number(finalPaymentPrice) < Number(item.price)) {
                            item.price = finalPaymentPrice;
                            finalPaymentPrice -= item.price / item.ratio;
                        }
                        else {
                            finalPaymentPrice -= item.price / item.ratio;
                        }
                    }
                } else {
                    item.price = finalPaymentPrice * item.ratio;
                }
            }
        });
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.product !== this.product) {
            this.product = nextProps.product;
            this.newOrderPays = [];
            this._initOrderPayment(this.product, nextProps.totalPrice);
        }
    }

    render() {
        let {totalAmount, totalPrice, data, product} = this.props;
        this.product = product;
        return (
            <View>
                <View style={{
                    flexDirection: 'row',
                    height: 50,
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}>
                    <Text style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: contentTextColor
                    }}>{'合计:共' + totalAmount + '件'}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={{
                        marginRight: 10,
                        fontSize: 15,
                        color: priceColor
                    }}>{formatMoney(totalPrice)}</Text>
                </View>
                <View style={{
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: placeholderTextColor,
                    height: 0.5
                }}/>
                {/*<View>*/}
                    {/*<Text style={{*/}
                        {/*padding: 10,*/}
                        {/*paddingTop: 15,*/}
                        {/*fontSize: 14,*/}
                        {/*color: contentTextColor*/}
                    {/*}}>{'买家留言:'}</Text>*/}
                    {/*<View style={{*/}
                        {/*marginLeft: 10,*/}
                        {/*marginRight: 10,*/}
                        {/*padding: 3,*/}
                        {/*borderWidth: 0.5,*/}
                        {/*borderColor: placeholderTextColor,*/}
                        {/*borderRadius: 3,*/}
                        {/*backgroundColor: mainBackgroundColor*/}
                    {/*}}>*/}
                        {/*<TextInput*/}
                            {/*underlineColorAndroid='transparent'*/}
                            {/*style={{*/}
                                {/*padding: 0,*/}
                                {/*fontSize: 13,*/}
                                {/*height: 50,*/}
                                {/*textAlignVertical: 'top'*/}
                            {/*}}*/}
                            {/*multiline={true}*/}
                            {/*autoCapitalize="none"*/}
                            {/*maxLength={50}*/}
                            {/*placeholder="留下您需要针对于商品的订单需求..."*/}
                            {/*placeholderTextColor={placeholderTextColor}*/}
                            {/*onChangeText={(user_message) => this.setState({user_message})}*/}
                        {/*/>*/}
                        {/*<View style={{flexDirection: 'row', height: 20}}>*/}
                            {/*<View style={{flex: 1}}/>*/}
                            {/*<Text style={{*/}
                                {/*paddingRight: 5,*/}
                                {/*fontSize: 13,*/}
                                {/*color: placeholderTextColor*/}
                            {/*}}>{(50 - this.state.user_message.length) + '/50'}</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                {/*</View>*/}

                {
                    data.accounts === null ? <View/> : data.accounts.map((item, index) => {
                        return <Text
                            key={index}
                            style={{
                                marginLeft: 10,
                                marginRight: 10,
                                marginTop: 10,
                                fontSize: 14,
                                color: contentTextColor,
                            }}>{item.accountName + '：' + formatMoney(item.available, false)}</Text>
                    })
                }
                <View style={{
                    marginTop: 15,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    backgroundColor: placeholderTextColor,
                    height: 0.5
                }}/>

                {
                    this.newOrderPays.map((item, index) => {
                        return <View key={index} style={{marginTop: 5,}}>
                            <Text style={{
                                marginLeft: 10,
                                marginBottom: (item.minRange === item.maxRange) ? 5 : 10,
                                color: contentTextColor
                            }}>
                                使用{item.name}:{formatMoney(item.price, false)}
                            </Text>
                        </View>
                    })
                }

                <Text style={{
                    marginLeft: 10,
                    marginRight: 10,
                    fontSize: 14,
                    color: contentTextColor,
                    lineHeight: 25,
                }}>{'使用运费:' + formatMoney(data.postage)}</Text>
                {/*'使用余额:' + (totalPrice - this.state.useIntegral).toFixed(2) + '\n' +*/}
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        marginTop: 30,
                        marginLeft: 40,
                        marginRight: 50,
                        marginBottom: 30,
                        height: 40,
                        backgroundColor: mainColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5
                    }}
                    onPress={
                        this._createOrder.bind(this)
                    }>
                    <Text style={{
                        color: 'white',
                        fontSize: 15,
                    }}>{'前往支付'}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    //创建订单
    _createOrder = () => {

        let {data, address = {}} = this.props;

        if (!address.id) {
            showToastShort('收货地址不能为空');
            return;
        }

        // address = Object.assign({}, address, {memberComment: this.state.user_message});

        let submitData = [];
        this.newOrderPays.map((item) => {
            submitData.push({accountType: item.accountType, amount: Number(item.price)})
        });

        let findBalance = false;
        for (let item of submitData) {

            if (item.accountType === BALANCE_ACCOUNT && parseFloat(data.postage) !== 0) {
                item.amount += Number(data.postage);
                findBalance = true;
                break;
            }
        }

        if (!findBalance && parseFloat(data.postage) !== 0) {
            submitData.push({accountType: BALANCE_ACCOUNT, amount: data.postage})
        }

        submitData.map((item) => item.amount = item.amount.toFixed(2));

        for (let item of submitData) {
            for (let status of data.accounts) {
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

        let {product} = this.props;
        let requestObj = {
            'products': product,
            'address': address,
            'orderPays': submitData,
            token: this.props.token,
            removeShoppingCart:this.props.removeShoppingCart
        };
        let url = this.products.type === OIL_CARD ? 'order/oilCard/createOrder' : 'order/createOrder';
        post(url, requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let shoppingCartItemIds = [];
                    product.map(item=>{shoppingCartItemIds.push(item.productSkuId)});;
                    this.props.dispatch(removeShoppingCartProductList(shoppingCartItemIds));
                    this.props.dispatch(goto('PaymentDetail', {orderId: responseData.result.id}))
                } else {
                    this.errMsg(responseData.message)
                }
            }).catch((e) => {
            this.errMsg(e.message);
        });

    };

    errMsg(msg) {
        showToastShort(msg);
    }

}

selector = (state) => {
    return {
        token: state.loginStore.token,
        totalAmount: state.cacheStore.defaultTotalAmount,
        totalPrice: state.cacheStore.defaultTotalPrice,
        address: state.cacheStore.defaultAddress,
        product: state.cacheStore.defaultProduct,
    }
};

export default connect(selector)(IntegralMessage);

