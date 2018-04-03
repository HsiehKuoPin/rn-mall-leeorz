import React, {Component} from 'react';
import {
    View, Dimensions, TouchableOpacity, DeviceEventEmitter, Text
} from 'react-native';
import {showToastShort} from "../../common/CommonToast";
import {post, isSuccess} from "../../common/CommonRequest"
import LFlatList from '../../widgets/LFlatList';
import {mainBackgroundColor, titleTextColor} from "../../constraint/Colors";
import {connect} from 'react-redux'
import SearchBar from "../home/home/SearchBar";
import CarouselHome from "../home/home/CarouselHome";
import RequestErrorView from '../../widgets/RequestErrorView';
import StoreModule from './widget/StoreModule';
import StoreSale from './widget/StoreSale';
import StoreAllGoods from './widget/StoreAllGoods';
import NewProduct from './widget/NewProduct';
import StoreCategory from './widget/StoreCategory';
import XImage from "../../widgets/XImage";

const {width, height} = Dimensions.get('window');
const moduleStyle = {
    BANNER: 'BANNER',   //轮播图
    NEW_PRODUCT: 'NEW_PRODUCT',
    ALL_GOODS: 'ALL_GOODS',
};
var merchantId;

class Store extends Component {
    constructor(props) {
        super(props);
        merchantId = this.props.navigation.state.params;
        // merchantId = '9999';
        this.state = {
            hidden: true,
            isRequestError: false,
            isLoadMore: false,
            opacity: 0,
            categories: [],
            categoryId: '',
            title:'店铺'
        };
    }

    render() {
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => this.setState({isRequestError: false})}/>
        ) : (
            <LFlatList
                ref="giftedListView"
                renderItem={this._renderRowView.bind(this)}
                onRefreshing={this._onRefresh.bind(this)}
                onLoadMore={this._onLoadMore.bind(this)}
                refreshable={true}
                withSections={false}
                loadMoreable={false}
                isMounted={false}
                onScroll={this._contentViewScroll.bind(this)}
                isShowFirstLoadView={true}
                enableEmptySections={true}
                refreshableTintColor="blue"/>
        );
        return (
            <View
                style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {showView}
                {this.state.hidden ? null : (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{position: 'absolute', marginTop: height - 150, marginLeft: width - 65}}
                        onPress={() => {
                            this.refs.giftedListView._scrollToIndex(0, 0)
                        }}>
                        <XImage style={{width: 48, height: 80}}
                                uri={'http://p0xkrqo35.bkt.clouddn.com/1517643684329.png'}/>
                    </TouchableOpacity>
                )}
                <SearchBar opacity={this.state.opacity} onlyTitle={true} showTitle={true} title={this.state.title}/>
                <StoreCategory data={this.state.categories}
                               ref={'StoreCategory'}/>
            </View>
        )
    }

    componentWillUnmount() {
        this.listener.remove();
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('Category', (id) => {
            this.setState({categoryId: id});
            this.refs.giftedListView.reset()
        });
    }

    _onRefresh(callback, options) {
        var rows = [];
        let canLoadMore = false;
        Promise.all([post('main/merchant/home', {merchantId: merchantId}),
            post('product/merchant/list/NEW_PRODUCT', {merchantId: merchantId})])
            .then(([merchantData, newProductData]) => {
                if (isSuccess(merchantData) && isSuccess(newProductData)) {
                    this.setState({categories: merchantData.result.categories});
                    rows.push({"data": merchantData.result, 'modelId': moduleStyle.BANNER});
                    rows.push({"data": newProductData.result, 'modelId': moduleStyle.NEW_PRODUCT});

                    canLoadMore = true;
                    this.setState({
                        isLoadMore: true,
                        title:merchantData.result.name
                    });

                    callback(rows, {
                        isShowFirstLoadView: false,
                        haveNext: canLoadMore,
                        loadMoreable: canLoadMore,
                        pageNumber: 1
                    });
                } else {
                    this._errorMsg(callback, rows, merchantData.message);
                }
            }).catch((e) => {
            this._errorMsg(callback, rows, e.message);
        });
    }

    _errorMsg(callback, rows, msg) {
        callback(rows, {isShowFirstLoadView: false,});
        this.setState({
            isRequestError: true,
        });
        showToastShort(msg);
    }

    _onLoadMore(page = 1, callback, options) {
        let requestObj = {
            merchantId: merchantId,
            categoryId: this.state.categoryId,
            search: '',
            orderBy: '',
            pageNo: page,
            pageSize: 20,
        };
        post('product/merchant/list', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    var rows = [];
                    rows.push({"data": responseData.result, 'modelId': moduleStyle.ALL_GOODS});
                    callback(rows, {haveNext: (responseData.result.pageNo * responseData.result.pageSize < responseData.result.dataCount)});
                } else {
                    callback([], {requestError: true});
                    showToastShort(responseData.message);
                }
            })
            .catch((e) => {
                callback([], {requestError: true});
                showToastShort(e.message);
            });
    }

    _renderRowView({item, index}) {
        let rowData = item;
        let modelId = rowData.modelId;
        if (modelId === moduleStyle.BANNER) {           //广告轮播图
            return (<View>
                <CarouselHome data={rowData.data.banners} isHeight={true} isNeedDot={true}/>
                <StoreModule pressCategory={() => {
                    this.refs.StoreCategory.show()
                }}/>
                <StoreSale data={rowData.data}/>
            </View>)
        }
        else if (modelId === moduleStyle.NEW_PRODUCT) {     //新品
            return <NewProduct data={rowData.data}/>
        }
        else if (modelId === moduleStyle.ALL_GOODS) {     //所有商品
            return <StoreAllGoods data={rowData.data}/>
        }
        else {
            return null
        }
    }

    _contentViewScroll(e) {
        let offsetY = e.nativeEvent.contentOffset.y / 100; //滑动距离
        let flatListHeight = e.nativeEvent.layoutMeasurement.height; //FlatList高度

        //实现标题栏渐变效果
        if (offsetY >= 0 && (this.state.opacity !== 1 || offsetY <= 1)) {
            this.setState({opacity: offsetY >= 1 ? 1 : offsetY})
        }

        //显示or隐藏置顶控件
        if ((offsetY * 100 + flatListHeight) > flatListHeight * 2 && this.state.hidden) {
            this.setState({hidden: false})
        } else if ((offsetY * 100 + flatListHeight) <= flatListHeight * 2 && !this.state.hidden) {
            this.setState({hidden: true})
        }
    }
}

export default connect()(Store)