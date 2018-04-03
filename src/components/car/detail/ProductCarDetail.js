import React, {Component} from 'react';
import {View, Dimensions, Platform, ScrollView, Image, TouchableOpacity, Text} from 'react-native';

import TitleBar from '../../../widgets/TitleBar';
import RequestErrorView from '../../../widgets/RequestErrorView';
import {post,getRequestFailTip, isSuccess} from "../../../common/CommonRequest"
import {showToastShort} from "../../../common/CommonToast";
import CarouselProduct from "../../../widgets/CarouselProduct";
import AutoHeightWebView from '../../../widgets/AutoHeightWebView';
import {
    contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../../constraint/Colors";
import {connect} from "react-redux";
import {goto} from "../../../reducers/RouterReducer";
import LoadingView from "../../../widgets/LoadingView";
import {isIphoneX} from "react-native-iphone-x-helper";
import SelectProductDialog from "../../product/module/SelectProductDialog";
import {formatMoney} from "../../../common/StringUtil";
import {PAYMENTS_CONFIG} from "../../../constraint/AssetsType";
import BaseComponent from "../../../widgets/BaseComponent";
import RecommendDialog from "../../home/module/RecommendDialog";
import {saveSingleOtherConfig} from "../../../reducers/LoginReducer";
import {OIL_CARD} from "../../../constraint/ProductType";
import {isTrue} from "../../../common/AppUtil";
import IphoneModel from "../../../widgets/IphoneModel";

const {width, height} = Dimensions.get('window');

class ProductCarDetail extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            detailImageUrlList: [],
            data: {},
            purchaseQuantity: 0,
            referrer:'',
            canBuy:true
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this._loadProductDetail();
        }, 250);
    }

    _loadProductDetail() {
        let requestObj = {
            'productId': this.props.navigation.state.params,
            'token': this.props.token
        };

        post('product/detailInfo', requestObj)
            .then((productData) => {
                if (isSuccess(productData)) {
                    this.setState({
                        detailImageUrlList: productData.result.imgs,
                        data: productData.result,
                        isLoading: false,
                        isRequestError: false,
                    });
                } else {
                    this._errorMsg(productData ? productData.message : "请求出现异常");
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

    _getPurchaseQuantity(skuId) {    //查询油卡限购数量
        post('order/oilCard/getPurchaseQuantity', {'skuId': skuId, 'token': this.props.token}, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({purchaseQuantity: responseData.result.quantity, canBuy:responseData.result.canBuy})
                } else if (this.checkUserTokenValid({response: responseData}, false)) {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    _getReferrer(text) {    //获取推荐人用户名
        this.loginName = text;
        post('user/getRecommend', {'recommend': text}, true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({referrer: responseData.result.loginName})
                } else if (this.checkUserTokenValid({response: responseData}, false)) {
                    showToastShort(getRequestFailTip(responseData));
                    this.setState({referrer: ''})
                }
            }).catch((e) => {
            showToastShort(e.message);
            this.setState({referrer: ''})
        });
    }

    _bindRecommend() {  //会员绑定推荐人
        let requestObj = {'recommend': this.loginName, 'token': this.props.token};
        post('user/bindRecommend', requestObj,true)
            .then((responseData) => {
                this.refs.RecommendDialog.dismiss();
                if (isSuccess(responseData)) {
                    showToastShort("绑定成功");
                    this.props.dispatch(saveSingleOtherConfig('isHasRecommend','Y'));
                } else if (this.checkUserTokenValid({response: responseData}, false)) {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            this.refs.RecommendDialog.dismiss();
            showToastShort(e.message);
        });
    }

    render() {
        let webView = Platform.OS === 'android' ? (
            <AutoHeightWebView
                source={{html: this.state.data.detail}}
                mediaPlaybackRequiresUserAction={true}
                javaScriptEnabled={true}
            />) : (
            <AutoHeightWebView
                automaticallyAdjustContentInsets={false}
                source={{html: this.state.data.detail}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                startInLoadingState={true}
                scalesPageToFit={false}
            />);
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadProductDetail();
            }}/>
        ) : (
            <View style={{flex: 1,}}>
                <ScrollView style={{flex: 1}}>
                    <CarouselProduct data={this.state.detailImageUrlList}/>
                    {this.BasicInfoView()}
                    {webView}
                </ScrollView>
                <TouchableOpacity
                    style={{
                        width: width,
                        height: 45,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: mainColor,
                        elevation: 5
                    }}
                    activeOpacity={0.8}//点击时的透明度
                    onPress={() => this._showDialog()}>
                    <Text style={{color: '#FFFFFF', fontSize: 18}}>立即购买</Text>
                </TouchableOpacity>
                <SelectProductDialog
                    ref={'SelectProductDialog'}
                    data={this.state.data}
                    canBuy={this.state.canBuy}
                    isBuyCar={this.state.data.type !== OIL_CARD}
                    purchaseQuantity={this.state.purchaseQuantity}
                    loadPurchaseQuantity={skuId => this._getPurchaseQuantity(skuId)}
                    onPress={(count, skuId, salePrice, purchaseQuantity) => {
                        if (this.state.data.type === OIL_CARD){
                            this.props.dispatch(goto('ConfirmOrder', {
                                products: {
                                    productIds: [{productSkuId: skuId, quantity: count.toString(),comment:''}],
                                    number: count, total: count * salePrice, type: this.state.data.type,
                                    purchaseQuantity: this.state.data.type === OIL_CARD ? purchaseQuantity : undefined
                                }
                            }));
                        }else {
                            this.props.dispatch(goto('ConfirmCarOrder', {productSkuId: skuId}))
                        }
                        this.refs.SelectProductDialog.dismiss();
                    }}/>
            </View>
        );
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                <TitleBar title={this.state.data.type === OIL_CARD?'商品详情':'购车详情'}/>
                {this.state.isLoading ? <LoadingView/> : showView}
                <RecommendDialog ref={'RecommendDialog'} referrer={this.state.referrer}
                                 onEnd={(text)=> this._getReferrer(text)}
                                 confirm={()=> this._bindRecommend()}/>
                <IphoneModel/>
            </View>
        );
    }

    _getUseIntegralText(payWays){
        if(payWays && payWays.length > 0){
            let payType = (payWays.length===1?'使用':'') + PAYMENTS_CONFIG[payWays[0].accountType].name + '：';
            return <Text style={{marginBottom: 5, color: contentTextColor}}>{payType} {formatMoney(payWays[0].maxPay,false)}</Text>
        }
    }

    //商品基本信息
    BasicInfoView() {

        return (
            <View style={{padding: 20, marginBottom: -1, backgroundColor: '#FFFFFF'}}>
                <Text style={{fontSize: 18, color: titleTextColor,}}>{this.state.data.name}</Text>
                {this.state.data.brand?<Text style={{fontSize: 15, color: titleTextColor, marginTop: 5}}>品牌：{this.state.data.brand}</Text>:null}
                <Text style={{
                    fontSize: 16,
                    marginTop: 15,
                    color: mainColor,
                    marginBottom: 5,
                }}>{"价格：" + formatMoney(this.state.data.salePrice)}</Text>
                <View style={{marginBottom: 10, flexDirection: 'row', alignItems: 'flex-end'}}>
                    <View style={{flex: 1}}>
                        {this._getUseIntegralText(this.state.data.payWays)}
                    </View>
                    <Text style={{marginBottom: 5,color: contentTextColor}}>已售：{this.state.data.sales} 件</Text>
                </View>
                <View style={{marginTop: 15, marginBottom: 10, backgroundColor: placeholderTextColor, height: 0.5}}/>
                <Text style={{fontSize: 17, color: titleTextColor, marginTop: 10}}>商品详情</Text>
            </View>
        );
    }

    _showDialog() {
        if(this.checkUserTokenValid({title:'您还没有登录'},false)){
            if (isTrue(this.props.isHasRecommend)){
                if (!isTrue(this.props.isRealNameAuth)){
                    this.props.dispatch(goto('Certification'))
                }else if (this.state.data.type === OIL_CARD){
                    this._getPurchaseQuantity(this.state.data.showSkuId);
                    this.refs.SelectProductDialog.show('立即购买');
                }else {
                    // if (this.state.data.skus[0].stock <= 0) showToastShort('库存不足');
                    // else this.props.dispatch(goto('ConfirmCarOrder', {productSkuId: this.state.data.showSkuId}))
                    this.refs.SelectProductDialog.show('立即购买');
                }
            } else {
                this.setState({referrer: ''}, () => this.refs.RecommendDialog.show());
            }
        }
    }
}

/**
 * 声明在store tree 需要获取那部分数据
 * @param state
 * @returns {{text: string}}
 */
selector = (state) => {
    return {
        token: state.loginStore.token,
        isHasRecommend: state.loginStore.otherConfig.isHasRecommend,
        isRealNameAuth: state.loginStore.otherConfig.isRealNameAuth,
    }
};
export default connect(selector)(ProductCarDetail);