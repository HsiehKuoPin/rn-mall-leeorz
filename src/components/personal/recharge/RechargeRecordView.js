import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    mainBackgroundColor, content2TextColor, placeholderTextColor,titleTextColor
} from "../../../constraint/Colors";
import LFlatList from '../../../widgets/LFlatList';
import {post, getRequestFailTip,isSuccess} from '../../../common/CommonRequest';
import {showToastShort} from "../../../common/CommonToast";
import {connect} from 'react-redux';

class RechargeRecordView extends Component {

    constructor(props) {
        super(props);
        this.rechargeType = this.props.rechargeType;
    }

    _onLoadMore(page = 1, callback, options) {
        this._getRecord(callback, options, page);
    }

    _onRefresh(callback, options) {
        this._getRecord(callback, options);
    }

    _getRecord(callback, options, pageNo = 1) {
        let requestObj = {
            token: this.props.token,
            pageNo: pageNo,
            pageSize: 20
        };
        post("order/virtual/prePaidPhoneOrderList", requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    callback(responseData.result, {
                        isShowFirstLoadView: false,
                        // haveNext: responseData.result.pageCount > responseData.result.pageNo,
                        // pageNumber: responseData.result.pageNo === 1 ? 2 : responseData.result.pageNo
                    });
                } else {
                    showToastShort(getRequestFailTip(responseData));
                }
            }).catch((e) => {
            showToastShort(getRequestFailTip());
        });
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'white'}}>
                <View style={styles.container}>
                    <LFlatList
                        onLoadMore={this._onLoadMore.bind(this)}
                        firstLoader={false}
                        onRefreshing={this._onRefresh.bind(this)}
                        showsVerticalScrollIndicator={false}
                        pagination={true}
                        emptyView={()=><Text style={{marginTop:10,textAlign:'center'}}>暂时没有数据</Text>}
                        refreshable={true}
                        withSections={false}
                        isMounted={false}
                        isShowFirstLoadView={true}
                        enableEmptySections={true}
                        renderItem={this._renderItem}
                    />
                </View>
            </View>
        )
    }

    _renderItem = ({item, index}) => {
        if (item.status === 'ORDER_CREATED') {
            this.status = "充值中"
        } else if (item.status === 'ORDER_COMPLETED') {
            this.status = "充值成功"
        } else {
            this.status = "充值失败"
        }
        return (
            <View style={styles.itemContain}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.phone}>{item.businessNumber}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.phone}>￥ {item.amount}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Text style={styles.time}>{item.createTime}</Text>
                    <View style={{flex: 1}}/>
                    <Text style={styles.time}>{this.status}</Text>
                </View>
                <View style={styles.line}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // padding: 10,
        // borderRadius: 3,
        flex: 1,
        // shadowOpacity: 0.2,
        // shadowOffset: {height: 2, width: 2},
        // shadowRadius: 3,
        // elevation: 4
    },
    itemContain: {
        backgroundColor: 'white',
        marginTop: 15,
        marginHorizontal: 20
    },
    phone: {
        color: titleTextColor,
        fontSize: 16,
    },
    time: {
        color: content2TextColor,
        fontSize: 15
    },
    line: {
        flex: 1,
        backgroundColor: placeholderTextColor,
        height: 0.5,
        marginTop: 15,
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token
    }
};

export default connect(selector)(RechargeRecordView)

