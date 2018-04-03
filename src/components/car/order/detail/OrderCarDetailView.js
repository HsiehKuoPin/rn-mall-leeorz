import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity
} from 'react-native';

import TitleBar from '../../../../widgets/TitleBar';
import {connect} from 'react-redux';
import RequestErrorView from '../../../../widgets/RequestErrorView';
import {post,isSuccess} from "../../../../common/CommonRequest"
import {showToastShort} from "../../../../common/CommonToast";
import ProductList from "./module/CarProductListView";
import {ic_colored_tape, ic_selected, ic_un_selected} from "../../../../constraint/Image";
import LoadingView from "../../../../widgets/LoadingView";
import {content2TextColor, mainColor, placeholderTextColor, titleTextColor} from "../../../../constraint/Colors";
import {goto} from "../../../../reducers/RouterReducer";
import XImage from "../../../../widgets/XImage";
import {getCarOrderStatusText, ORDER_HAS_PAYMENT, ORDER_TO_CHOOSE} from "../../../../constraint/OrderType";

const width = Dimensions.get('window').width;

var orderId = null;

class OrderCarDetailView extends Component {

    constructor(props) {
        super(props);
        orderId = this.props.navigation.state.params;
        this.state = {
            isRequestError: false,
            isLoading: true,
            selectIndex: null,
            payDisable:true,
            touchSelect: '',
            data: null
        };
    }

    componentDidMount() {
        this._loadOrderDetail();
    }

    _loadOrderDetail() {
        let requestObj = {'orderId': orderId, token: this.props.token};
        post('order/car/orderDetail', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                    })
                }
                else {
                    this._errorMsg(responseData.message);
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
    }

    render() {

        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadOrderDetail();
            }}/>
        ) : (

            <View style={styles.container}>
                <ScrollView>
                    <View
                        style={{
                            shadowColor: 'gray',
                            shadowOffset: {height: 2, width: 2},
                            shadowRadius: 5,
                            shadowOpacity: 0.2,
                            elevation: 2,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 5,
                            margin: 10,
                        }}>
                        <ProductList data={this.state.data}/>
                        {this.state.data === null ? <View/> : this.IntegralMessage(this.state.data)}
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: 60, width: 60,
                            marginLeft: width - 66,
                            elevation: 4,
                            marginTop: 6,
                        }}>
                        <XImage source={ic_colored_tape} style={{height: 60, width: 60}}/>
                    </View>
                </ScrollView>
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar title={'订单详情'}
                          hideRight={true}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }

    IntegralMessage(data) {
        return (
            <View>
                <View style={{marginTop: 15, marginLeft: 15}}>
                    <Text style={{fontSize: 14, color: titleTextColor, marginBottom: 5}}>
                        {'订单状态:' + getCarOrderStatusText(data.orderStatus)}
                    </Text>
                    {
                        data.orderStatusList.length === 0 ? <View/> : data.orderStatusList.map((item, index) => {
                            return <Text
                                style={{
                                    marginTop: 5,
                                    fontSize: 12,
                                    color: content2TextColor,
                                    lineHeight: 25,
                                }}
                                key={index}>
                                {item}
                            </Text>
                        })
                    }
                    <View style={{marginTop: 10, backgroundColor: placeholderTextColor, height: 0.5}}/>
                </View>
                <View style={{marginTop: 15, marginLeft: 15, marginBottom: 10}}>
                    <Text style={{fontSize: 14, color: titleTextColor, marginBottom: 5}}>
                        {'商品总价:' + data.productAmount}
                    </Text>
                    {
                        data.productAmountList.length === 0 ? <View/> : data.productAmountList.map((item, index) => {
                            return <Text
                                style={{
                                    marginTop: 5,
                                    fontSize: 12,
                                    color: content2TextColor,
                                    lineHeight: 25,
                                }}
                                key={index}>
                                {item}
                            </Text>
                        })
                    }
                    {
                        data.refundAmountList.length === 0 ? <View/> : this.showBackMoney(data.refundAmountList)
                    }
                </View>
                {data.orderStatus === ORDER_TO_CHOOSE ? this.submitCar(data) : <View/>}
                {data.orderStatus === ORDER_HAS_PAYMENT ? this.payRetainage() : <View/>}
            </View>
        );
    }

    showBackMoney(data) {
        return <View>
            <View style={{marginTop: 10, backgroundColor: placeholderTextColor, height: 0.5}}/>
            {
                data.map((item, index) => {
                    return <Text
                        style={{
                            marginTop: 5,
                            fontSize: 14,
                            color: titleTextColor,
                            lineHeight: 25,
                        }}
                        key={index}>
                        {item}
                    </Text>

                })
            }
        </View>
    }

    submitCar(data) {
        let checkBoxArr = [{isShow:data.isAllowNormalPremiseCar,tip:'提车'}, {isShow:data.isAllowMentionPremiseCar,tip:'提前提车'}];
        let isShowSubmitBtn = false;
        return <View>
            <View style={{flexDirection: 'row'}}>
                {
                    checkBoxArr.map((item, index) => {
                        if (!item.isShow) return;
                        isShowSubmitBtn = true;
                        return <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                marginLeft: 20,
                                marginRight: 20,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            key={index}
                            activeOpacity={0.7}
                            onPress={() => {
                                if (this.state.selectIndex !== index) {
                                    this.setState({selectIndex: index, touchSelect: item.tip, payDisable: false});
                                }
                            }}>
                            <XImage
                                style={{
                                    marginRight: 5,
                                    width: 15,
                                    height: 15,
                                    resizeMode: 'cover',
                                }}
                                source={this.state.selectIndex === index ? ic_selected : ic_un_selected}/>
                            <Text style={{color: content2TextColor, fontSize: 13,}}>{item.tip}</Text>

                        </TouchableOpacity>
                    })
                }
            </View>
            {
                !isShowSubmitBtn ? null : <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        marginTop: 20,
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
                        {
                            this.state.touchSelect === '提车' ? this.props.dispatch(goto('ExtractionCar', {
                                orderId: orderId,
                                product: this.state.data
                            })) : null
                        }
                        {
                            this.state.touchSelect === '提前提车' ? this.props.dispatch(goto('AdvanceExtractionCar', {
                                orderId: orderId,
                                product: this.state.data
                            })) : null
                        }
                        // {this.state.touchSelect === '已完成' ? this.props.dispatch(goto('NotExtractionCar',{orderId:orderId,product:this.state.data})): null}
                    }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 15,
                    }}>{'确定'}</Text>
                </TouchableOpacity>
            }
        </View>
    }

    payRetainage() {
        return <View>
            <TouchableOpacity
                activeOpacity={0.7}
                style={{
                    marginTop: 10,
                    marginLeft: 40,
                    marginRight: 50,
                    marginBottom: 30,
                    height: 35,
                    backgroundColor: mainColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8
                }}
                onPress={() => {
                    this.props.dispatch(goto('CartFinalPaymentDetail',{orderId}));
                }}>
                <Text style={{
                    color: 'white',
                    fontSize: 15,
                }}>{'支付尾款'}</Text>
            </TouchableOpacity>
        </View>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(OrderCarDetailView);
