import React, {Component} from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import {
    mainColor,
    mainBackgroundColor,
    titleTextColor,
    content2TextColor,
    placeholderTextColor, priceColor
} from '../../constraint/Colors';
import TitleBar from '../../widgets/TitleBar';
import {ic_delete} from '../../constraint/Image';
import LFlatList from '../../widgets/LFlatList'
import {connect} from 'react-redux'
import {getRequestFailTip, isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import TipDialog from '../../widgets/dialog/TipDialog';
import XImage from '../../widgets/XImage';
import {goto} from "../../reducers/RouterReducer";
import EmptyView from "../common/empty/EmptyView";
import {gotoDetail} from "../../common/ProductUtil";
import {formatMoney} from "../../common/StringUtil";
class CollectList extends Component {

    constructor(props) {
        super(props);
        this.collectList = [];
    }

    componentDidMount(){
        this.listener = DeviceEventEmitter.addListener('REMOVE_COLLECT_PRODUCT_ID',(id)=>{
            this._updateCollectList({productId:id})
        });
    }

    componentWillUnmount(){
        this.listener.remove();
    }

    _onRefresh(callback, options) {
        this.getCollectList(callback, options);
    }

    _onLoadMore(page = 1, callback, options) {
        this.getCollectList(callback, options, page);
    }

    getCollectList(callback, options, page = 1) {
        let requestObj = {
            token: this.props.token,
            pageNo: page,
            pageSize: 10
        };
        post('product/myCollections', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {

                    this.collectList.push(...responseData.result.data);
                    callback(responseData.result.data, {
                        isShowFirstLoadView: false,
                        haveNext: responseData.result.pageCount > responseData.result.pageNo,
                        // pageNumber: responseData.result.pageNo
                    });
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message);
        });
    }

    _updateCollectList = (item) => {
        let newCollectList = [];
        this.collectList.map(collectItem => {
            if (item.productId !== collectItem.productId) {
                newCollectList.push(collectItem);
            }
        });

        this.collectList = newCollectList;

        this.refs.lflatlist.updateDataSource(this.collectList);
    };

    render() {
        return (
            <View style={{backgroundColor: mainBackgroundColor, flex: 1}}>
                <TitleBar title={'收 藏'}/>
                <View style={{flex: 1}}>
                    <LFlatList
                        ref={'lflatlist'}
                        onLoadMore={this._onLoadMore.bind(this)}
                        firstLoader={false}
                        onRefreshing={this._onRefresh.bind(this)}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={() => <View style={{height: 5}}/>}
                        emptyView={()=><EmptyView emptyTip={'您没有收藏的商品'} showRecommended={false}/>}
                        pagination={true}
                        refreshable={true}
                        withSections={false}
                        isShowFirstLoadView={true}
                        renderItem={({item}) => <CollectListItem data={item} token={this.props.token}
                                                                 cancelCollect={this._updateCollectList.bind(this)} dispatch={this.props.dispatch}/>}/>
                </View>
            </View>
        )
    }
}

class CollectListItem extends Component {

    cancelCollect(item) {
        let requestObj = {
            token: this.props.token,
            action: 'CANCEL',
            productId: item.productId
        };
        post('product/collection', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    showToastShort('取消收藏成功!');
                    this.refs.TipDialog.dismiss();
                    this.props.cancelCollect(item);
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.itemContain} activeOpacity={0.7} onPress={()=> this.props.dispatch(goto('ProductDetail',this.props.data.productId))}>
                    <XImage style={styles.itemImg} uri={this.props.data.path}/>
                    <View style={{flex: 1, marginLeft: 15}}>
                        <Text numberOfLines={1} style={styles.itemName}>{this.props.data.name}</Text>
                        <Text numberOfLines={1} style={styles.price}>{formatMoney(this.props.data.salePrice)}</Text>
                        <View style={{flexDirection: 'row',}}>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity style={styles.itemDelete}
                                              activeOpacity={0.7}
                                              onPress={() => {
                                                  this.refs.TipDialog.showDialog()
                                              }}>
                                <Image source={ic_delete} style={styles.check}/>
                                <Text style={{color: content2TextColor, marginTop: 4}}>删除</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
                <TipDialog ref='TipDialog'
                           dialogMessage={'确定取消收藏吗?'}
                           onClickConfirm={() => this.cancelCollect(this.props.data)}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: 'gray',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    itemContain: {
        flexDirection: 'row',
        padding: 12,
    },
    itemImg: {
        width: 95,
        height: 95,
        borderRadius: 5,
        borderWidth: 0.3,
        borderColor: placeholderTextColor,
    },
    itemName: {
        color: titleTextColor,
        fontSize: 18,
        marginTop: 10,
    },
    price: {
        alignItems: 'flex-end',
        color: priceColor,
        fontSize: 16,
        marginTop: 12
    },
    check: {
        width: 15,
        height: 15,
        marginRight: 5,
        resizeMode: 'contain',
        marginTop: 5
    },
    itemDelete: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};
export default connect(selector)(CollectList);
