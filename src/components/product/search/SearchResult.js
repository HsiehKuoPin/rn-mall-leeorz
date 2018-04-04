import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
} from 'react-native'

import connect from "react-redux/es/connect/connect";
import {titleTextColor, mainBackgroundColor, mainColor, priceColor} from "../../../constraint/Colors";
import {getRequestFailTip, isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";

import SearchTitleBar from "./SearchTitleBar";
import XImage from "../../../widgets/XImage";
import {gotoDetail} from "../../../common/ProductUtil";

let deviceWidth = (SCREEN_WIDTH) / 3;
import {formatMoney} from "../../../common/StringUtil";
import LFlatList from "../../../widgets/LFlatList";
import EmptyView from "../../common/empty/EmptyView";
import IphoneModel from "../../../widgets/IphoneModel";
import {SCREEN_WIDTH} from "../../../common/AppUtil";

class SearchResult extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            data: [],
            isLoadingPaging: true,
            pageCount: null,
            isNoMoreData: false,
            isAnimating: false,
        };
        this.search = this.props.navigation.state.params.search;
    }

    _onRefresh(callback, options) {
        this.getProductList(callback, options);
    }

    _onLoadMore(page = 1, callback, options) {
        this.getProductList(callback, options, page);
    }

    getProductList(callback, options, page = 1) {
        if (!this.search) return;
        let requestObj = {
            pageNo: page,
            pageSize: 18,
            search: this.search,
        };
        post('product/list', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    callback(responseData.result.data,{haveNext: responseData.result.pageCount > responseData.result.pageNo,})

                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
            console.warn(e.message)
        });
    }

    _onSubmitEdting(searchText) {
        this.search = searchText;
        this.refs.LFlatList.reset();
    }

    render() {
        let showView = (
            <LFlatList
                ref={'LFlatList'}
                numColumns={3}
                onLoadMore={this._onLoadMore.bind(this)}
                firstLoader={false}
                onRefreshing={this._onRefresh.bind(this)}
                showsVerticalScrollIndicator={false}
                emptyView={()=><EmptyView emptyTip={'搜索不到您想要的商品'} showRecommended={false}/>}
                ListHeaderComponent={() => <View style={{height: 5}}/>}
                pagination={true}
                refreshable={true}
                withSections={false}
                isMounted={false}
                isShowFirstLoadView={true}
                enableEmptySections={true}
                renderItem={({item, index}) =>
                    <View key={index} style={{width:deviceWidth,}}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => gotoDetail(item,this.props.dispatch)}>
                            <XImage uri={item.path}
                                    style={{
                                        resizeMode: 'cover',
                                        width: deviceWidth,
                                        height: deviceWidth,
                                    }}/>
                            <Text style={styles.itemText} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.priceText}
                                  numberOfLines={1}>{formatMoney(item.salePrice)}</Text>

                        </TouchableOpacity>
                    </View>
                }
            />
        );

        return (
            <View style={styles.container}>
                <SearchTitleBar noShowRightImage={true} isSearch={true}
                            searchKeyWork={this.search}
                            getSearchText={(searchText) => this._onSubmitEdting(searchText)}/>
                {showView}
                <IphoneModel/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemText: {
        color: 'black',
        marginHorizontal: 5,
        textAlign: 'center',
        marginTop: 15,
        fontSize: 12,
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

export default connect()(SearchResult);