import React, {Component} from 'react';
import {
    View,
    FlatList, SectionList, Text,
} from 'react-native';
import TitleBar from '../../widgets/TitleBar';
import {connect} from 'react-redux';
import {
    removeShoppingCartProductList, saveShoppingCart,
    selectShoppingCartProduct
} from '../../reducers/ShoppingCartReducer';
import {showToastShort} from "../../common/CommonToast";
import ShoppingCartItem from './ShoppingCartItem'
import BottomView from './BottomView';
import RequestErrorView from '../../widgets/RequestErrorView';
import LoadingView from "../../widgets/LoadingView";
import {post, getRequestFailTip, isSuccess} from '../../common/CommonRequest';
import EmptyView from "../common/empty/EmptyView";
import BaseComponent from "../../widgets/BaseComponent";
import {mainBackgroundColor} from "../../constraint/Colors";
import SettlementDialog from "../../widgets/dialog/SettlementDialog";
import ShoppingCartMerchantHeader from "./ShoppingCartMerchantHeader";
import {goto} from "../../reducers/RouterReducer";
import {APP_STORE_NAME} from "../../constraint/Strings";

class ShoppingCart extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            shoppingCart: [],
            isRequestError: false,
            isLoading: true,
            isDeleteMode:false,
        };
        this.updateShoppingFlag = 0;
        this.settlementData = null;
    }

    _errorMsg(msg) {
        this.setState({
            isRequestError: true,
            isLoading: false,
        });
        if(msg){
            showToastShort(getRequestFailTip(msg));
        }else{
            showToastShort(getRequestFailTip());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.updateShoppingFlag && nextProps.updateShoppingFlag !== this.updateShoppingFlag) {
            this.loadShoppingCart();
            this.updateShoppingFlag = nextProps.updateShoppingFlag;
        }
    }

    componentWillMount(){
        this.loadShoppingCart();
    }

    loadShoppingCart() {
        if(new Date().valueOf() - this.updateShoppingFlag < 500)return;
        this.updateShoppingFlag = new Date().valueOf();
        post('product/shoppingCart/shoppingCartList', {token: this.props.token})
            .then((response) => {
                if (isSuccess(response)) {

                    this.setState({
                        isDeleteMode: this.props.shoppingCart.length === 0 ? false : this.state.isDeleteMode,
                        isRequestError: false,
                        isLoading: false
                    })
                    this.props.dispatch(saveShoppingCart(response.result.shoppingCartList));

                } else if(this.checkUserTokenValid({response})) {
                    this._errorMsg(response)
                }
            }).catch((e) => {
                this._errorMsg();
        });
    }

    //批量删除购物车的商品
    _deleteShoppingCartProduct(data){
        let deleteSkuIdArr = [];
        let skuIds = null;
        data.map(item=>{
            item.data.map(productItem=>{
                if(productItem.check){
                    if(skuIds){
                        skuIds += ',' + productItem.id;
                    }else{
                        skuIds = productItem.id;
                    }
                    deleteSkuIdArr.push(productItem.id);
                }
            })
        });
        let requestObj = {
            token: this.props.token,
            skuId: skuIds,
        };
        post('product/shoppingCart/removeShoppingCart', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.props.dispatch(removeShoppingCartProductList(deleteSkuIdArr));
                } else {
                    showToastShort(responseData.message)
                }
            })
    }

    /**
     * 结算，返回结算数据
     * @private
     */
    _settlement(marchantId = null){
        let checkItem = [];
        let totalCount = 0;
        let totalPrice = 0;
        let checkCount = 0;
        let filterItem = [];
        this.props.shoppingCart.map((item) => {
            if(item.productSkuVo.merchantId === marchantId || marchantId === null){
                if (item.check) {
                    totalCount += Number(item.quantity);
                    totalPrice += Number(item.quantity * item.productSkuVo.salePrice);
                    ++checkCount;
                    filterItem.push(item);
                }
            }
        });
        filterItem.map((item) => {
            checkItem.push({productSkuId: item.skuId, quantity: item.quantity.toString()})
        });
        let products = {productIds:checkItem, number: totalCount, total: totalPrice};
        let settlementData = {products: products,removeShoppingCart:'Y',comment:''};
        return settlementData;
    }

    //检查是否是单商家
    _checkIfSelectOneMerchantProduct(data){
        let merchantIdArr = [];
        for (let item of data) {
            for (let productItem of item.data) {
                if (productItem.check) {
                    if (merchantIdArr.length === 0) {
                        merchantIdArr.push(item.merchant.merchantId)
                    } else {
                        let isOne = false;
                        for (let merchantId of merchantIdArr) {
                            if (merchantId !== productItem.merchantId) {
                                return false;
                            }
                        }
                    }

                }
            }
        };

        return true;
    }


    render() {

        let merchantList = [];
        this.props.shoppingCart.map((item,index)=>{
            let isFind = false;
            item.productSkuVo.merchantName = item.productSkuVo.merchantName === '自然e家'?APP_STORE_NAME:item.productSkuVo.merchantName;
            merchantList.map((merchant)=>{
                if(item.productSkuVo.merchantId === merchant.merchant.merchantId){
                    isFind = true;
                    merchant.data.push({...item.productSkuVo,quantity:item.quantity,shoppingCarId:item.id,check:item.check});
                }
            });

            if(!isFind){
                merchantList.push({
                    merchant:{merchantId:item.productSkuVo.merchantId,merchantName:item.productSkuVo.merchantName},
                    key:item.productSkuVo.merchantId,
                    data:[{...item.productSkuVo,quantity:item.quantity,shoppingCarId:item.id,check:item.check}]
                })
            }
        });


        //查看是否有全选店家的数据
        merchantList.map((merchantItem) => {
                merchantItem.merchant.allCheck = true;
                for(let item of merchantItem.data) {
                    if (!item.check) {
                        merchantItem.merchant.allCheck = false;
                        break;
                    }
                }
            }
        );

        let listView = (this.props.shoppingCart.length === 0) ? (<EmptyView emptyTip={'购物车空空，快去逛逛吧'}/>) :
            (<View style={{flex: 1}}>
                        <SectionList
                            stickySectionHeadersEnabled={true}
                            renderSectionHeader={(item) =><ShoppingCartMerchantHeader data={item.section.merchant}/>}
                            sections={merchantList}
                            keyExtractor={(item, index) => index}
                            renderItem={({item,index,section}) =>
                                <ShoppingCartItem data={item}
                                                  isLast={index === section.data.length - 1}
                                                  selectProduct={(id) => {
                                                      this.props.dispatch(selectShoppingCartProduct(id))
                                                  }}
                                />}/>
                        {/*<EmptyView isShowEmptyView={false}/>*/}

                    <BottomView
                        onClickDeleteBtn={()=>{
                            this._deleteShoppingCartProduct(merchantList);
                        }}
                        onClickSettlementBtn={()=>{
                            if(this._checkIfSelectOneMerchantProduct(merchantList)){
                                this.props.dispatch(goto('ConfirmOrder', this._settlement()));
                            }else{
                                this.settlementDialog.show(merchantList);
                            }
                        }}
                        isDeleteMode={this.state.isDeleteMode}/>
                </View>
            );
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this.loadShoppingCart();
            }}/>
        ) : (
            listView
        );
        return (
            <View style={{flex: 1,backgroundColor:mainBackgroundColor}}>
                <TitleBar
                    title={'购物车'}
                    hideLeft={true}
                    hideRight={this.props.shoppingCart.length === 0}
                    customRightView={() => (<Text style={{color: 'white'}}>{this.state.isDeleteMode?'完成':'编辑'}</Text>)}
                    onRightViewClick={()=>{this.setState({isDeleteMode:!this.state.isDeleteMode})}}
                    />
                {this.state.isLoading ? <LoadingView/> : showView}
                <SettlementDialog
                    ref={settlementDialog=>this.settlementDialog = settlementDialog}
                    onClickSettlementBtn={
                        (merchantId)=>{
                            this.props.dispatch(goto('ConfirmOrder', this._settlement(merchantId)));
                        }
                    }
                />
            </View>
        )
    }
}

selector = (state) => {
    return {
        shoppingCart: state.shoppingCartStore.shoppingCart,
        token: state.loginStore.token,
        updateShoppingFlag: state.cacheStore.updateShoppingFlag,
    }
};
export default connect(selector)(ShoppingCart);