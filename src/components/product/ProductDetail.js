import React, {Component} from 'react';
import {
    View, StyleSheet, ScrollView, DeviceEventEmitter, Dimensions, Platform, FlatList, Text,
    NativeModules,
    Image, TouchableOpacity,
} from 'react-native';
import ProductBottomView from './module/ProductBottomView';
import BasicInfoView from './module/BasicInfoView';
import ProductMiddleView from './module/ProductMiddleView';

import TitleBar from '../../widgets/TitleBar';
import RequestErrorView from '../../widgets/RequestErrorView';
import {post, getRequestFailTip,  isSuccess} from "../../common/CommonRequest"
import {showToastShort} from "../../common/CommonToast";
import CarouselProduct from "../../widgets/CarouselProduct";
import {
    contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../constraint/Colors";
import {connect} from "react-redux";
import SelectProductDialog from "./module/SelectProductDialog";
import LoadingView from "../../widgets/LoadingView";
import {goBack, goto} from "../../reducers/RouterReducer";
import {addShoppingCart} from "../../reducers/ShoppingCartReducer";
import BaseComponent from "../../widgets/BaseComponent";
import AutoHeightWebView from "../../widgets/AutoHeightWebView";
import CommentListView from "./module/CommentListView";
import {isIphoneX} from "react-native-iphone-x-helper";
import IphoneModel from "../../widgets/IphoneModel";
import {ic_right_arrows, ic_share_white} from "../../constraint/Image";
import {COMMON, OIL_CARD} from "../../constraint/ProductType";
import {CommonStyles} from "../../styles/CommonStyles";
import ShareDialog from "../../widgets/dialog/ShareDialog";
import XImage from "../../widgets/XImage";

const {width, height} = Dimensions.get('window');

var navigation = null;
let buyTitle=null;
class ProductDetail extends BaseComponent {
    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        this.state = {
            isRequestError: false,
            isLoading: true,
            detailImageUrlList: [],
            data: {},
            isCollected:false,
            isSelected:0,
            purchaseQuantity:0,
            showShareDialog:false,
        };
    }

    componentDidMount(){
        setTimeout(() => {
            this._loadProductDetail();
        }, 250);

        //路由中是否存在'Store'
        this.isHasStore=false;
        for (let route of this.props.nav.routes) {
            if (route.routeName ==='Store') this.isHasStore=true;
        }
    }

    componentWillUnmount(){
        if(!this.state.isCollected){
            let productId = navigation.state.params? navigation.state.params : '';
            DeviceEventEmitter.emit('REMOVE_COLLECT_PRODUCT_ID',productId);
        }
    }

    _loadProductDetail(){
        let productId = navigation.state.params? navigation.state.params : '';
        post('product/detailInfo', {'productId': productId, 'token': this.props.token})
            .then((productData) => {
                if (isSuccess(productData)) {
                    this.setState({
                        detailImageUrlList: productData.result.imgs,
                        data: productData.result,
                        isCollected: productData.result.isCollected,
                        isLoading:false,
                        isRequestError: false,
                    });
                } else{
                    this._errorMsg(productData);
                }
            }).catch((e) => {
            this._errorMsg(e);
        });
    }
    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(getRequestFailTip(msg));
    }
    _getPurchaseQuantity(skuId){    //查询油卡限购数量
        let requestObj = {'skuId': skuId, 'token': this.props.token};
            post('order/oilCard/getPurchaseQuantity', requestObj,true)
                .then((responseData) => {
                    if (isSuccess(responseData)) {
                        this.setState({purchaseQuantity:responseData.result})
                    }else if(this.checkUserTokenValid({response:responseData},false)){
                        showToastShort(getRequestFailTip(responseData));
                    }
                }).catch((e) => {
                showToastShort(e.message);
            });
    }
    _addShoppingCart(skuId, quantity){  //加入购物车
        let requestObj = {'skuId': skuId, 'quantity': quantity, 'token': this.props.token};
        post('product/shoppingCart/addShoppingCart', requestObj,true)
            .then((productData) => {
                if (isSuccess(productData)) {
                    this.props.dispatch(addShoppingCart(quantity));
                } else if(this.checkUserTokenValid({response:productData},false)){
                    showToastShort(getRequestFailTip(productData));
                }
            }).catch((e) => {
            showToastShort(e.message);
        });
    }

    _collect(action){   //收藏商品
        let productId = navigation.state.params? navigation.state.params : '';
        let requestObj = {'productId': productId, 'action': action, 'token': this.props.token};
        post('product/collection', requestObj,true)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState(preState => {
                        return {isCollected: !preState.isCollected};
                    });
                    if (this.state.isCollected)showToastShort('收藏成功');
                    else showToastShort('已取消收藏');
                } else if(this.checkUserTokenValid({response:responseData},false)){
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(e.message);
        })
    }

    _contentViewScroll(e: Object){
        let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        let contentSizeHeight = e.nativeEvent.contentSize.height; //scrollView contentSize高度
        let oriageScrollHeight = e.nativeEvent.layoutMeasurement.height; //scrollView高度
        // console.warn("offsetY:" + offsetY +',contentSizeHeight:' + contentSizeHeight + ',oriageScrollHeight:' + oriageScrollHeight);
        if ((offsetY + oriageScrollHeight) >= contentSizeHeight - 50){
            if (this.refs.CommentListView)this.refs.CommentListView._loadMoreComment();
        }
    }

    render() {
        let {dispatch} = this.props;
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false,isLoading:true,});
                this._loadProductDetail();
            }}/>
        ) : (
            <View style={{flex: 1,backgroundColor:mainBackgroundColor}}>
                <ScrollView
                    ref={'ScrollView'}
                    style={{flex: 1}} onMomentumScrollEnd={this._contentViewScroll.bind(this)} stickyHeaderIndices={[1]}>
                    <View ref={'headerView'} style={styles.container}>
                        <CarouselProduct data={this.state.detailImageUrlList}/>
                        <BasicInfoView data={this.state.data}/>
                        <View style={{height:10,backgroundColor:mainBackgroundColor}}/>
                        {/*{!this.state.data.merchant?null:*/}
                            {/*<TouchableOpacity*/}
                                {/*style={{flexDirection:'row', alignItems: 'center', backgroundColor: '#fff',padding:10, height:80}}*/}
                                {/*onPress={()=> {*/}
                                    {/*// if(this.isHasStore)dispatch(goBack('Store'));*/}
                                    {/*// else dispatch(goto('Store',this.state.data.merchant.id));*/}
                                {/*}}*/}
                                {/*activeOpacity={0.7}>*/}
                                {/*<View style={styles.imgView}>*/}
                                    {/*<XImage style={{height: 58, width: 58}} uri={this.state.data.merchant.logo}/>*/}
                                {/*</View>*/}
                                {/*<View style={{flex:1}}>*/}
                                    {/*<Text style={{color: titleTextColor}}>{this.state.data.merchant.name}</Text>*/}
                                    {/*<Text style={{color: titleTextColor, marginTop: 5}}>在售商品<Text style={{color: mainColor}}>{this.state.data.merchant.saleCount}</Text>个</Text>*/}
                                {/*</View>*/}
                                {/*<XImage source={ic_right_arrows} style={{width: 22*0.53, height: 22,resizeMode:'stretch'}}/>*/}
                            {/*</TouchableOpacity>*/}
                        {/*}*/}
                        <View style={{height:this.state.data.merchant?10:0,backgroundColor:mainBackgroundColor}}/>
                    </View>
                    <ProductMiddleView
                        ref={'productMiddleView'}
                        appraiseCount={this.state.data.appraiseCount}
                        isSelected={(isSelected)=>{
                            this.measureHeaderView();
                            this.setState({isSelected})

                        }}/>
                    <View style={styles.detail}>
                        {this.detailView()}
                    </View>

                </ScrollView>
                <View style={{height: 0.5, backgroundColor: placeholderTextColor}}/>
                <ProductBottomView
                    isOilCard={this.state.data.type=== OIL_CARD}
                    isCollected={this.state.isCollected}
                    onCollectPress={()=> this.onCollected()}
                    onEnterTheShop={()=> {
                        if (this.state.data.merchant){
                            if(this.isHasStore)dispatch(goBack('Store'));
                            else dispatch(goto('Store',this.state.data.merchant.id));
                        }
                    }} // 进入店铺
                    onCartPress={() => this._showDialog('加入购物车')}
                    onBuyPress={() => {
                        if (this.state.data.type===OIL_CARD) this._getPurchaseQuantity(this.state.data.showSkuId);
                        this._showDialog('立即购买')
                    }}/>
                <SelectProductDialog
                    ref={'SelectProductDialog'}
                    data={this.state.data}
                    purchaseQuantity={this.state.purchaseQuantity}
                    loadPurchaseQuantity={skuId => this._getPurchaseQuantity(skuId)}
                    onPress={(count, skuId, salePrice, purchaseQuantity) => {
                        if (buyTitle === "加入购物车") this._addShoppingCart(skuId,count);
                        if (buyTitle === "立即购买") dispatch(goto('ConfirmOrder',{removeShoppingCart:'N',products:{productIds:[{productSkuId: skuId, quantity: count.toString(),comment:''}],
                            number:count,total:count*salePrice,type:this.state.data.type,
                            purchaseQuantity:this.state.data.type===OIL_CARD?purchaseQuantity:undefined}}));
                        this.refs.SelectProductDialog.dismiss();
                    }}/>
            </View>
        );

        return (
            <View style={{flex: 1}}>
                <TitleBar title={'商品详情'}
                          // hideRight={this.state.data.type !== COMMON}
                          hideRight={true}
                          customRightView={()=><Image source={ic_share_white} style={CommonStyles.titleBarRightImageStyle}/>}
                          onRightViewClick={()=>{this.shareDialog.show();}}/>
                {this.state.isLoading ? <LoadingView/> :showView }
                <ShareDialog
                    ref={(shareDialog)=>this.shareDialog = shareDialog}
                    onClickMomentBtn={() => {
                        if (NativeModules.InteractionModule) {
                            NativeModules.InteractionModule.shareWechatMoment('{"title":"自然e家","content":"自然e家111","url":"http://m.ejiamall.cn/mm/control/main?psid=8000","imageUrl":"http://bonn.qiniudn.com/images/Company/20171221/20171221162637879.png","site":"自然e家","titleUrl":"http://m.ejiamall.cn/mm/control/main?psid=8000"}');
                        }
                    }}
                    onClickWechatBtn={() => {
                        if (NativeModules.InteractionModule) {
                            NativeModules.InteractionModule.shareWechat('{"title":"自然e家","content":"自然e家111","url":"http://m.ejiamall.cn/mm/control/main?psid=8000","imageUrl":"http://bonn.qiniudn.com/images/Company/20171221/20171221162637879.png","site":"自然e家","titleUrl":"http://m.ejiamall.cn/mm/control/main?psid=8000"}');
                        }
                    }}
                    onClickQQBtn={() => {
                        if (NativeModules.InteractionModule) {
                            NativeModules.InteractionModule.shareQQ('{"title":"自然e家","content":"自然e家111","url":"http://m.ejiamall.cn/mm/control/main?psid=8000","imageUrl":"http://bonn.qiniudn.com/images/Company/20171221/20171221162637879.png","site":"自然e家","titleUrl":"http://m.ejiamall.cn/mm/control/main?psid=8000"}');
                        }
                    }}
                    onClickQZoneBtn={() => {
                        if (NativeModules.InteractionModule) {
                            // NativeModules.InteractionModule.shareQZone('{\"content\":[\"自然e家\", \"http://m.ejiamall.cn/mm/control/main?psid=8000\", \"自然e家\", \"自然e家\", \"\", \"http://bonn.qiniudn.com/images/Company/20171221/20171221162637879.png\"]}');
                            NativeModules.InteractionModule.shareQZone('{"title":"自然e家","content":"自然e家111","url":"http://m.ejiamall.cn/mm/control/main?psid=8000","imageUrl":"http://bonn.qiniudn.com/images/Company/20171221/20171221162637879.png","site":"自然e家","titleUrl":"http://m.ejiamall.cn/mm/control/main?psid=8000"}');
                        }
                    }}
                />
                <IphoneModel/>
            </View>
        );
    }

    detailView() {
        let views = [];
        views.push(Platform.OS === 'android' ? (<AutoHeightWebView
                source={{html: this.state.data.detail}}
                scrollStyle={{minHeight:height-50-(isIphoneX()?79:45)-(isIphoneX() ? (44 + 45) : (45 + defaultTop))}}
                mediaPlaybackRequiresUserAction={true}
                javaScriptEnabled={true}
            />) :
            (<AutoHeightWebView
                scrollStyle={{minHeight:height-50-(isIphoneX()?79:45)-(isIphoneX() ? (44 + 45) : (45 + defaultTop))}}
                automaticallyAdjustContentInsets={false}
                source={{html: this.state.data.detail}}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                decelerationRate="normal"
                startInLoadingState={true}
                scalesPageToFit={false}
            />));
        views.push(
            <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.data.descs}
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) =>
                    <View key={index} style={[styles.des,{marginTop:index===0?20:0}]}>
                        <Text style={styles.desTxt}>{item.descText}： </Text>
                        <Text style={styles.desTxt1}>{item.descValueText}</Text>
                    </View>
                }
            />);
        views.push(<CommentListView ref='CommentListView' dispatch={this.props.dispatch} productId={this.state.data.id}/>);
        return views[this.state.isSelected]
    }
    onCollected() {
        if(this.checkUserTokenValid({title:'您还没有登录'},false)){
            if (this.state.isCollected) this._collect('CANCEL');
            else this._collect('COLLECT')
        }
    }

    _showDialog(title) {
        buyTitle = title;
        if(this.checkUserTokenValid({title:'您还没有登录'},false)){
            this.refs.SelectProductDialog.show(title);
        }
    }

    measureHeaderView() {
        // const handle = findNodeHandle(this.refs.headerView);
        // UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
        //     this.refs.ScrollView.scrollResponderScrollTo({x: 0, y: height, animated: false}, 0);
        // });
        this.refs.headerView.measureInWindow((x, y, width, height) => {
            this.refs.ScrollView.scrollResponderScrollTo({x: 0, y: height,animated:false},0);
        });
    }
}
const defaultTop = Platform.OS === 'android' ? 25 : 20;
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    detail: {
        minHeight:height-50-(isIphoneX()?79:45)-(isIphoneX() ? (44 + 45) : (45 + defaultTop))-1,
        backgroundColor: 'white',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        // overflow: 'hidden',
    },
    des: {
        height:45,
        flexDirection:'row',
        alignItems:'center',
        padding:10,
    },
    desTxt: {
        width:width/3,
        color: contentTextColor,
        marginHorizontal:10,
    },
    desTxt1: {
        flex:1,
        color: contentTextColor,
        marginHorizontal:10,
    },
    imgView: {
        height:60,
        width:60,
        marginLeft:5,
        marginRight:15,
        borderWidth:0.5,
        borderColor:placeholderTextColor,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.4,
        elevation: 2,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
    },
});

/**
 * 声明在store tree 需要获取那部分数据
 * @param state
 * @returns {{token: string}}
 */
selector = (state) =>{
    return {
        token:state.loginStore.token,
        nav:state.nav,
    }
};

export default connect(selector)(ProductDetail);