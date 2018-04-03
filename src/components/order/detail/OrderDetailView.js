import React, {Component} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    Text,
    TouchableOpacity,
    Platform,
    Linking, Image
} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import {connect} from 'react-redux';
import {goto, goBack} from '../../../reducers/RouterReducer';
import RequestErrorView from '../../../widgets/RequestErrorView';
import {post, getRequestFailTip,isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import AddressMessage from "./module/AddressMessage";
import LogisticsMessage from "./module/LogisticsMessage"
import ProductList from "./module/ProductListView";
import OrderMessage from "./module/OrderMessage";
import LoadingView from "../../../widgets/LoadingView";
import TipDialog from "../../../widgets/dialog/TipDialog";
import PayPasswordView from "../../../widgets/PayPasswordView";
import {
    ic_colored_tape, ic_order_bg_o, ic_order_daifukuan, ic_order_daifahuo, ic_order_daipingjia, ic_order_daishouhuo,
    ic_order_fahuozhong, ic_order_yiguanbi, ic_order_yiwancheng
} from "../../../constraint/Image";
import {mainBackgroundColor, mainColor, placeholderTextColor} from "../../../constraint/Colors";
import {
    BTN_AFTER_SERVICE, BTN_AGAIN, BTN_AGAIN2,
    BTN_CANCEL, BTN_COMMENT, BTN_CONFIRM, BTN_DELETE, BTN_PAY,
    ORDER_APPRAISE, ORDER_APPROVED, ORDER_CANCEL, ORDER_CLOSE, ORDER_COMBO, ORDER_COMPLETED, ORDER_CREATED, ORDER_HOLD,
    ORDER_OIL_CARD,
    ORDER_PRODUCT,
    ORDER_SENT
} from "../../../constraint/OrderType";
import XImage from "../../../widgets/XImage";
import {isTrue, SERVICE_CALL} from "../../../common/AppUtil";
import IphoneModel from "../../../widgets/IphoneModel";

const width = Dimensions.get('window').width;

var orderId;

class OrderDetailView extends Component {

    constructor(props) {
        super(props);
        orderId = this.props.navigation.state.params.orderId;
        this.state = {
            isRequestError: false,
            isLoading: true,
            data: null,
            image: ic_order_daifukuan,
            orderStatusId: '',
            orderStatus: '',
            orderContent: '',
            orderType: '',
            showTitle: '',
            showButton: '确定',
            isChange: false,
            isShowPhone: false,
        };

        this.orderstatus = {
            ORDER_CREATED: {'image': ic_order_daifukuan, 'statusTip': '等待买家付款', 'statusContent': ''},//待付款
            ORDER_APPROVED: {'image': ic_order_daifahuo, 'statusTip': '等待商家发货', 'statusContent': '订单信息已提交,请耐心等待'},//待发货
            ORDER_APPRAISE: {
                'image': ic_order_daipingjia, 'statusTip': '已确认收货', 'statusContent': '快来写下你的购买体会和使用感受吧~ ~ ~'
            },//待评价
            ORDER_SENT: {'image': ic_order_daishouhuo, 'statusTip': '商家已发货', 'statusContent': ''},//待收货
            ORDER_HOLD: {'image': ic_order_fahuozhong, 'statusTip': '商家发货中', 'statusContent': '正在打包商品出库,请耐心等候'},//发货中
            ORDER_CLOSE: {'image': ic_order_yiguanbi, 'statusTip': '订单已终止', 'statusContent': '买家已取消购买商品'},//已关闭
            ORDER_CANCEL: {'image': ic_order_yiguanbi, 'statusTip': '订单已终止', 'statusContent': '买家支付超时,订单已自动取消'},//已取消
            ORDER_COMPLETED: {
                'image': ic_order_yiwancheng,
                'statusTip': '已完成购物',
                'statusContent': '感谢您对自然e家商城的支持~ ~ ~'
            },//已完成
        };
    }

    componentWillMount() {
        this.setState({
            isChange: this.props.isEvaluated
        });
        if (this.state.isChange === true) {
            this._loadOrderDetail();
        }
    }

    componentDidMount() {
        this._loadOrderDetail();
    }

    /**
     * 获取底部订单操作按钮
     * @param statusId
     * @returns {*}
     * @private
     */
    _getOrderBottomBtn(statusId, orderType) {
        switch (orderType) {
            case ORDER_PRODUCT:
                return this._getCommonBottomBtn(statusId);
            case ORDER_COMBO:
                return this._getComboBottomBtn(statusId);
            case ORDER_OIL_CARD:
                return this._getOilCardBottomBtn(statusId);
            default:
                return [];
        }
    }

    /**
     * 普通商品
     * @param statusId
     * @returns {*}
     * @private
     */
    _getCommonBottomBtn(statusId) {
        switch (statusId) {
            case ORDER_CREATED:
                return [BTN_PAY, BTN_CANCEL];
            case ORDER_APPROVED:
                return [];
            case ORDER_APPRAISE:
                return [BTN_COMMENT, BTN_AFTER_SERVICE, BTN_AGAIN, BTN_DELETE];
            case ORDER_SENT:
                return [BTN_CONFIRM, BTN_AFTER_SERVICE];
            case ORDER_HOLD:
                return [];
            case ORDER_CLOSE:
                return [BTN_AGAIN2, BTN_DELETE];
            case ORDER_CANCEL:
                return [BTN_AGAIN2, BTN_DELETE];
            case ORDER_COMPLETED:
                return [BTN_AFTER_SERVICE, BTN_AGAIN, BTN_DELETE];
            default:
                return [];
        }
    }

    /**
     * 油卡
     * @param statusId
     * @returns {*}
     * @private
     */
    _getOilCardBottomBtn(statusId) {
        switch (statusId) {
            case ORDER_CREATED:
                return [BTN_PAY, BTN_CANCEL];
            case ORDER_APPROVED:
                return [];
            case ORDER_APPRAISE:
                return [BTN_COMMENT, BTN_DELETE];
            case ORDER_SENT:
                return [BTN_CONFIRM];
            case ORDER_HOLD:
                return [];
            case ORDER_CANCEL:
                return [BTN_DELETE];
            case ORDER_COMPLETED:
                return [BTN_DELETE];
            default:
                return [];
        }
    }

    /**
     * 套餐商品
     * @param statusId
     * @returns {*}
     * @private
     */
    _getComboBottomBtn(statusId) {
        switch (statusId) {
            case ORDER_APPROVED:
                return [];
            case ORDER_APPRAISE:
                return [BTN_COMMENT, BTN_AGAIN, BTN_DELETE];
            case ORDER_SENT:
                return [BTN_CONFIRM];
            case ORDER_HOLD:
                return [];
            case ORDER_COMPLETED:
                return [BTN_AGAIN, BTN_DELETE];
            default:
                return [];
        }
    }


    _loadOrderDetail() {
        post('order/orderDetail', {'orderId': orderId, token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let orderData = responseData.result;
                    let orderStatus = orderData.order.status;
                    if (orderStatus in this.orderstatus) {
                        let orderStatusObj = this.orderstatus[orderStatus];
                        this.setState({
                            isLoading: false,
                            isRequestError: false,
                            data: orderData,
                            image: orderStatusObj.image,
                            orderStatus: orderStatusObj.statusTip,
                            orderContent: orderStatusObj.statusContent,
                            orderStatusId: orderStatus,
                            orderType: orderData.order.orderType,
                        })
                    }
                } else {
                    this._errorMsg("请求出现异常");
                }
            }).catch((e) => {
            console.warn(e.message);
            this._errorMsg(e.message);
        });
    }

    _loadPayOrder(password) {

        let requestObj = {
            'orderId': orderId,
            'payPassword': password,
            token: this.props.token
        };
        post('order/confirmReceiptGoods', requestObj, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort('确认收货成功');
                    this.setState({
                        isChange: true
                    });
                    this.props.dispatch(goBack({isChange: this.state.isChange}));
                } else {
                    showToastShort(responseData.message)
                }
            }).catch((e) => {
            showToastShort(e.message);
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
                <ScrollView style={{flex: 1}}>
                    {this._getOrderStatusBar()}
                    <View style={{
                        shadowColor: 'gray',
                        shadowOffset: {height: 4, width: 4},
                        shadowRadius: 3,
                        shadowOpacity: 0.2,
                        elevation: 2,
                        backgroundColor: '#00000000',
                        borderRadius: 5,
                        margin: 10,
                        marginTop: 0
                    }}>
                        {(this.state.data === null ? '' :
                            this.state.data.order.status === ORDER_SENT ||
                            this.state.data.order.status === ORDER_HOLD ||
                            this.state.data.order.status === ORDER_COMPLETED ||
                            this.state.data.order.status === ORDER_APPRAISE) ? (
                            <View>
                                <LogisticsMessage
                                    data={this.state.data}
                                    onPress={() => {
                                        this.props.dispatch(goto('LogisticsMsg', this.state.data.order.id))
                                    }}/>
                                <AddressMessage data={this.state.data !== null ? this.state.data.order.address : null}
                                                border={0}/>
                            </View>

                        ) : (
                            <AddressMessage data={this.state.data !== null ? this.state.data.order.address : null}
                                            border={6}/>
                        )}

                        <ProductList data={this.state.data !== null ? this.state.data : null}/>
                        <OrderMessage data={this.state.data !== null ? this.state.data.order : null}/>
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            height: 60, width: 60,
                            marginLeft: width - 66,
                            elevation: 2,
                            marginTop: (width - 20) * 0.34 + 18,
                        }}>
                        <XImage source={ic_colored_tape}
                                style={{height: 60, width: 60}}/>
                    </View>
                    <PayPasswordView
                        ref={'PayPasswordView'}
                        pay={(password) => this._loadPayOrder(password)}
                    />
                    <TipDialog
                        ref={'TipDialog'}
                        confirmBtnText={this.state.showButton}
                        dialogMessage={this.state.showTitle}
                        onClickConfirm={this.onDeletePress.bind(this, this.state.showTitle)}/>
                </ScrollView>
                {this._getOrderBottomBtnLayout(this.state.orderStatusId, this.state.orderType)}
                <IphoneModel/>
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar title={'订单详情'}
                          hideRight={false}
                          customRightView={() => (<Text style={{color: 'white'}}>联系客服</Text>)}
                          onRightViewClick={() => {
                              this.setState({
                                  showTitle: '确定要拨打客服电话?',
                              }, () => {
                                  if (Platform.OS === 'android') {
                                      this.refs.TipDialog.showDialog()
                                  }
                                  else {
                                      let url = 'tel: ' + SERVICE_CALL;
                                      Linking.canOpenURL(url).then(supported => {
                                          if (!supported) {
                                              console.log(url);
                                          } else {
                                              return Linking.openURL(url);
                                          }
                                      }).catch(err => console.error(err))
                                  }
                              })
                          }}/>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        );
    }

    _getOrderStatusBar() {
        return (
            <View style={{
                marginHorizontal: 10,
                marginVertical: 10,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: 'gray',
                shadowOffset: {height: 4, width: 4},
                shadowRadius: 3,
                shadowOpacity: 0.2,
                elevation: 2,
                backgroundColor: 'white',
                borderRadius: 5,
            }}>
                <Image
                    resizeMode='contain'
                    source={ic_order_bg_o}
                    style={{
                        width: width - 20,
                        height: (width - 20) * (233 / 677.0),
                    }}/>
                <View style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width - 36,
                    height: (width - 36) * 0.34,
                    backgroundColor: '#00000000',
                }}>
                    <View style={{marginLeft: 15, flex: 1}}>
                        <Text style={{
                            color: 'white',
                            fontSize: 15,
                            paddingBottom: 5
                        }}>{this.state.orderStatus}</Text>
                        {/*<Text style={{*/}
                            {/*color: 'white',*/}
                            {/*fontSize: 12,*/}
                            {/*lineHeight: 15*/}
                        {/*}}>{this.state.orderStatusId !== null ? ((this.state.orderStatusId === ORDER_CREATED || this.state.orderStatusId === ORDER_SENT) ?*/}
                            {/*(*/}
                                {/*this.state.orderStatusId === ORDER_CREATED ? ('剩' + (this.state.data.order.minutes ? this.state.data.order.minutes : '0') + '分钟自动关闭') : ('还有' + (this.state.data.minutes ? this.state.data.minutes : '0') + '时自动确认收货')*/}
                            {/*) : (this.state.orderContent)) : ''}</Text>*/}
                    </View>
                    <XImage
                        style={{marginRight: 25, width: 55, height: 55}}
                        source={this.state.image}/>
                </View>


            </View>
        )
    }

    _getOrderBottomBtnLayout(orderStatusId, orderType) {
        return (
            this._getOrderBottomBtn(orderStatusId, orderType).length === 0 ? null :
                <View style={{backgroundColor: 'white', height: 50,}}>
                    <View style={{backgroundColor: placeholderTextColor, height: 0.5}}/>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white'
                    }}>
                        <View style={{flex: 1}}/>
                        {
                            this._getOrderBottomBtn(orderStatusId, orderType).map((item, index) => {
                                return <TouchableOpacity
                                    key={index}
                                    onPress={this.onPress.bind(this, item)}
                                    activeOpacity={0.7}
                                    style={{marginRight: 10, width: (width - 50) / 4}}
                                >
                                    <Text style={{
                                        paddingHorizontal: 5,
                                        paddingVertical: 8,
                                        borderColor: mainColor,
                                        borderRadius: 3,
                                        borderWidth: 1,
                                        textAlign: 'center',
                                        fontSize: 13,
                                        color: mainColor,
                                    }}>{item}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>
                </View>
        )
    }

    onPress(buttonType) {

        switch (buttonType) {
            case '删除订单':
                this.setState({
                    showTitle: buttonType,
                }, () => this.refs.TipDialog.showDialog())
                break;
            case '取消订单':
                this.setState({
                    showTitle: buttonType,
                }, () => this.refs.TipDialog.showDialog())
                break;
            case '申请售后':
                this.props.dispatch(goto('CustomerService', {orderId: this.state.data.order.id}))
                break;
            case '重新购买':
            case '再来一单':
                if (this.state.orderType === ORDER_COMBO) {
                    this.props.dispatch(goto('RichMoreConfirmOrder', this.state.data.order.comboId));
                }
                else {
                    let productList = [];
                    let totalCount = 0;
                    let amount = 0;
                    this.state.data.orderItems.map(item => {
                        productList.push({productSkuId: item.productSkuId, quantity: String(item.quantity),comment:''});
                        totalCount += item.quantity;
                        amount += (item.amount*item.quantity);
                    });
                    this.props.dispatch(goto('ConfirmOrder', {
                        products: {
                            productIds: productList,
                            number: String(totalCount),
                            total: String(amount),
                            type: this.state.orderType,
                        }
                    }));
                }

                break;
            case '确认收货':
                this.setState({
                    showTitle: buttonType,
                }, () => this.refs.TipDialog.showDialog())
                break;
            case '前往评价':
                let product = this.state.data ? this.state.data.orderItems : null;
                if (product.length === 1) {
                    this.props.dispatch(goto('Evaluation', {
                        'productId': product[0].productSkuId,
                        'orderItemId': product[0].id,
                        'imgUrl': product[0].imgUrl
                    }))
                }
                else {
                    let productList = [];
                    product.map(item => {
                        if (!isTrue(item.isAppraise)) {
                            productList.push(item);
                        }
                    });
                    this.props.dispatch(goto('WaitCommentProductList', {productList: productList}));
                }
                break;
            case '前往支付':
                this.props.dispatch(goto('PaymentDetail', {orderId: this.state.data.order.id}))
                break;
        }

    };

    onDeletePress = (title) => {
        if (title === '确定要拨打客服电话?') {
            let url = 'tel: ' + SERVICE_CALL;
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log(url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error(err));
        }
        else if (title === '确认收货') {
            isTrue(this.props.otherConfig.isSetPayPassword)?
                (this.refs.PayPasswordView.show(),
                    this.refs.TipDialog.dismiss()) :
                this.props.dispatch(goto('ResetPaymentPsw'))
        }
        else {
            let url = null;
            let param = null;
            if (title === '取消订单') {
                url = (this.state.orderType === ORDER_OIL_CARD ? 'order/oilCard/cancelOrder' : 'order/cancelOrder');
                param = {
                    'orderStatusType': this.state.orderStatusId,
                    'orderId': orderId,
                    token: this.props.token
                };
            }
            else if (title === '删除订单') {
                url = 'order/deleteOrder';
                param = {
                    'orderId': orderId,
                    token: this.props.token
                };
            }
            post(url, param)
                .then((responseData) => {
                    this.refs.TipDialog.dismiss();
                    if (isSuccess(responseData)) {
                        showToastShort(title + '成功');
                        this.setState({
                            isChange: true
                        })
                        this.props.dispatch(goBack({isChange: this.state.isChange}));
                    } else {
                        showToastShort(getRequestFailTip(responseData));
                    }
                }).catch((e) => {
                showToastShort(getRequestFailTip(e.message));
                this.refs.TipDialog.dismiss();
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        otherConfig: state.loginStore.otherConfig,
    }
};

export default connect(selector)(OrderDetailView);
