import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    StatusBar,
    Animated,
    FlatList,
    DeviceEventEmitter,
    ActivityIndicator,
} from 'react-native';
import TitleBar from '../../widgets/TitleBar'
import {showToastShort} from "../../common/CommonToast";
import ProductFilterView from './module/ProductFilterView'
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from '../../widgets/RequestErrorView';
import {goto} from '../../reducers/RouterReducer';
import {connect} from 'react-redux';
import XImage from '../../widgets/XImage'
const {width} = Dimensions.get('window');
import {
    titleTextColor,
    placeholderTextColor,
    contentTextColor,
    mainColor,
    mainBackgroundColor, priceColor,
} from "../../constraint/Colors";

import {ic_screen, ic_upper_arrow, ic_down_arrow, ic_search} from "../../constraint/Image";
import {isSuccess, post} from "../../common/CommonRequest";
import {formatMoney} from "../../common/StringUtil";
import {gotoDetail} from "../../common/ProductUtil";
import EmptyView from "../common/empty/EmptyView";
import LFlatList from "../../widgets/LFlatList";

let widths = (width - 40) / 3;

const ORDER_COMPREHENSIVE = 'COMMON';

const ORDER_SALES_ASC = 'SALES ASC';
const ORDER_SALES_DESC = 'SALES DESC';

const ORDER_PRICE_ASC = 'PRICE ASC';
const ORDER_PRICE_DESC = 'PRICE DESC';


class ProductList extends Component {

    constructor(props) {
        super(props);

        //请求的目标ID {对象}
        // {brandIds:['11111','asdasd']}
        // {groupId:'11111'}
        // {categoryId:'11111'}
        this.requestTargetId = this.props.navigation.state.params.id;
        this.isSortByComprehensive = true;//综合排序
        this.isSortBySalesAsc = undefined;
        this.isSortByPriceAsc = undefined;

        this.beginPrice = null;
        this.endPrice = null;

        this.brandArrayID = [];
        this.specArrayID = [];

        this.orderBy = ORDER_COMPREHENSIVE;

        this.state = {
            isRequestError: false,
            isSortByComprehensive:true,
            isSortSales: false,
            isSortPrice: false,
        };

    }

