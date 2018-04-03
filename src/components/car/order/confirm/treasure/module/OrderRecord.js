import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import LFlatList from '../../../../../../widgets/LFlatList';
import EmptyView from '../../../../../common/empty/EmptyView';
import {
    content2TextColor, mainBackgroundColor, placeholderTextColor,
    titleTextColor
} from "../../../../../../constraint/Colors";
import {getRequestFailTip, isSuccess, post} from "../../../../../../common/CommonRequest";
import {showToastShort} from "../../../../../../common/CommonToast";
import RequestErrorView from "../../../../../../widgets/RequestErrorView";
import {ORDER_HAS_DEFAULTED} from "../../../../../../constraint/OrderType";
import {ic_buyCar_transfer} from "../../../../../../constraint/Image";
import {isIPhone5} from "../../../../../../common/AppUtil";

const width = Dimensions.get('window').width;

class OrderRecord extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRequestFail: false,
            showDialog: false,
        };

        this.orderList = [];
    };

    _getOrderList(callback, options, pageNo = 1) {
        let requestObj = {
            token: this.props.token,
            pageNo: pageNo,
            pageSize: 10
        };
        post('order/car/carOrderList', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    let data = responseData.result.data;
                    let pageCount = responseData.result.pageCount;
                    this.orderList.push(...data);
                    callback(data, {isShowFirstLoadView: false, haveNext: (pageNo < pageCount),});

                } else if (this.checkUserTokenValid({title: '您的登录已经失效'})) {
                    if (pageNo === 1) {
                        this.setState({
                            isRequestFail: true,
                        });
                    }
                    showToastShort(getRequestFailTip(responseData));
                    callback([], {isShowFirstLoadView: false, requestError: true,});
                }
            }).catch((e) => {
            if (pageNo === 1) {
                this.setState({isRequestFail: true,});
            } else {
                console.warn(e.message);
                callback([], {isShowFirstLoadView: false, requestError: true,});
            }

        });
    }

    _onRefresh(callback, options) {
        this._getOrderList(callback, options);
    }

    _onLoadMore(page = 1, callback, options) {
        this._getOrderList(callback, options, page);
    }

    render() {
        let showView = this.state.isRequestFail ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestFail: false})
            }}/>) : (
            <View style={{flex: 1}}>
                <LFlatList
                    ref={'orderRecord'}
                    ListHeaderComponent={() => <View style={{height: 5}}/>}
                    onLoadMore={this._onLoadMore.bind(this)}
                    onRefreshing={this._onRefresh.bind(this)}
                    pagination={true}
                    refreshable={true}
                    withSections={false}
                    isMounted={false}
                    emptyView={() => <EmptyView emptyTip={'你还没有定购记录'} showRecommended={false}/>}
                    isShowFirstLoadView={true}
                    enableEmptySections={true}
                    initialNumToRender={3}
                    renderItem={({item, key}) =>
                        <View style={styles.backgroundStyle} key={key}>
                            <Text style={{margin: 15, fontSize: 16, color: titleTextColor}}>{item.productName}</Text>
                            <View style={styles.lineStyle}/>
                            <View style={[styles.viewStyle,{marginTop:15}]}>
                                <Text style={styles.leftTextStyle}>订单号：</Text>
                                <Text style={styles.rightTextStyle} numberOfLines={1}>{item.orderId}</Text>
                            </View>
                            <View style={styles.viewStyle}>
                                <Text style={styles.leftTextStyle}>下单时间：</Text>
                                <Text style={styles.rightTextStyle}>{item.createTime}</Text>
                            </View>
                            <View style={styles.viewStyle}>
                                <Text style={styles.leftTextStyle}>定金：</Text>
                                <View style={{flexDirection: 'column'}}>
                                    {
                                        item.depositPays.map((payItem, index) => {
                                            return <Text key={index}
                                                         style={[styles.rightTextStyle, {marginBottom: index === item.depositPays.length - 1 ? 0 : 10}]}>{payItem}</Text>
                                        })
                                    }
                                </View>
                            </View>
                            {
                                item.hasDefaultedTime !== '' ? (
                                    <View style={styles.viewStyle}>
                                        <Text style={styles.leftTextStyle}>转让时间：</Text>
                                        <Text style={styles.rightTextStyle}>{item.hasDefaultedTime}</Text>
                                    </View>) : null
                            }
                            {
                                (item.refundTime !== '' || item.refundPays.length !== 0) ?
                                    <View style={styles.lineStyle}/> : null
                            }
                            {
                                item.refundTime !== '' ? (<View style={[styles.viewStyle,{marginTop:15}]}>
                                    <Text style={styles.leftTextStyle}>退回时间：</Text>
                                    <Text style={styles.rightTextStyle}>{item.refundTime}</Text>
                                </View>) : null
                            }
                            {
                                item.refundPays.length !== 0 ? (<View style={[styles.viewStyle, {marginBottom: 10}]}>
                                    <Text style={styles.leftTextStyle}>退回：</Text>
                                    <View style={{flexDirection: 'column'}}>
                                        {
                                            item.refundPays.map((payItem, index) => {
                                                return <Text key={index}
                                                             style={[styles.rightTextStyle, {marginBottom: 10}]}>{payItem}</Text>
                                            })
                                        }
                                    </View>
                                </View>) : null
                            }
                            <Image source={item.status === ORDER_HAS_DEFAULTED ? ic_buyCar_transfer : null}
                                   style={{
                                       marginLeft: isIPhone5() ? width * 0.6 : width * 0.7,
                                       width: 100,
                                       height: 100,
                                       resizeMode: 'contain',
                                       marginTop: -20,
                                       position: 'absolute'
                                   }}/>
                        </View>
                    }
                />
            </View>
        );
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {showView}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f2f2f2'
    },
    backgroundStyle: {
        marginTop: 5,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 5,
        backgroundColor: 'white',
        borderRadius: 6,
        shadowColor: '#c7c7c7',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 4
    },
    viewStyle: {
        flexDirection: 'row',
        backgroundColor: 'white',
        // marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        marginBottom:15
    },
    lineStyle: {
        marginLeft: 15,
        marginRight: 15,
        height: 0.5,
        backgroundColor: placeholderTextColor
    },
    leftTextStyle: {
        color: content2TextColor,
        fontSize: 13,
        width: 70,
    },
    rightTextStyle: {
        color: content2TextColor,
        fontSize: 13,
        marginLeft: 40,
        width: width - 20 - 30 - 70 - 40,
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
    }
};

export default connect(selector)(OrderRecord);