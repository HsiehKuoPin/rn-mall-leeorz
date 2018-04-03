import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    FlatList
} from 'react-native';

import {connect} from 'react-redux';
import EmptyView from '../../common/empty/EmptyView';
import {
    content2TextColor, mainBackgroundColor, placeholderTextColor,
    titleTextColor
} from "../../../constraint/Colors";
import {isSuccess, post} from "../../../common/CommonRequest";
import {showToastShort} from "../../../common/CommonToast";
import RequestErrorView from "../../../widgets/RequestErrorView";
import {ic_right_arrows} from "../../../constraint/Image";
import XImage from "../../../widgets/XImage";
import IphoneModel from "../../../widgets/IphoneModel";
import {goto} from "../../../reducers/RouterReducer";
import LoadingView from "../../../widgets/LoadingView";
import BaseComponent from "../../../widgets/BaseComponent";

class OrderRecord extends BaseComponent {
    constructor(props) {
        super(props)
        this.state = {
            isRequestFail: false,
            isLoading: true,
            data:null
        };
    };

    componentDidMount() {
        this._getOrderList();
    }

    _getOrderList() {

        post('order/companyOrderGoods/listCompanyOrderGoods', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                    })
                }
                else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            }).catch((e) => {
            this._errorMsg(e.message);
        });
    }

    _errorMsg(msg) {
        this.setState({
            isLoading: false,
            isRequestError: true,
        });
        showToastShort(msg);
    }

    _keyExtractor = (item, index) => index;

    render() {
        let showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._getOrderList();
            }}/>) : (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <FlatList
                        style={styles.backgroundStyle}
                        ItemSeparatorComponent={()=><View style={styles.lineStyle}/>}
                        data={this.state.data}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        ListEmptyComponent={() => <EmptyView emptyTip={'你还没有加盟记录'} showRecommended={false}/>}
                        renderItem={({item, index}) =>
                            <TouchableOpacity key={index} style={styles.viewStyle}
                                              activeOpacity={0.7}
                                              onPress={() => {
                                                  this.props.dispatch(goto('GoldRecordDetail',item.orderGoodId))
                                              }}>
                                <Text style={{fontSize: 16, color: titleTextColor}}>{item.activityName}</Text>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        marginRight: 10,
                                        color: content2TextColor
                                    }}>{item.createTime}</Text>
                                <XImage source={ic_right_arrows} style={{width: 7, height: 12}}/>
                            </TouchableOpacity>
                        }
                    />
                </ScrollView>
                <IphoneModel/>
            </View>
        );
        return (
            <View style={{flex: 1, backgroundColor: mainBackgroundColor}}>
                {this.state.isLoading ? <LoadingView/> : showView}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    backgroundStyle: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 4,
        shadowColor: '#c7c7c7',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 4
    },
    viewStyle: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center'
    },
    lineStyle: {
        marginLeft: 15,
        marginRight: 15,
        height: 0.5,
        backgroundColor: placeholderTextColor
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        nav:state.nav,
    }
};

export default connect(selector)(OrderRecord);