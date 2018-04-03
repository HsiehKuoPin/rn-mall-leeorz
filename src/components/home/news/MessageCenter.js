import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {
    mainBackgroundColor,
    titleTextColor,
    content2TextColor,
    mainColor,
    contentTextColor
} from '../../../constraint/Colors';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import {showToastShort} from '../../../common/CommonToast';
import LFlatList from '../.././../widgets/LFlatList';
import {goto} from '../../../reducers/RouterReducer';
import EmptyView from "../../common/empty/EmptyView";
import {commonAction} from "../../../common/CommonAction";
import BaseComponent from "../../../widgets/BaseComponent";
import {notifyUpdatePushMsg} from "../../../reducers/CacheReducer";

class MessageCenter extends BaseComponent {

    constructor(props) {
        super(props)
        this.state = {
            isRead: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.isUserTokenChange(nextProps) && nextProps.token) {
            if (this.refs.LFlatList) {
                this.refs.LFlatList.reset();
            }
        }
    }

    _onRefresh(callback, options) {
        this.getPushMessageList(callback, options);
    }

    _onLoadMore(page = 1, callback, options) {
        this.getPushMessageList(callback, options, page);
    }

    getPushMessageList(callback, options, page = 1) {
        let requestObj = {
            pageNo: page,
            pageSize: 10,
            token: this.props.token
        };
        post('main/push/getPushMessageList', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    callback(responseData.result.data, {
                        isShowFirstLoadView: false,
                        haveNext: responseData.result.pageCount > responseData.result.pageNo,
                    });
                } else if (this.checkUserTokenValid({response: responseData}, false)) {
                    showToastShort(getRequestFailTip(responseData));
                } else {
                    callback([], {isShowFirstLoadView: false, requestError: true});
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            callback([], {isShowFirstLoadView: false, requestError: true});
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
    }

    changeHaveReadState(item) {
        if (item.haveRead === "N") {
            post('main/push/changeHaveReadState', {id: item.id, token: this.props.token})
                .then((response) => {
                    if (isSuccess(response)) {
                        this.refs.LFlatList.reset();
                    }
                });
            this.props.dispatch(notifyUpdatePushMsg(new Date().valueOf()));
        }
        if (item.message) {
            try {
                commonAction(this.props.dispatch, {item: JSON.parse(item.message), token: this.props.token, id: item.id});
            }catch(e) {}
        }
    }

    _renderItem = ({item}) => {
        let dot = item.haveRead !== "N" ? null : <View style={styles.dot}/>;
        return (
            <TouchableOpacity style={styles.itemContain} activeOpacity={0.7}
                              onPress={() => this.changeHaveReadState(item)}>
                <View style={{flex: 1, marginTop: 10, flexDirection: 'row', alignItems: 'center'}}>
                    {dot}
                    <Text style={{color: item.haveRead === 'Y' ? content2TextColor : titleTextColor, fontSize: 16}}
                          numberOfLines={1}>{item.title}</Text>
                </View>
                <Text style={{
                    color: content2TextColor,
                    fontSize: 16,
                    marginTop: 5,
                    marginBottom: 10
                }}>{item.createTime}</Text>
                <Text style={{color: item.haveRead === 'Y' ? content2TextColor : contentTextColor, fontSize: 16}}
                      numberOfLines={2}>{item.notification}</Text>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'消息动态'}/>
                <LFlatList
                    ref={'LFlatList'}
                    onLoadMore={this._onLoadMore.bind(this)}
                    firstLoader={false}
                    onRefreshing={this._onRefresh.bind(this)}
                    showsVerticalScrollIndicator={false}
                    emptyView={() => <EmptyView emptyTip={'暂无消息动态'} showRecommended={false}/>}
                    ListHeaderComponent={() => <View style={{height: 5}}/>}
                    pagination={true}
                    refreshable={true}
                    withSections={false}
                    isShowFirstLoadView={true}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemContain: {
        padding: 10,
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {height: 1, width: 1},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2,
        paddingHorizontal: 15
    },
    dot: {
        backgroundColor: mainColor,
        borderRadius: 5,
        width: 10,
        height: 10,
        position: 'relative',
        marginRight: 5
    },
    image: {
        width: 90,
        height: 90,
        resizeMode: 'contain'
    },
    time: {
        fontSize: 16,
        color: content2TextColor,
        marginTop: 5,
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
}
export default connect(selector)(MessageCenter)