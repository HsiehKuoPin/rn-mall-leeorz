import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    FlatList
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../widgets/TitleBar';
import {
    content2TextColor, placeholderTextColor,
    titleTextColor
} from "../../constraint/Colors";
import {isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import RequestErrorView from "../../widgets/RequestErrorView";
import LoadingView from "../../widgets/LoadingView";
import {PAYMENTS_CONFIG} from "../../constraint/AssetsType";
import {formatMoney} from "../../common/StringUtil";
import EmptyView from '../../components/common/empty/EmptyView';

const width = Dimensions.get('window').width;

class OrderRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            data:null
        };
    };

    componentDidMount() {
        this._getOrderList();
    }

    _getOrderList() {
        let requestObj = {
            token: this.props.token,
        };
        post('order/company/getCompanyInOrderList', requestObj)
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                    })
                }
                else{
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
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._getOrderList();
            }}/>
        ) : (
            <View style={{flex: 1}}>
                <FlatList
                    ListHeaderComponent={<View style={{height:5}}/>}
                    ListFooterComponent={<View style={{height:5}}/>}
                    data={this.state.data}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    ListEmptyComponent={() => <EmptyView emptyTip={'您还没有服务费记录'} showRecommended={false}/>}
                    renderItem={({item, index}) =>
                        <View style={styles.backgroundStyle} key={index}>
                            <Text style={{margin: 15, fontSize: 16, color: titleTextColor}}>{item.name}</Text>
                            <View style={styles.lineStyle}/>
                            <View style={styles.viewStyle}>
                                <Text style={styles.leftTextStyle}>支付时间：</Text>
                                <Text style={styles.rightTextStyle}>{item.createTime}</Text>
                            </View>
                            <View style={styles.viewStyle}>
                                <Text style={styles.leftTextStyle}>支付明细：</Text>
                                <View style={{flexDirection: 'column'}}>
                                    {
                                        item.companyInOrderPays.map((payItem, index) => {
                                            return <Text key={index}
                                                         style={[styles.rightTextStyle, {marginBottom: index === item.companyInOrderPays.length - 1 ? 0 : 10}]}>{formatMoney(payItem.amount,false)+'('+PAYMENTS_CONFIG[payItem.accountType].name+')'}</Text>
                                        })
                                    }
                                </View>
                            </View>
                        </View>
                    }
                />
            </View>
        );
        return (
            <View style={styles.container}>
                <TitleBar title={'服务费记录'}
                          hideRight={true}/>
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
        marginBottom: 15
    },
    lineStyle: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom:15,
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