    componentDidMount() {

        this.listener = DeviceEventEmitter.addListener('Good', (beginPrice, endPrice, brandArrayID, specArrayID) => {
            this.beginPrice = beginPrice;
            this.endPrice = endPrice;
            this.brandArrayID = brandArrayID;
            this.specArrayID = specArrayID;
            this.sortByComprehensive();
        });
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    _getProductList(page = 1, callback, options){

        let requestObj = { pageSize: 18,
            pageNo: page,
            orderBy: this.orderBy,
            beginPrice: this.beginPrice,
            endPrice: this.endPrice,
            brandIds: this.brandArrayID,
            specList: this.specArrayID,
        };

        // Object.assign(requestObj,this.action === 'APP_GOTO_PRODUCT_GROUP_LIST'?{groupId:this.categoryId}:{categoryId: this.categoryId});
        Object.assign(requestObj,this.requestTargetId);
        post('product/list', requestObj,page === 1)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    callback(responseData.result.data,{haveNext: responseData.result.pageCount > responseData.result.pageNo,})
                } else {
                    this._errorMsg("请求出现异常");
                }
            }).catch((e) => {
                this._errorMsg(e.message);
            })
        ;
    }

    _errorMsg(msg) {
        this.setState({
            isRequestError: true,
            isLoading: false,
        });
        showToastShort(msg);
    }

    sortByComprehensive() {
        this.orderBy = ORDER_COMPREHENSIVE;
        this.setState({
            isSortByComprehensive:true,
            isSortBySales:false,
            isSortPrice:false,
        },()=>{
            this.productList.reset();
        });
    }

    sortBySales() {
        this.isSortBySalesAsc = this.isSortBySalesAsc === undefined?false:!this.isSortBySalesAsc;
        this.orderBy = this.isSortBySalesAsc?ORDER_SALES_ASC:ORDER_SALES_DESC;
        this.setState({
            isSortByComprehensive:false,
            isSortBySales:true,
            isSortPrice:false,
        },()=>{
            this.productList.reset();
        });
    }

    sortByPrice() {
        this.isSortByPriceAsc = this.isSortByPriceAsc === undefined?false:!this.isSortByPriceAsc;
        this.orderBy = this.isSortByPriceAsc?ORDER_PRICE_ASC:ORDER_PRICE_DESC;
        this.setState({
            isSortByComprehensive:false,
            isSortBySales:false,
            isSortPrice:true,
        },()=>{
            this.productList.reset();
        });
    }

    render() {
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.productList.reset();
            }}/>
        ) : (
            <View style={styles.container}>
                <View style={{
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    width: width,
                    height: 45,
                    alignItems: 'center'
                }}>
                    <TouchableOpacity activeOpacity={0.7} style={{
                        flex: 2,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} onPress={()=>{this.sortByComprehensive()}}>
                        <Text
                            style={[styles.comprehensiveTankingStyle, {color: this.state.isSortByComprehensive ? mainColor : contentTextColor}]}>{'综合排序'}</Text>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                    <TouchableOpacity activeOpacity={0.7} style={styles.salesVolumeStyle}
                                      onPress={()=>{this.sortBySales()}}>
                        <Text
                            style={[styles.textStyle, {color: this.state.isSortBySales? mainColor : contentTextColor}]}>{'销量'}</Text>
                        <Image source={this.isSortBySalesAsc ? ic_upper_arrow : ic_down_arrow}
                               style={styles.arrowStyle}/>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                    <TouchableOpacity activeOpacity={0.7} style={styles.salesVolumeStyle}
                                      onPress={()=>{this.sortByPrice()}}>
                        <Text
                            style={[styles.textStyle, {color: this.state.isSortPrice? mainColor : contentTextColor}]}>{'价格'}</Text>

                        <XImage source={this.isSortByPriceAsc ? ic_upper_arrow : ic_down_arrow}
                                style={styles.arrowStyle}/>
                    </TouchableOpacity>
                    <View style={styles.line}/>
                    <TouchableOpacity activeOpacity={0.7} style={styles.electionStyle} onPress={() => {
                        this.refs.ProductFilterView.show()
                    }}>
                        <XImage source={ic_screen} style={styles.screenStyle}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.lineHorizontal}/>
                    <View style={{
                        backgroundColor: 'white',
                        flex: 1,}}>

                        <LFlatList
                            ref={productList=>this.productList = productList}
                            onLoadMore={this._getProductList.bind(this)}
                            keyExtractor={(item, index) => index}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={() => <View style={{height: 5}}/>}
                            emptyView={()=><EmptyView emptyTip={'找不到商品哦'} showRecommended={false}/>}
                            loadMoreable={true}
                            refreshable={false}
                            withSections={false}
                            renderItem={({item,index}) => <View key={index}>
                                <TouchableOpacity
                                    style={{width: width / 3}}
                                    activeOpacity={0.7}//点击时的透明度
                                    onPress={() => gotoDetail(item, this.props.dispatch)}>
                                    <XImage uri={item.path}
                                            style={{
                                                marginLeft: 10,
                                                resizeMode: 'cover',
                                                width: widths,
                                                height: widths,
                                            }}/>
                                    <Text style={styles.itemText} numberOfLines={2}>{item.name}</Text>
                                    <Text style={styles.priceText} numberOfLines={1}>{formatMoney(item.salePrice)}</Text>
                                </TouchableOpacity>
                            </View>
                            }/>
                    </View>
                <ProductFilterView
                    onBuyClick={() => {
                        this.refs.ProductFilterView.dismiss()
                    }}
                    ref={'ProductFilterView'}
                    id={this.requestTargetId}/>
            </View>
        );

        return (
            <View style={styles.container}>

                <TitleBar title={'商品列表'}
                          hideRight={false}
                          onRightViewClick={() => {
                              this.props.dispatch(goto('SearchGoods'))
                          }}
                          customRightView={() => (<Image source={ic_search}
                                                         style={styles.rightBarImageStyle}
                          />)}
                />
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>

        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: mainBackgroundColor
    },
    rightBarImageStyle: {
        resizeMode: 'cover',
        width: 20,
        height: 20,
        position: 'relative',
    },
    comprehensiveTankingStyle: {
        textAlign: 'center',
        fontSize: 16,
        alignItems: "center",
    },
    salesVolumeStyle: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',

    },
    electionStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textStyle: {
        flex: 1,
        textAlign: 'right',
        fontSize: 16,
    },
    arrowStyle: {
        resizeMode: 'contain',
        position: 'relative',
        flex: 1,
        width: 12,
        height: 6,
        marginLeft: -22,
    },
    screenStyle: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
    },
    visibleStyle: {
        // marginLeft:100,
        backgroundColor: '#878787',
        // justifyContent: 'center',
        alignItems: 'flex-end',
    },
    line: {
        backgroundColor: placeholderTextColor,
        width: 0.5,
        height: 25
    },
    lineHorizontal: {
        backgroundColor: placeholderTextColor,
        width: width,
        height: 0.5,
    },
    itemText: {
        color: titleTextColor,
        marginHorizontal: 10,
        textAlign: 'center',
        marginTop: 15,
        fontSize: 12.5,
        // width:width/3,
        // backgroundColor:'red'
    },
    priceText: {
        color: priceColor,
        marginTop: 5,
        marginBottom: 8,
        marginHorizontal: 10,
        textAlign: 'center',
        fontSize: 11,
        // backgroundColor:'blue'

    },
});

export default connect()(ProductList);
