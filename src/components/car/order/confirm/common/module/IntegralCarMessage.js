import React, {Component} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {
    content2TextColor, contentTextColor, mainBackgroundColor, mainColor,
    placeholderTextColor, titleTextColor
} from "../../../../../../constraint/Colors";
import {ic_n_drop_down, ic_selected, ic_un_selected} from "../../../../../../constraint/Image";
import {showToastShort} from "../../../../../../common/CommonToast";
import {
    BALANCE_ACCOUNT, JADE_INTEGRAL_ACCOUNT, PAYMENTS_CONFIG,
} from "../../../../../../constraint/AssetsType";
import XImage from "../../../../../../widgets/XImage";
import {checkInputMoney, formatMoney} from "../../../../../../common/StringUtil";
import JadeIntegralDialog from "../JadeIntegralDialog"

var data = null;

class IntegralCarMessage extends Component {

    constructor(props) {
        super(props);
        data = this.props.data;

        this.newOrderPays = [];
        this.jadeData = [];
        this.totalPrice = 0;
        for (let item of data.productSkus) {
            this.totalPrice += item.salePrice;
        }
        let inputValue = this._initOrderPayment(this.totalPrice);

        this.state = {
            payDisable: true,
            selectItem: null,
            ...inputValue
        };
    }

    _initOrderPayment = (totalPrice) => {
        this.props.data.productSkus.map(productSkuItem => {
            productSkuItem.productSkuPayWays.map((skuPayWayItem) => {
                let paymentConfigItem = PAYMENTS_CONFIG[skuPayWayItem.accountType];
                let find = false;
                if (skuPayWayItem.accountType === JADE_INTEGRAL_ACCOUNT) {
                    let number = skuPayWayItem.minRatio % 10 === 0 ? skuPayWayItem.minRatio : Math.ceil(skuPayWayItem.minRatio / 10) * 10
                    for (let i = number; i <= skuPayWayItem.maxRatio; i = i + 10) {
                        this.jadeData.push({
                            'ratio': i, 'price': parseFloat(i * totalPrice * 0.01)
                        })
                    }
                }
                for (let payItem of this.newOrderPays) {
                    if (payItem.accountType === skuPayWayItem.accountType) {
                        payItem.minRange = parseFloat(skuPayWayItem.minRatio * 0.01 * productSkuItem.salePrice * paymentConfigItem.ratio);
                        payItem.maxRange = parseFloat(skuPayWayItem.maxRatio * 0.01 * productSkuItem.salePrice * paymentConfigItem.ratio);
                        find = true;
                        break;
                    }
                }
                if (!find) {
                    let {accountType, maxRatio, minRatio, inputValue} = {...skuPayWayItem, inputValue: ''};
                    this.newOrderPays.push({
                        name: paymentConfigItem.name,
                        accountType,
                        maxRange: parseFloat(maxRatio * 0.01 * productSkuItem.salePrice * paymentConfigItem.ratio),
                        minRange: parseFloat(minRatio * 0.01 * productSkuItem.salePrice * paymentConfigItem.ratio),
                        inputValue,
                        ratio: paymentConfigItem.ratio,
                    });
                }
                this.newOrderPays.map((item, index) => {
                    if (item.accountType === BALANCE_ACCOUNT) {
                        this.newOrderPays.splice(index, 1);
                        this.newOrderPays.push(item);
                    }
                })
            });
        });

        let lastPaymentValue = totalPrice;
        this.newOrderPays.map((item, index) => {
            if (index === (this.newOrderPays.length - 1)) {
                Object.assign(item, {editable: false, inputValue: (lastPaymentValue * item.ratio).toFixed(2)})
            } else {
                lastPaymentValue = lastPaymentValue - item.minRange / item.ratio;
                Object.assign(item, {editable: (item.maxRange !== item.minRange), inputValue: item.minRange.toFixed(2)})
            }
        });

        let inputValue = {};
        this.newOrderPays.map((item, index) => Object.assign(inputValue, {[item.accountType + '_InputValue']: item.inputValue}));
        return inputValue;
    };

