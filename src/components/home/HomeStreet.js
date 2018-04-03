import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity,Platform} from 'react-native';
import {showToastShort} from "../../common/CommonToast";
import {post, isSuccess} from "../../common/CommonRequest"
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
import HYBuy from "./home/HYBuy";
const {width, height} = Dimensions.get('window');

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
class HomeStreet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidden: true,
            isRequestError: false,
            opacity:0,
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
                        style={{position: 'absolute', marginTop: height - 150, marginLeft: width - 65}}
                        onPress={() => {
                            this.refs.giftedListView._scrollToIndex(0, 0)
                        }}>
                        <XImage style={{width: 48 , height: 80}} uri={'http://p0xkrqo35.bkt.clouddn.com/1517643684329.png'}/>
                    </TouchableOpacity>
                )}
                <SearchBar opacity={this.state.opacity} onlyTitle={true}/>
            </View>
        );
    }

    _onRefresh(callback, options) {
        var rows = [];
        Promise.all([post('main/module/street/banner', {street: this.props.navigation.state.params}),
            post('main/module/street', {street: this.props.navigation.state.params})])
            .then(([bannerData, moduleData]) => {
                if (isSuccess(bannerData) && isSuccess(moduleData)) {
                    rows.push({"data": bannerData.result, 'modelId': moduleStyle.BANNER});
                    for (let item of moduleData.result) {
                        rows.push({"data": item, 'modelId': item.style});
                    }
                    callback(rows, {isShowFirstLoadView: false, pageNumber: 1});
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
        return (<RowView key={index} rowData={item} navigation={this.props.navigation}/>);
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
            return <CarouselHome data={rowData.data} action={this.props.navigation.state.params}/>
        } else if (modelId === moduleStyle.GUIDE) {     //功能入口
            return <GuideModules />
        } else if (modelId === moduleStyle.F4) {     //F4
            return <HYBuy data={rowData.data} isHYBuy={this.props.navigation.state.params==='APP_HOME_LEGOU'}/>
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
            return <SpecialZone data={rowData.data} isHYBuy={this.props.navigation.state.params==='APP_HOME_LEGOU'}/>
        } else {
            return null
        }
    };
}

export default connect()(HomeStreet)
