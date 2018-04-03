import React, {Component} from 'react';
import {View, Dimensions, Image, TouchableOpacity,Text} from 'react-native';
import {showToastShort} from "../../common/CommonToast";
import {post, isSuccess} from "../../common/CommonRequest"
import LFlatList from '../../widgets/LFlatList';
import RequestErrorView from '../../widgets/RequestErrorView';
import Carousel from '../../widgets/Carousel';
import SearchView from './module/SearchView';
import ModulesGuideView from "./module/ModulesGuideView";
import {ic_recent_news, ic_right_arrows} from "../../constraint/Image";
import NewProductView from "./module/NewProductView";
import RecommendView from "./module/RecommendView";
import {mainBackgroundColor, placeholderTextColor, titleTextColor} from "../../constraint/Colors";
import {goto} from "../../reducers/RouterReducer";
import {connect} from 'react-redux'
import {commonAction} from "../../common/CommonAction";
import XImage from "../../widgets/XImage";
import ServiceMessageView from "../login/ServiceMessageView";
const {width, height} = Dimensions.get('window');
let dispatch;
class Index extends Component {
    constructor(props) {
        super(props);
        dispatch=this.props.dispatch;
        this.state = {
            hidden: true,
            isRequestError: false,
            isLoadMore: false,
        };
    }

    render() {
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false})
            }}/>
        ) : (
            <LFlatList
                ref="giftedListView"
                renderItem={this._renderRowView}
                onLoadMore={this._onLoadMore}
                onRefreshing={this._onRefresh.bind(this)}
                // pagination={true} // enable infinite scrolling using touch to load more
                refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                withSections={false} // enable sections
                loadMoreable={this.state.isLoadMore}
                isMounted={false}
                isShowFirstLoadView={true}
                enableEmptySections={true}
                noMoreFooterView={()=><ServiceMessageView/>}
                onViewableItemsChanged={(info) => {
                    // console.warn(JSON.stringify(info));
                    if (info.viewableItems !== null && info.viewableItems.length > 0) {
                        if (info.viewableItems[0].index > 5 && this.state.hidden) {
                            this.setState({hidden: false})
                        } else if (info.viewableItems[0].index <= 5 && !this.state.hidden) {
                            this.setState({hidden: true})
                        }
                    }
                }}
                refreshableTintColor="blue"
            />);
        return (
            <View style={{
                flex: 1, backgroundColor: mainBackgroundColor,
            }}>
                <SearchView/>
                {showView}
                {this.state.hidden ? null : (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{position: 'absolute', marginTop: height - 138, marginLeft: width - 70}}
                        onPress={() => {
                            this.refs.giftedListView._scrollToIndex(0, 0)
                        }}>
                        <Image
                            source={{uri: 'http://bonn.qiniudn.com/images/Company/20171110/20171110161413849.png'}}
                            style={{width: 48, height: 48}}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    /**
     * 刷新数据
     * @param callback
     * @param options
     * @private
     */
    _onRefresh(callback, options) {
        var models = [
            {"modelId": "M_BANNER", "paramId": "homeBanner"},                           //广告轮播图
            {"modelId": "M_CLASSIFICATION", "paramId": "modulesGuide"},                 //功能入口
            {"modelId": "M_TOPLINE", "paramId": "homeAnnouncement"},                             //最新动态
            {"modelId": "M_THEME_HANDPICK", "paramId": "homeNewProduct"},               //新品-4个
            {"modelId": "M_DISCOUNT_HANDPICK", "paramId": "homeRecommendationImage"},   //精品推荐图片
            {"modelId": "M_GUESS_YOU_LIKE", "paramId": "guessMap"},                     //精品推荐
        ];//测试数据
        var rows = [];
        let canLoadMore = false;

        post('main/home')//首页接口
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    for (let item of models) {
                        // models.map((item, index) => {//测试数据
                        let data;
                        if (item.modelId === "M_CLASSIFICATION") {
                            data = '';
                        } else if (item.modelId === 'M_GUESS_YOU_LIKE') {
                            canLoadMore = true;
                            this.setState({
                                isLoadMore: true
                            });
                            break;
                        } else {
                            if (item.paramId in responseData.result) {
                                data = responseData.result[item.paramId];
                            }
                        }
                        if (data !== undefined)
                            rows.push({"data": data, 'modelId': item.modelId});
                    }
                    callback(rows, {isShowFirstLoadView: false, haveNext: canLoadMore, loadMoreable: canLoadMore,pageNumber:1});
                } else {
                    this._errorMsg(callback, rows, responseData.message);
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
        post('main/recommendation', {pageNo: page, pageSize: 21,})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    var rows = [];
                    rows.push({"data": responseData.result.products, 'modelId': "M_GUESS_YOU_LIKE"});
                    callback(rows, {haveNext: (responseData.result.products.pageNo * responseData.result.products.pageSize < responseData.result.products.dataCount)});
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
        return (<RowView key={index} rowData={item} dispatch={dispatch} />);
    }
}

class RowView extends Component {
    render() {
        let {rowData} = this.props;
        let modelId = rowData.modelId;
        if (modelId === "M_BANNER") {//广告轮播图
            return (<Carousel data={rowData.data}/>);
        } else if (modelId === "M_CLASSIFICATION") {//功能入口
            return (<ModulesGuideView data={rowData.data}/>);
        } else if (modelId === "M_TOPLINE") {//最新动态
            return (this.recentNews(rowData.data));
        } else if (modelId === "M_THEME_HANDPICK") {//新品-4个
            return (<NewProductView data={rowData.data}/>)
        } else if (modelId === "M_DISCOUNT_HANDPICK") {//精品推荐图片
            return <TouchableOpacity
                activeOpacity={1}
                style={{width: width, height: width * 0.2,}}
                onPress={() => commonAction(this.props.dispatch, {item:rowData.data, token:undefined})}>
                <XImage uri={rowData.data.imgUrl} style={{flex: 1}}/>
            </TouchableOpacity>
        } else if (modelId === "M_GUESS_YOU_LIKE") {//精品推荐
            return (<RecommendView data={rowData.data}/>)
        }
    };

    recentNews(data) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={{backgroundColor: '#FFFFFF', padding: 15, flexDirection: 'row', alignItems: 'center', width: width, height: 60}}
                onPress={() => dispatch(goto('News'))}>
                <Image resizeMode={Image.resizeMode.contain} source={{uri:ic_recent_news}} style={{width: 36, height: 36}}/>
                <View style={{width: 0.5, height: 36, backgroundColor: placeholderTextColor, marginLeft: 15, marginRight: 15}}/>
                <View style={{flex: 1, justifyContent:'center'}}>
                    {data.map((item,index) => <Text key={index} numberOfLines={1} style={{color: titleTextColor, marginTop: 5}}>{item.title}</Text>)}
                </View>
                <Image source={ic_right_arrows} style={{width: 15, height: 20, resizeMode: 'contain'}}/>
            </TouchableOpacity>
        );
    }
}

export default connect()(Index)
