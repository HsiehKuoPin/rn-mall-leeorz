import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput
} from 'react-native';

import {connect} from 'react-redux';
import {
    content2TextColor, contentTextColor, mainBackgroundColor, mainColor, placeholderTextColor,
    titleTextColor
} from "../../../constraint/Colors";
import IphoneModel from "../../../widgets/IphoneModel";
import {showToastShort} from "../../../common/CommonToast";
import {getHost, isSuccess, post} from "../../../common/CommonRequest";
import LoadingView from "../../../widgets/LoadingView";
import RequestErrorView from "../../../widgets/RequestErrorView";
import {
    checkInputPassword, checkPhone, formatMoney,
    replaceBlank
} from "../../../common/StringUtil";
import {goto} from "../../../reducers/RouterReducer";
import BaseComponent from "../../../widgets/BaseComponent";
import XImage from "../../../widgets/XImage";
import {ic_selected, ic_un_selected} from "../../../constraint/Image";

class GoldDeposit extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRequestError: false,
            isLoading: true,
            data: null,
            amount: '1',
            name: '',
            idNumber: '',
            phone: '',
            deposit: '',
            balance: '',
            jade: '',
        };
    };

    componentDidMount() {
        this._loadGoldMessage();
    }

    _loadGoldMessage() {
        post('order/companyOrderGoods/activityInfo', {token: this.props.token})
            .then((responseData) => {
                if (isSuccess(responseData)) {
                    this.setState({
                        isLoading: false,
                        isRequestError: false,
                        data: responseData.result,
                        deposit: responseData.result.companyOrderGoods.earnestMoney,
                        balance: responseData.result.companyOrderGoods.balance,
                        jade: responseData.result.companyOrderGoods.jadeIntegral,
                    })
                } else if (this.checkUserTokenValid({response: responseData, title: '您的登录已失效'})) {
                    this._errorMsg(responseData.message);
                }
            })
            .catch((e) => {
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

    _getAgreement(){
        return <View style={{
            flexDirection: 'row',
            marginTop: 10,
            marginLeft: 15,
            marginRight: 10,
            marginBottom:10,
            alignItems: 'center',
        }}>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                activeOpacity={0.7}
                onPress={() => {
                    this.setState({
                        payDisable: !this.state.payDisable
                    })
                }}>
                <XImage
                    style={{
                        marginRight: 5,
                        width: 12,
                        height: 12,
                        resizeMode: 'cover',
                    }}
                    source={this.state.payDisable ? ic_un_selected : ic_selected}/>
                <Text style={{
                    color: contentTextColor,
                    fontSize: 14,
                    backgroundColor: 'transparent'
                }}>{'勾选即表示同意'}</Text>
            </TouchableOpacity>
            <Text
                style={{
                    color: '#65BCFE',
                    fontSize: 14,
                    textAlign: 'left',
                    flex: 1,
                }}
                suppressHighlighting={true}
                onPress={() => {
                    this.props.dispatch(goto('Agreement',{url:getHost()+'main/protocol_gold.html',title:'特殊商品服务条款'}));
                }}>
                《特殊商品服务条款》
            </Text>
        </View>
    }


    render() {
        var showView = this.state.isRequestError ? (
            <RequestErrorView onPress={() => {
                this.setState({isRequestError: false, isLoading: true,});
                this._loadGoldMessage();
            }}/>
        ) : (

            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <View style={styles.backgroundStyle}>
                        {this.showText('可用余额', this.state.data ? formatMoney(this.state.data.balance, false) : '', content2TextColor)}
                        <View style={styles.lineStyle}/>
                        {this.showText('可用玉积分', this.state.data ? formatMoney(this.state.data.jadeIntegral, false) : '', content2TextColor)}
                    </View>
                    <View style={styles.backgroundStyle}>
                        {this.showText('套餐', this.state.data ? this.state.data.companyOrderGoods.name : '')}
                        <View style={styles.lineStyle}/>
                        {this.showText('价格', this.state.data ? formatMoney(this.state.data.companyOrderGoods.orderPrice) : '')}
                        <View style={styles.lineStyle}/>
                        {this.showText('定金', formatMoney(this.state.deposit))}
                        <View style={styles.lineStyle}/>
                        {this.showTextInput('数量', '填写数量', 5, 'numeric', 85)}
                        <View style={styles.lineStyle}/>
                        {this.showText('使用余额', formatMoney(this.state.balance, false))}
                        <View style={styles.lineStyle}/>
                        {this.showText('使用玉积分', formatMoney(this.state.jade, false))}
                    </View>
                    <View style={[styles.backgroundStyle, {marginBottom: 10}]}>
                        {this.showText('保单受益人:', '', content2TextColor)}
                        <View style={styles.lineStyle}/>
                        {this.showTextInput('姓名', '填写保单受益人姓名', null, null, null)}
                        <View style={styles.lineStyle}/>
                        {this.showTextInput('身份证号', '填写保单受益人身份证号', null, 'numeric', null)}
                        <View style={styles.lineStyle}/>
                        {this.showTextInput('手机号码', '填写保单受益人手机号码', 11, 'numeric', null)}
                        <View style={styles.lineStyle}/>
                        {this._getAgreement()}
                    </View>
                </ScrollView>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.buttonStyle,{backgroundColor: this.state.payDisable?placeholderTextColor:mainColor}]}
                    onPress={() => {
                        if(this.state.payDisable){
                            showToastShort('请勾选同意《特殊商品服务条款》');
                            return;
                        }
                        let info = {};
                        Object.keys(this.state).map(key => Object.assign(info, {[key]: replaceBlank(this.state[key])}));
                        let {amount, name, idNumber, phone} = {...info};
                        if (amount.length === 0 || amount === '0') {
                            showToastShort('购买数量不能为空或0');
                            return;
                        }
                        else if (this.state.balance > this.state.data.balance) {
                            showToastShort('可用余额不足');
                            return;
                        }
                        else if (this.state.jade > this.state.data.jadeIntegral) {
                            showToastShort('可用玉积分不足');
                            return;
                        }
                        else if (name.length === 0) {
                            showToastShort('请输入姓名');
                            return;
                        }
                        else if (idNumber.length === 0) {
                            showToastShort('请输入身份证号码');
                            return;
                        }
                        else if (phone.length === 0) {
                            showToastShort('请输入手机号码');
                            return;
                        }
                        let itemData = {
                            ...itemData, goodsNumber: this.state.amount,
                            activityId: this.state.data.companyOrderGoods.id,
                            beneficiaryName: this.state.name,
                            beneficiaryIdentityCard: this.state.idNumber,
                            beneficiaryPhone: this.state.phone,
                            balance: this.state.balance,
                            jadeIntegral: this.state.jade
                        };
                        this.props.dispatch(goto('GoldPaymentDetail', itemData))
                    }}>
                    <Text style={{paddingVertical: 12, fontSize: 15, color: 'white'}}>立即定货</Text>
                </TouchableOpacity>
            </View>
        );
        return (
            <View style={styles.container}>
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

    showTextInput(title, tips, maxLength, keyboardType, width) {
        return <View style={[styles.viewStyle, {marginVertical: 10}]}>
            <Text style={{fontSize: 14, color: titleTextColor}}>{title}</Text>
            <View style={{flex: 1}}/>
            <TextInput
                maxLength={maxLength ? maxLength : 50}
                keyboardType={keyboardType ? keyboardType : 'default'}
                placeholder={tips}
                placeholderTextColor={placeholderTextColor}
                underlineColorAndroid={'transparent'}
                style={[styles.inputText, {width: width ? width : 180,textAlign:title === '数量'?'center':'left'}]}
                value={title === '数量' ? this.state.amount : null}
                onChangeText={(text) => {
                    switch (title) {
                        case '数量':
                            this.setState({
                                amount: checkInputPassword(text),
                                balance: parseFloat(text * this.state.data.companyOrderGoods.balance).toFixed(2),
                                jade: parseFloat(text * this.state.data.companyOrderGoods.jadeIntegral).toFixed(2),
                            });
                            break;
                        case '姓名':
                            this.setState({name: text});
                            break;
                        case '身份证号':
                            this.setState({idNumber: text});
                            break;
                        case '手机号码':
                            this.setState({phone: text});
                            break;
                    }
                }}
            />
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
    inputText: {
        backgroundColor: mainBackgroundColor,
        borderRadius: 3,
        borderWidth: 0.5,
        borderColor: placeholderTextColor,
        fontSize: 14,
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    buttonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: mainColor,
        elevation: 5
    }
});

selector = (state) => {
    return {
        token: state.loginStore.token,
        nav: state.nav,
    }
};

export default connect(selector)(GoldDeposit);