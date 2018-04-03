import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity,Platform, DeviceEventEmitter, NativeModules, NativeEventEmitter} from 'react-native';
import {showToastShort} from "../../common/CommonToast";
import {post, isSuccess, getRequestFailTip} from "../../common/CommonRequest"
import LFlatList from '../../widgets/LFlatList';
import RequestErrorView from '../../widgets/RequestErrorView';
import {mainBackgroundColor} from "../../constraint/Colors";
import {connect} from 'react-redux'
import XImage from "../../widgets/XImage";
import ServiceMessageView from "../login/ServiceMessageView";
import SearchBar from "./home/SearchBar";
import GuideModules from "./home/GuideModules";
import SpecialZone from "./home/SpecialZone";
import QuarterZone from "./home/QuarterZone";
import RushPurchase from "./home/RushPurchase";
import Sale from "./home/Sale";
import CarouselHome from "./home/CarouselHome";
import GuideStreet from "./home/GuideStreet";
import {isIphoneX} from "react-native-iphone-x-helper";
const {width, height} = Dimensions.get('window');
import {saveSingleOtherConfig} from "../../reducers/LoginReducer";
import RecommendDialog from "./module/RecommendDialog";
import BaseComponent from "../../widgets/BaseComponent";
import HYBuy from "./home/HYBuy";
import {gotoAndClose} from "../../reducers/RouterReducer";