    _renderInputValue(item) {
        if (item.minRange !== item.maxRange) {
            return <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10,}}>
                <Text style={{
                    marginRight: 5,
                    color: contentTextColor,
                    letterSpacing: 0,
                }}>
                    {/*{parseFloat(item.minRatio * totalPrice * item.ratio).toFixed(2) + '≤'}*/}
                    {formatMoney(item.minRange, false) + '≤'}
                </Text>
                <View style={{
                    borderWidth: 0.5,
                    borderColor: placeholderTextColor,
                    borderRadius: 3,
                    height: 30,
                    backgroundColor: mainBackgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TextInput
                        underlineColorAndroid='transparent'
                        style={{
                            textAlign: 'center',
                            padding: 3,
                            fontSize: 14,
                            minWidth: 80,
                            color: item.editable ? titleTextColor : content2TextColor
                        }}
                        autoCapitalize="none"
                        keyboardType='numeric'
                        editable={item.editable}
                        value={this.state[item.accountType + '_InputValue'] + ''}
                        onChangeText={(text) => {
                            item.inputValue = checkInputMoney(text);
                            let totalIntegral = 0;
                            this.newOrderPays.map((item, index) => {
                                if (index !== this.newOrderPays.length - 1) {
                                    totalIntegral += Number(item.inputValue / item.ratio)
                                }
                            });

                            let finalOrderPaysItem = this.newOrderPays[this.newOrderPays.length - 1];
                            finalOrderPaysItem.inputValue = (this.totalPrice - totalIntegral) * finalOrderPaysItem.ratio;

                            this.setState({
                                ...this.state,
                                [item.accountType + '_InputValue']: item.inputValue,
                                [finalOrderPaysItem.accountType + '_InputValue']: finalOrderPaysItem.inputValue.toFixed(2),
                            });
                        }}
                        onEndEditing={(event) => {
                            if (item.inputValue.length === 0) {
                                this.setState({[item.accountType + '_InputValue']: '0.00'});
                                return;
                            }
                            if (item.minRange > item.inputValue || item.inputValue > item.maxRange) {
                                showToastShort(`输入的${item.name}已经超出范围`);
                                item.inputValue = '0.00';
                                let totalIntegral = 0;
                                this.newOrderPays.map((item, index) => {
                                    if (index !== this.newOrderPays.length - 1) {
                                        totalIntegral += Number(item.inputValue / item.ratio)
                                    }
                                });

                                let finalOrderPaysItem = this.newOrderPays[this.newOrderPays.length - 1];
                                finalOrderPaysItem.inputValue = (this.totalPrice - totalIntegral) * finalOrderPaysItem.ratio;
                                this.setState({
                                    ...this.state,
                                    [item.accountType + '_InputValue']: '0.00',
                                    [finalOrderPaysItem.accountType + '_InputValue']: finalOrderPaysItem.inputValue.toFixed(2),
                                })
                            }

                        }}>
                    </TextInput>
                </View>
                <Text style={{
                    marginLeft: 5,
                    color: contentTextColor
                }}>
                    {'≤' + formatMoney(item.maxRange, false)}
                </Text>
            </View>

        }
        return null
    }

    //渲染积分输入框
    _renderIntegralInputLayout() {
        let inputLayoutArr = [];
        this.newOrderPays.map((item, index) => {
            inputLayoutArr.push(<View key={index} style={{marginTop: 10,}}>
                <Text
                    style={{
                        marginLeft: 10,
                        marginBottom: (item.minRange === item.maxRange) ? 0 : 5,
                        color: contentTextColor,
                        fontSize: 14,
                    }}>
                    使用{item.name}：{(item.minRange === item.maxRange) ? formatMoney(this.state[item.accountType + '_InputValue'], false) : ''}
                </Text>
                {(item.name === '玉积分' && this.newOrderPays.length - 1 !== index) ? this._renderText(item) : this._renderInputValue(item)}
            </View>)
        });

        return inputLayoutArr;
    }

