import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../../widgets/TitleBar';
import {mainBackgroundColor, titleTextColor, content2TextColor} from '../../../constraint/Colors';
import {post, getRequestFailTip, isSuccess} from '../../../common/CommonRequest';
import {showToastShort} from '../../../common/CommonToast';
import LFlatList from '../.././../widgets/LFlatList';
import {goto} from '../../../reducers/RouterReducer';
import EmptyView from "../../common/empty/EmptyView";

class News extends Component {

    _onRefresh(callback, options) {
        this.getAnnouncementList(callback, options);
    }

    _onLoadMore(page = 1, callback, options) {
        this.getAnnouncementList(callback, options, page);
    }

    getAnnouncementList(callback, options, page = 1) {
        let requestObj = {
            pageNo: page,
            pageSize: 10
        };
        post('main/getAnnouncementList', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    callback(responseData.result.announcementList, {
                        isShowFirstLoadView: false,
                        // haveNext: responseData.result.pageCount > responseData.result.pageNo,
                        // pageNumber: responseData.result.pageNo
                    });
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
    }

    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity style={styles.itemContain} activeOpacity={0.7}
                              onPress={() => this.props.dispatch(goto('NewsDetail', {id: item.id,type:'news'}))}>
                {/*<Image source={{uri: imageUrl}} style={styles.image}/>*/}
                <View style={{marginRight: 5, marginLeft: 5, flex: 1}}>
                    <Text style={styles.text} numberOfLines={2}>{item.title}</Text>
                    <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-end'}}>
                        <View style={{flex: 1}}/>
                        <Text style={styles.time}>{item.createTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'最新动态'}/>
                    <LFlatList
                        onLoadMore={this._onLoadMore.bind(this)}
                        firstLoader={false}
                        onRefreshing={this._onRefresh.bind(this)}
                        showsVerticalScrollIndicator={false}
                        emptyView={() => <EmptyView emptyTip={'暂无最新动态'} showRecommended={false}/>}
                        ListHeaderComponent={() => <View style={{height: 5}}/>}
                        pagination={true}
                        refreshable={true}
                        withSections={false}
                        isMounted={false}
                        isShowFirstLoadView={true}
                        enableEmptySections={true}
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
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 10,
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {height: 1, width: 1},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        color: titleTextColor,
        marginTop: 10,
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

export default connect()(News)