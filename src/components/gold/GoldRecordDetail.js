import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import TitleBar from '../../widgets/TitleBar';
import {
    content2TextColor, placeholderTextColor,
    titleTextColor
} from "../../constraint/Colors";
import IphoneModel from "../../widgets/IphoneModel";
import {getRequestFailTip, isSuccess, post} from "../../common/CommonRequest";
import {showToastShort} from "../../common/CommonToast";
import LoadingView from "../../widgets/LoadingView";
import RequestErrorView from "../../widgets/RequestErrorView";
import BaseComponent from "../../widgets/BaseComponent";
import {formatMoney} from "../../common/StringUtil";
var orderGoodsId;
class GoldRecordDetail extends BaseComponent {
    constructor(props) {
        super(props);
        orderGoodsId = this.props.navigation.state.params;
        this.state = {
            isRequestError: false,
            isLoading: true,
            data:{},
        };
    };

    componentDidMount() {
        this._loadRecordDetail();
    }

    _loadRecordDetail() {
        post('order/companyOrderGoods/getOrderGoodsRecordInfo',
            {token: this.props.token,'orderGoodsId':orderGoodsId})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                    })
                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            })
            .catch((e) => {
                this._errorMsg(e.message);
            });
    }

    _errorMsg(e){
        this.setState({
            isLoading: false,
            isRequestError: true,
        })
        showToastShort(getRequestFailTip(e));
    }

    render() {
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadRecordDetail();
            }}/>
        ) : (
            <View style={styles.container}>
                <ScrollView style={{flex: 1}}>
                    <View style={styles.backgroundStyle}>
                        {this.showText('订单号', this.state.data.orderId, content2TextColor)}
                        <View style={styles.lineStyle}/>
                        {this.showText('下单时间', this.state.data.createTime, content2TextColor)}
                    </View>
                    <View style={styles.backgroundStyle}>
                        {this.showText('套餐', this.state.data.activityName)}
                        <View style={styles.lineStyle}/>
                        {this.showText('价格', formatMoney(this.state.data.orderPrice))}
                        <View style={styles.lineStyle}/>
                        {this.showText('定金', formatMoney(this.state.data.earnestMoney))}
                        <View style={styles.lineStyle}/>
                        {this.showText('数量', this.state.data.goodsNumber)}
                        <View style={styles.lineStyle}/>
                        {this.showText('使用余额', formatMoney(this.state.data.balance,false))}
                        <View style={styles.lineStyle}/>
                        {this.showText('使用玉积分', formatMoney(this.state.data.jadeIntegral,false))}
                    </View>
                    <View style={styles.backgroundStyle}>
                        {this.showText('保单受益人:', '', content2TextColor)}
                        <View style={styles.lineStyle}/>
                        {this.showText('姓名', this.state.data.beneficiaryName)}
                        <View style={styles.lineStyle}/>
                        {this.showText('身份证号', this.state.data.beneficiaryIdentityCard)}
                        <View style={styles.lineStyle}/>
                        {this.showText('手机号码', this.state.data.beneficiaryPhone)}
                    </View>
                </ScrollView>
            </View>
        );
        return (

            <View style={styles.container}>
                <TitleBar title={'记录详情'}/>
                {this.state.isLoading ? <LoadingView/> : showView}
                <IphoneModel/>
            </View>
        )
    }

    showText(title, content, contentColor) {
        return <View style={styles.viewStyle}>
            <Text style={{fontSize: 14, color: titleTextColor}}>{title}</Text>
            <View style={{flex: 1}}/>
            <Text style={{fontSize: 14, color: contentColor}}>{content}</Text>
        </View>
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2'
    },
    backgroundStyle: {
        margin: 10,
        marginBottom: 0,
        backgroundColor: 'white',
        borderRadius: 4,
        shadowColor: '#c7c7c7',
        shadowOffset: {height: 2, width: 2},
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 2
    },
    viewStyle: {
        margin: 15,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    lineStyle: {
        marginLeft: 15,
        backgroundColor: placeholderTextColor,
        height: 0.5
    },
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        nav:state.nav,
    }
};

export default connect(selector)(GoldRecordDetail);