const moduleStyle = {
    BANNER: 'BANNER',   //轮播图
    GUIDE: 'GUIDE',     //功能入口
    A: 'A',
    IA: 'IA',
    B: 'B',
    IB: 'IB',
    C: 'C',
    F4: 'F4',
    DEFAULT: 'DEFAULT',
};
class Home extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            isRequestError: false,
            opacity:0,
            msgCount:0,
        };
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('SHOWRECOMMENDVIEW', () => {
            this.refs.RecommendDialog.show();
        });

        if(NativeModules.GFCJPushModule){
            let eventEmitter = new NativeEventEmitter(NativeModules.GFCJPushModule);
            this.listenerOpened = eventEmitter.addListener('notification_opened', (data) => {
                this.props.dispatch(gotoAndClose('MessageCenter',['Main']));
            });
            this.listenerReceived = eventEmitter.addListener('notification_received', (data) => {
                this.getNotHaveReadPushMessage(this.props.token);
            });
        }
    }

    componentWillUnmount() {
        this.listener.remove();
        if (NativeModules.GFCJPushModule) {
            this.listenerOpened.remove();
            this.listenerReceived.remove();
        }
    }
    componentWillReceiveProps(nextProps){
        if(this.props.updatePushMsgFlag !== nextProps.updatePushMsgFlag|| this.isUserTokenChange(nextProps)){
            this.getNotHaveReadPushMessage(nextProps.token);
        }
    }
    getNotHaveReadPushMessage(token){
        post('main/push/getNotHaveReadPushMessage', {token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({msgCount: responseData.result.size})
                } else{
                    this.setState({msgCount: 0});
                }
            }).catch((e) => {
            this.setState({msgCount: 0});
        });
    }
    _getReferrer(text) {    //获取推荐人用户名
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
        let requestObj = {'recommend': this.state.referrer, 'token': this.props.token};
        post('user/bindRecommend', requestObj, true)
            .then((responseData) => {
                this.refs.RecommendDialog.dismiss();
                if (isSuccess(responseData)) {
                    showToastShort("绑定成功");
                    this.props.dispatch(saveSingleOtherConfig('isHasRecommend', 'Y'));
                } else if (this.checkUserTokenValid({response: responseData}, false)) {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            this.refs.RecommendDialog.dismiss();
            showToastShort(e.message);
        });
    }

    render() {
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => this.setState({isRequestError: false})}/>
        ) : (
            <LFlatList
                ref="giftedListView"
                renderItem={this._renderRowView}
                onRefreshing={this._onRefresh.bind(this)}
                refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                withSections={false} // enable sections
                isMounted={false}
                onScroll={this._contentViewScroll.bind(this)}
                isShowFirstLoadView={true}
                enableEmptySections={true}
                // noMoreFooterView={()=><ServiceMessageView/>}
                refreshableTintColor="blue"/>
        );
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {showView}
                {this.state.hidden ? null : (
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{position: 'absolute', marginTop: height - 150-(isIphoneX()||Platform.OS === 'android' ?34:0), marginLeft: width - 65}}
                        onPress={() => {
                            this.refs.giftedListView._scrollToIndex(0, 0)
                        }}>
                        <XImage style={{width: 48 , height: 80}} uri={'http://p0xkrqo35.bkt.clouddn.com/1517643684329.png'}/>
                    </TouchableOpacity>
                )}
                <SearchBar opacity={this.state.opacity} msgCount={this.state.msgCount}/>
                <RecommendDialog ref={'RecommendDialog'} referrer={this.state.referrer}
                                 onEnd={(text) => this._getReferrer(text)}
                                 confirm={() => this._bindRecommend()}/>
            </View>
        );
    }

    _onRefresh(callback, options) {
        this.getNotHaveReadPushMessage(this.props.token);
        var rows = [];
        Promise.all([post('main/module/home/banner'),post('main/module/home')])
            .then(([bannerData, moduleData]) => {
                if (isSuccess(bannerData) && isSuccess(moduleData)) {
                    rows.push({"data": bannerData.result, 'modelId': moduleStyle.BANNER});
                    rows.push({"data": '', 'modelId': moduleStyle.GUIDE});
                    for (let item of moduleData.result) {
                        rows.push({"data": item, 'modelId': item.style});
                    }
                    callback(rows, {isShowFirstLoadView: false, pageNumber:1});
                } else {
                    this._errorMsg(callback, rows, bannerData.message);
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


    _renderRowView({item, index}) {
        return (<RowView key={index} rowData={item} />);
    }

    _contentViewScroll(e) {
        let offsetY = e.nativeEvent.contentOffset.y / 100; //滑动距离
        let flatListHeight = e.nativeEvent.layoutMeasurement.height; //FlatList高度

        //实现标题栏渐变效果
        if (offsetY >= 0 && (this.state.opacity !== 1 || offsetY <= 1)) {
            this.setState({opacity: offsetY >= 1 ? 1 : offsetY})
        }

        //显示or隐藏置顶控件
        if ((offsetY*100 + flatListHeight) > flatListHeight*2 && this.state.hidden) {
            this.setState({hidden: false})
        } else if ((offsetY*100 + flatListHeight) <= flatListHeight*2 && !this.state.hidden) {
            this.setState({hidden: true})
        }
    }
}

class RowView extends Component {
    render() {
        let {rowData} = this.props;
        let modelId = rowData.modelId;
        if (modelId === moduleStyle.BANNER) {           //广告轮播图
            return <CarouselHome data={rowData.data}/>
        } else if (modelId === moduleStyle.GUIDE) {     //功能入口
            return <GuideModules />
        } else if (modelId === moduleStyle.F4) {     //F4
            return <HYBuy data={rowData.data}/>
        } else if (modelId === moduleStyle.A) {         //A
            return <RushPurchase data={rowData.data}/>
        } else if (modelId === moduleStyle.IA) {         //IA
            return <GuideStreet data={rowData.data.contents}/>
        } else if (modelId === moduleStyle.B) {         //B
            return <Sale data={rowData.data}/>
        } else if (modelId === moduleStyle.IB) {         //IB
            return <Sale data={rowData.data} isIntegral={true}/>
        } else if (modelId === moduleStyle.C) {         //C
            return <QuarterZone data={rowData.data}/>
        } else if (modelId === moduleStyle.DEFAULT) {   //DEFAULT
            return <SpecialZone data={rowData.data}/>
        } else {
            return null
        }
    };
}

selector = (state) => {
    return {
        token: state.loginStore.token,
        updatePushMsgFlag:state.cacheStore.updatePushMsgFlag,
    }
};

export default connect(selector)(Home)
