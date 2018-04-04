import React, {Component} from 'react';
import {
    View,
} from 'react-native';
import {showToastShort} from "../../common/CommonToast";
import LFlatList from '../../widgets/LFlatList';
import RequestErrorView from '../../widgets/RequestErrorView';
import BaseComponent from "../../widgets/BaseComponent";
import FloatTopBtn from "../../widgets/FloatTopBtn";
import {getTargetModuleComponent} from "./Config";
export default class BasePage extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShowFloatBtn: false,
        };
    }

    getContentView(){
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => this.setState({isRequestError: false})}/>
        ) : (
            <LFlatList
                ref={flatList => this.flatList = flatList}
                renderItem={getTargetModuleComponent}
                onRefreshing={this.onRefresh.bind(this)}
                refreshable={true}
                withSections={false}
                isMounted={false}
                onScroll={this._contentViewScroll.bind(this)}
                isShowFirstLoadView={true}
                enableEmptySections={true}
                // noMoreFooterView={()=><ServiceMessageView/>}
                refreshableTintColor="blue"/>
        );

        return <View style={{flex: 1}}>
            {showView}
            {this.state.isShowFloatBtn ? <FloatTopBtn onClickTopBtn={()=>this.flatList._scrollToIndex(0, 0)}/> :null}
        </View>
    }

    onRefresh(callback, options) {

    }

    _errorMsg(callback, rows, msg) {
        callback(rows, {isShowFirstLoadView: false,});
        this.setState({
            isRequestError: true,
        });
        showToastShort(msg);
    }

    _contentViewScroll(e) {
        let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
        let flatListHeight = e.nativeEvent.layoutMeasurement.height; //FlatList高度

        //显示or隐藏置顶控件
        if ((offsetY + flatListHeight) > flatListHeight * 2 && !this.state.isShowFloatBtn) {
            this.setState({isShowFloatBtn: true})
        } else if ((offsetY+ flatListHeight) <= flatListHeight * 2 && this.state.isShowFloatBtn) {
            this.setState({isShowFloatBtn: false})
        }
        this.onContentViewScroll(e);
    }

    onContentViewScroll(e){

    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
        updatePushMsgFlag:state.cacheStore.updatePushMsgFlag,
    }
};
