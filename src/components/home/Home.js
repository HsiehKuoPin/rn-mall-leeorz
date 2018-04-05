import React, {Component} from 'react';
import {
    View,DeviceEventEmitter, NativeModules, NativeEventEmitter,
} from 'react-native';
import {showToastShort} from "../../common/CommonToast";
import {post, isSuccess, getRequestFailTip} from "../../common/CommonRequest"
import {mainBackgroundColor} from "../../constraint/Colors";
import {connect} from 'react-redux'
import SearchBar from "./home/SearchBar";
import {saveSingleOtherConfig} from "../../reducers/LoginReducer";
import RecommendDialog from "./module/RecommendDialog";
import {gotoAndClose} from "../../reducers/RouterReducer";
import {ModuleStyle} from "./Config";
import BasePage from "./BasePage";
class Home extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
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
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {/*{this.getContentView()}*/}
                <SearchBar opacity={this.state.opacity} msgCount={this.state.msgCount}/>
                <RecommendDialog ref={'RecommendDialog'} referrer={this.state.referrer}
                                 onEnd={(text) => this._getReferrer(text)}
                                 confirm={() => this._bindRecommend()}/>
            </View>
        );
    }

    onRefresh(callback, options) {
        this.getNotHaveReadPushMessage(this.props.token);
        var rows = [];
        Promise.all([post('main/module/home/banner'),
            post('main/module/home'),
            post('main/module/street', {street: 'APP_HOME_BRAND'}),
            post('main/module/street', {street: 'APP_HOME_LEGOU'}),
        ])
            .then(([bannerData, moduleData,streetData,legouStreetData]) => {
                if (isSuccess(bannerData) && isSuccess(moduleData) && isSuccess(streetData) && isSuccess(legouStreetData)) {
                    rows.push({"data": bannerData.result, 'modelId': ModuleStyle.BANNER});
                    // rows.push({"data": '', 'modelId': ModuleStyle.GUIDE});

                    for (let item of streetData.result) {
                        rows.push({"data": item, 'modelId': item.style});
                    }
                    for (let item of moduleData.result) {
                        rows.push({"data": item, 'modelId': item.style});
                    }

                    for (let item of legouStreetData.result) {
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

    onContentViewScroll(e) {
        let offsetY = e.nativeEvent.contentOffset.y / 100; //滑动距离
        //实现标题栏渐变效果
        if (offsetY >= 0 && (this.state.opacity !== 1 || offsetY <= 1)) {
            this.setState({opacity: offsetY >= 1 ? 1 : offsetY})
        }
    }
}

selector = (state) => {
    return {
        token: state.loginStore.token,
        updatePushMsgFlag:state.cacheStore.updatePushMsgFlag,
    }
};

export default connect(selector)(Home)