    _renderText(item) {
        return <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 10,
            marginTop: 5,
            borderWidth: 0.5,
            borderColor: placeholderTextColor,
            borderRadius: 3,
            backgroundColor: mainBackgroundColor,
            width: 110,
            height: 30,

        }}>
            <Text style={{
                textAlign: 'center',
                fontSize: 14,
                minWidth: 80,
            }}>{this.state[item.accountType + '_InputValue']}</Text>
            <TouchableOpacity
                ref={'dropDown'}
                activeOpacity={0.7}
                style={{
                    backgroundColor: mainColor,
                    height: 30,
                    width: 30,
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={() => {
                    this.setState({
                        selectItem: item
                    })
                    this.refs.dropDown.measureInWindow((x, y, width, height) => {
                        this.refs.JadeIntegralDialog.show(25, y, 180, height);
                    });
                }}>
                <XImage style={{height: 13, width: 24, resizeMode: 'center'}} source={ic_n_drop_down}/>
            </TouchableOpacity>
        </View>
    }

    render() {

        let {totalPrice, data} = this.props;

        return (
            <View>
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
                    marginLeft: 10,
                    marginRight: 10,
                    backgroundColor: placeholderTextColor,
                    height: 0.5
                }}/>
                {this._renderIntegralInputLayout()}
                <View style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    alignItems: 'center',
                }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={0.7}
                        onPress={() => {
                            this.setState({
                                payDisable: !this.state.payDisable
                            })
                        }}>
                        <XImage
                            style={{
                                marginRight: 5,
                                width: 12,
                                height: 12,
                                resizeMode: 'cover',
                            }}
                            source={this.state.payDisable ? ic_un_selected : ic_selected}/>
                        <Text style={{
                            color: contentTextColor,
                            fontSize: 14,
                            backgroundColor: 'transparent'
                        }}>{'勾选即表示同意'}</Text>
                    </TouchableOpacity>
                    <Text
                        style={{
                            color: '#65BCFE',
                            fontSize: 14,
                            textAlign: 'left',
                            flex: 1,
                        }}
                        suppressHighlighting={true}
                        onPress={() => {
                            this.props.onBuyCarPress()
                        }}>
                        《购车业务服务条款》
                    </Text>
                </View>
                <TouchableOpacity
                    style={{
                        marginTop: 15,
                        marginLeft: 40,
                        marginRight: 50,
                        marginBottom: 30,
                        height: 35,
                        backgroundColor: this.state.payDisable ? 'gray' : mainColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5
                    }}
                    disabled={this.state.payDisable}
                    onPress={() => {
                        let finalOrderPaysItem = this.newOrderPays[this.newOrderPays.length - 1];
                        let paymentConfigItem = PAYMENTS_CONFIG[finalOrderPaysItem.accountType];
                        let submitData = [];
                        this.newOrderPays.map((item) => {
                            submitData.push({accountType: item.accountType, amount: Number(item.inputValue)})
                        });
                        for (let item of submitData) {
                            if (submitData.length === 1) {
                                item.amount += Number(totalPrice * paymentConfigItem.ratio)
                            }
                        }
                        for (let status of data.accounts) {
                            for (let item of submitData) {
                                if (status.accountType === item.accountType) {
                                    if (Number(status.available) < Number(item.amount)) {
                                        showToastShort(status.accountName + '不足')
                                        return;
                                    }
                                }
                            }
                        }
                        this.props.onPayPress(submitData)
                    }}>
                    <Text style={{color: 'white', fontSize: 15,}}>{'前往支付'}</Text>
                </TouchableOpacity>
                <JadeIntegralDialog data={this.jadeData} ref={'JadeIntegralDialog'}
                                    selectPrice={(price) => {
                                        let totalIntegral = 0;

                                        this.newOrderPays.map((item, index) => {
                                            if (item.name === '玉积分') {
                                                item.inputValue = price.toFixed(2)
                                            }
                                            if (index !== this.newOrderPays.length - 1) {
                                                totalIntegral += Number(item.inputValue / item.ratio)
                                            }
                                        });
                                        let finalOrderPaysItem = this.newOrderPays[this.newOrderPays.length - 1];
                                        finalOrderPaysItem.inputValue = (this.totalPrice - totalIntegral) * finalOrderPaysItem.ratio;
                                        this.setState({
                                            ...this.state,
                                            [this.state.selectItem.accountType + '_InputValue']: price.toFixed(2),
                                            [finalOrderPaysItem.accountType + '_InputValue']: finalOrderPaysItem.inputValue.toFixed(2),
                                        })
                                    }}/>
            </View>
        );
    }
}

selector = (state) => {
    return {
        totalPrice: state.cacheStore.defaultTotalPrice,
    }
};

export default connect(selector)(IntegralCarMessage);

