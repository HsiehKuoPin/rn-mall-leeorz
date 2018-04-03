import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    DeviceEventEmitter,
    TouchableOpacity
} from 'react-native';
import {mainColor} from "../../../constraint/Colors";
import {
    BTN_AFTER_SERVICE,
    BTN_AGAIN, BTN_AGAIN2,
    BTN_CANCEL, BTN_COMMENT, BTN_CONFIRM, BTN_DELETE, BTN_LOGISTICS, BTN_PAY,
    ORDER_ALL,
    ORDER_APPRAISE, ORDER_APPROVED, ORDER_CANCEL, ORDER_CLOSE, ORDER_COMBO, ORDER_COMPLETED, ORDER_CREATED, ORDER_HOLD,
    ORDER_OIL_CARD,
    ORDER_PRODUCT,
    ORDER_SENT
} from "../../../constraint/OrderType";
import connect from "react-redux/es/connect/connect";
import {goto} from "../../../reducers/RouterReducer";
import TipDialog from "../../../widgets/dialog/TipDialog";
import {getRequestFailTip, isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import PayPasswordView from "../../../widgets/PayPasswordView";
import BaseComponent from "../../../widgets/BaseComponent";
import {isTrue} from "../../../common/AppUtil";

class OrderItemBottom extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            dialogMessage: '',
            showPayPasswordDialog: false,
        };

        this.controlType = undefined;
    }

    static defaultProps = {
        order: null,
    };

    //跳转到商品详情界面
    _gotoOrderDetail = () => {
        this.props.dispatch(goto('OrderDetail', {orderId: this.props.order.id}));
    };

    //跳转到评价页面
    _gotoComment = () => {
        let {order, dispatch} = this.props;
        if (order.orderItems.length > 1) {
            let productList = [];
            order.orderItems.map(item => {
                if (!isTrue(item.isAppraise)) {
                    productList.push(item);
                }
            });
            dispatch(goto('WaitCommentProductList', {productList: productList}));
        } else if (order.orderItems.length === 1) {
            let product = order.orderItems[0];
            dispatch(goto('Evaluation', {
                productSkuId: product.productSkuId,
                imgUrl: product.imgUrl,
                orderItemId: product.id,
                orderId: product.orderId
            }));
        }
    };

    //申请售后
    _gotoCustomerService = () => {
        this.props.dispatch(goto('CustomerService', {orderId: this.props.order.id}))
    };

    //去物流详情界面
    _gotoLogistics = () => {
        this.props.dispatch(goto('LogisticsMsg', this.props.order.id));
    };


    //显示删除弹窗
    _showDialog = (tip, type) => {
        this.setState({
            dialogMessage: tip,
        }, () => {
            this.refs.tipDialog.showDialog()
        });

        this.controlType = type;
    };

    //根据类别显示对应的弹窗
    _showTargetDialog = () => {
        if (this.controlType === 'confirm') {
            this.refs.tipDialog.dismiss();
            this.refs.PayPasswordView.show();
        } else {
            this._confirmDeleteOrder();
        }
    };

    //显示输入支付密码界面
    _showPayPasswordDialog = () => {
        this.refs.PayPasswordView.show();
    };
    //确认收货
    _confirmReceiveOrder = (password) => {
        let {order} = this.props;
        let requestObj = {token: this.props.token, orderId: order.id, payPassword: password,};
        post('order/confirmReceiptGoods', requestObj, true)
            .then(responseJson => {
                if (isSuccess(responseJson)) {
                    //通知所有订单列表进行更新
                    DeviceEventEmitter.emit(ORDER_CREATED, {type: 'reset', orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_ALL, {type: 'reset', orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_SENT, {type: 'delete', orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_APPROVED, {type: 'reset', orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_APPRAISE, {type: 'reset', orderId: order.id});
                } else if (this.checkUserTokenValid({title: '您的登录已经失效'})) {
                    showToastShort(getRequestFailTip(responseJson));
                }
            }).catch(e => {
            showToastShort(e.message);
        });
    };

    //确定删除订单
    _confirmDeleteOrder = () => {
        let {order} = this.props;
        let requestObj = {token: this.props.token, orderId: order.id, orderStatusType: order.status};
        let api = (this.controlType === 'cancel' ? ( order.orderType === ORDER_OIL_CARD ? 'order/oilCard/cancelOrder' : 'order/cancelOrder') : 'order/deleteOrder');
        post(api, requestObj, true)
            .then(responseJson => {
                // this.props.dispatch(showLoadingDialog(false));
                if (isSuccess(responseJson)) {
                    showToastShort(this.controlType === 'cancel' ? '已成功取消订单' : '已成功删除订单');
                    //通知所有订单列表进行更新
                    DeviceEventEmitter.emit(ORDER_CREATED, {type: 'delete', orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_ALL, {type: this.controlType, orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_SENT, {type: 'delete', orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_APPROVED, {type: 'delete', orderId: order.id});
                    DeviceEventEmitter.emit(ORDER_APPRAISE, {type: 'delete', orderId: order.id});
                } else if (this.checkUserTokenValid({title: '您的登录已经失效'})) {
                    showToastShort(getRequestFailTip(responseJson));
                }
            }).catch(e => {
            showToastShort(e.message);
        })
    };

    //再次购买
    _buyAgain = () => {
        let {order, dispatch} = this.props;
        if (order.orderType === ORDER_COMBO) {
            dispatch(goto('RichMoreConfirmOrder', order.comboId));
        }
        else {
            let productList = [];
            let totalCount = 0;
            let amount = 0;
            order.orderItems.map(item => {
                productList.push({productSkuId: item.productSkuId, quantity: String(item.quantity),comment:''});
                totalCount += item.quantity;
                amount += (item.amount*item.quantity);
            });
            dispatch(goto('ConfirmOrder', {
                products: {
                    productIds: productList,
                    number: String(totalCount),
                    total: String(amount),
                    type: order.orderType,
                }
            }));
        }
    };

    render() {
        let {config, order} = this.props;
        let bottomBtnArr = [];
        _getBottomBtn = (tip, func, ...params) => {
            return (
                <TouchableOpacity key={bottomBtnArr.length}
                                  activeOpacity={0.7}
                                  style={[styles.BottomBtn]}
                                  onPress={() => {
                                      if (func) {
                                          if (params) {
                                              func(...params);
                                          } else {
                                              func();
                                          }
                                      }
                                  }}>
                    <Text style={styles.BottomBtnText}>{tip}</Text>
                </TouchableOpacity>
            );
        };
        _getFullBottomBtn = (tip, func, ...params) => {
            return (
                <TouchableOpacity key={bottomBtnArr.length}
                                  activeOpacity={0.7}
                                  style={[styles.BottomBtn, {flex: 1}]}
                                  onPress={() => {
                                      if (func) {
                                          if (params) {
                                              func(...params);
                                          } else {
                                              func();
                                          }
                                      }
                                  }}>
                    <Text style={styles.BottomFullBtnText}>{tip}</Text>
                </TouchableOpacity>
            );
        };

        switch (order.orderType) {
            case ORDER_PRODUCT:
                switch (order.status) {
                    case ORDER_CREATED:
                        bottomBtnArr.push(_getBottomBtn(BTN_PAY, this._gotoOrderDetail));
                        bottomBtnArr.push(_getBottomBtn(BTN_CANCEL, this._showDialog, '确定要取消这个订单吗?', 'cancel'));
                        break;
                    case ORDER_APPRAISE:
                        bottomBtnArr.push(_getFullBottomBtn(BTN_COMMENT, this._gotoComment));
                        bottomBtnArr.push(_getFullBottomBtn(BTN_AFTER_SERVICE, this._gotoCustomerService));
                        bottomBtnArr.push(_getFullBottomBtn(BTN_AGAIN, this._buyAgain));
                        bottomBtnArr.push(_getFullBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break;
                    case ORDER_SENT:
                        bottomBtnArr.push(_getBottomBtn(BTN_CONFIRM, this._showDialog, '您确定收到货物了吗?', 'confirm'));
                        break;
                    case ORDER_CANCEL:
                        bottomBtnArr.push(_getBottomBtn(BTN_AGAIN2, this._buyAgain));
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break;
                    case ORDER_CLOSE:
                        bottomBtnArr.push(_getBottomBtn(BTN_AGAIN2, this._buyAgain));
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break;
                    case ORDER_COMPLETED:
                        bottomBtnArr.push(_getBottomBtn(BTN_AFTER_SERVICE, this._gotoCustomerService));
                        bottomBtnArr.push(_getBottomBtn(BTN_AGAIN, this._buyAgain));
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break
                }
                break;
            case ORDER_OIL_CARD:
                switch (order.status) {
                    case ORDER_CREATED:
                        bottomBtnArr.push(_getBottomBtn(BTN_PAY, this._gotoOrderDetail));
                        bottomBtnArr.push(_getBottomBtn(BTN_CANCEL, this._showDialog, '确定要取消这个订单吗?', 'cancel'));
                        break;
                    case ORDER_APPRAISE:
                        bottomBtnArr.push(_getBottomBtn(BTN_COMMENT, this._gotoComment));
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break;
                    case ORDER_SENT:
                        bottomBtnArr.push(_getBottomBtn(BTN_CONFIRM, this._showDialog, '您确定收到货物了吗?', 'confirm'));
                        break;
                    case ORDER_CANCEL:
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break;
                    case ORDER_COMPLETED:
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break
                }
                break;
            case ORDER_COMBO:
                switch (order.status) {
                    case ORDER_APPRAISE:
                        bottomBtnArr.push(_getBottomBtn(BTN_COMMENT, this._gotoComment));
                        bottomBtnArr.push(_getBottomBtn(BTN_AGAIN, this._buyAgain));
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break;
                    case ORDER_SENT:
                        bottomBtnArr.push(_getBottomBtn(BTN_CONFIRM, this._showDialog, '您确定收到货物了吗?', 'confirm'));
                        break;
                    case ORDER_COMPLETED:
                        bottomBtnArr.push(_getBottomBtn(BTN_AGAIN, this._buyAgain));
                        bottomBtnArr.push(_getBottomBtn(BTN_DELETE, this._showDialog, '确定要删除这个订单吗?', 'delete'));
                        break
                }
                break;
        }

        return (
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', paddingLeft: 9}}>
                    {bottomBtnArr}
                </View>

                <View>
                    <TipDialog
                        ref={'tipDialog'}
                        dialogMessage={this.state.dialogMessage}
                        onClickConfirm={this._showTargetDialog}
                    />
                    <PayPasswordView
                        ref={'PayPasswordView'}
                        pay={(password) => this._confirmReceiveOrder(password)}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    BottomBtn: {
        marginRight: 9,
        paddingVertical: 5,
        borderColor: mainColor,
        borderRadius: 3,
        borderWidth: 1,
    },
    BottomFullBtnText: {
        textAlign: 'center',
        color: mainColor,
    },
    BottomBtnText: {
        paddingHorizontal: 8,
        textAlign: 'center',
        color: mainColor,
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};
export default connect(selector)(OrderItemBottom);
